import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

const SUCCESS_EVENT = "PAYMENT_SUCCESS_WEBHOOK";
const FAILED_EVENT = "PAYMENT_FAILED_WEBHOOK";

function safeSignatureEqual(actual: string, expected: string): boolean {
  if (!actual || actual.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const secret = process.env.CASHFREE_SECRET_KEY?.trim();
    if (!secret) {
      console.error("[Webhook] CASHFREE_SECRET_KEY missing");
      return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 });
    }

    const body = await request.text();
    const signature = request.headers.get("x-webhook-signature") || "";
    const timestamp = request.headers.get("x-webhook-timestamp") || "";

    if (!signature || !timestamp) {
      return NextResponse.json({ error: "Missing security headers" }, { status: 401 });
    }

    const webhookTime = Number(timestamp);
    if (!Number.isFinite(webhookTime) || Math.abs(Date.now() - webhookTime) > 5 * 60 * 1000) {
      return NextResponse.json({ error: "Timestamp expired" }, { status: 401 });
    }

    const expectedSignature = createHmac("sha256", secret)
      .update(`${timestamp}${body}`)
      .digest("base64");

    if (!safeSignatureEqual(signature, expectedSignature)) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventType = event?.type;
    const orderData = event?.data?.order;
    const paymentData = event?.data?.payment;
    const cfOrderId = orderData?.order_id;
    const cfPaymentId = paymentData?.cf_payment_id;

    if (!eventType || !cfOrderId || !cfPaymentId) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const { data: existingLog } = await supabaseAdmin
      .from("webhook_logs")
      .select("status")
      .eq("cf_payment_id", cfPaymentId)
      .eq("event_type", eventType)
      .maybeSingle();

    if (existingLog?.status === "success") {
      return NextResponse.json({ success: true, message: "Duplicate event ignored" });
    }

    const { data: logEntry, error: logError } = await supabaseAdmin
      .from("webhook_logs")
      .upsert({
        cf_order_id: cfOrderId,
        cf_payment_id: cfPaymentId,
        event_type: eventType,
        raw_payload: event,
        status: "pending",
      }, { onConflict: "cf_payment_id,event_type" })
      .select("id")
      .single();

    if (logError) console.error("[Webhook] Log initialization failed:", logError);

    if (eventType === SUCCESS_EVENT) {
      const { data: existingOrder } = await supabaseAdmin
        .from("orders")
        .select("id, customer_email, status")
        .eq("cashfree_order_id", cfOrderId)
        .maybeSingle();

      if (!existingOrder) {
        if (logEntry?.id) await supabaseAdmin.from("webhook_logs").update({ status: "error" }).eq("id", logEntry.id);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      const transitionedToPaid = existingOrder.status !== "paid";
      const { data: dbOrder, error: updateError } = await supabaseAdmin
        .from("orders")
        .update({ status: "paid", payment_id: cfPaymentId })
        .eq("cashfree_order_id", cfOrderId)
        .select("customer_email, id, status")
        .single();

      if (updateError || !dbOrder) {
        if (logEntry?.id) await supabaseAdmin.from("webhook_logs").update({ status: "error" }).eq("id", logEntry.id);
        return NextResponse.json({ error: "Order update failed" }, { status: 500 });
      }

      if (transitionedToPaid) {
        const internalSecret = process.env.INTERNAL_FULFILLMENT_SECRET?.trim();
        if (!internalSecret || internalSecret.length < 32) {
          if (logEntry?.id) await supabaseAdmin.from("webhook_logs").update({ status: "partial_success_fulfillment_failed" }).eq("id", logEntry.id);
          console.error("[Webhook] INTERNAL_FULFILLMENT_SECRET missing");
          return NextResponse.json({ error: "Fulfillment unavailable" }, { status: 503 });
        }

        const { data: orderItems } = await supabaseAdmin
          .from("order_items")
          .select("product_id")
          .eq("order_id", dbOrder.id);
        const productId = orderItems?.[0]?.product_id || "unknown";
        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in").replace(/\/$/, "");

        try {
          const fulfillmentResponse = await fetch(`${siteUrl}/api/webhooks/purchase`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-fulfillment-secret": internalSecret,
            },
            body: JSON.stringify({
              orderId: cfOrderId,
              customerEmail: dbOrder.customer_email,
              productId,
            }),
          });

          if (!fulfillmentResponse.ok) {
            throw new Error(`Fulfillment response ${fulfillmentResponse.status}`);
          }
        } catch (fulfillmentError) {
          console.error("[Webhook] Fulfillment trigger failed:", fulfillmentError);
          if (logEntry?.id) await supabaseAdmin.from("webhook_logs").update({ status: "partial_success_fulfillment_failed" }).eq("id", logEntry.id);
          return NextResponse.json({ success: true, fulfillment: "pending_retry" });
        }
      }

      if (logEntry?.id) await supabaseAdmin.from("webhook_logs").update({ status: "success" }).eq("id", logEntry.id);
      return NextResponse.json({ success: true });
    }

    if (eventType === FAILED_EVENT) {
      await supabaseAdmin.from("orders").update({ status: "failed" }).eq("cashfree_order_id", cfOrderId);
      if (logEntry?.id) await supabaseAdmin.from("webhook_logs").update({ status: "success" }).eq("id", logEntry.id);
      return NextResponse.json({ success: true });
    }

    if (logEntry?.id) await supabaseAdmin.from("webhook_logs").update({ status: "success" }).eq("id", logEntry.id);
    return NextResponse.json({ success: true, message: "Unhandled event ignored" });
  } catch (error) {
    console.error("[Webhook] Critical failure:", error);
    return NextResponse.json({ error: "Critical webhook failure" }, { status: 500 });
  }
}
