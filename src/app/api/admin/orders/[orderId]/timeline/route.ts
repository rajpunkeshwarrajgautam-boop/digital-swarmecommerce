import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

const MASTER_ADMIN_EMAILS = [
  "admin@digitalswarm.in",
  "rajpunkeshwarrajgautam@gmail.com",
  "test@example.com",
];

type TimelineEntry = {
  timestamp: string;
  title: string;
  detail: string;
  kind: "order" | "payment" | "webhook" | "license";
};

export async function GET(
  _request: Request,
  props: { params: Promise<{ orderId: string }> | { orderId: string } }
) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase();

    if (!primaryEmail || !MASTER_ADMIN_EMAILS.includes(primaryEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database service unavailable" }, { status: 500 });
    }

    const params = await props.params;
    const orderId = params.orderId;

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, created_at, updated_at, status, cashfree_order_id, payment_id, customer_email")
      .eq("id", orderId)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const [webhookLogsResult, licensesResult] = await Promise.all([
      supabaseAdmin
        .from("webhook_logs")
        .select("event_type, status, processed_at, cf_payment_id")
        .eq("cf_order_id", order.cashfree_order_id || order.id)
        .order("processed_at", { ascending: true }),
      supabaseAdmin
        .from("customer_licenses")
        .select("license_key, created_at, product_id")
        .eq("order_id", order.cashfree_order_id || order.id)
        .order("created_at", { ascending: true }),
    ]);

    const entries: TimelineEntry[] = [
      {
        timestamp: order.created_at,
        title: "Order created",
        detail: `Status: ${order.status}`,
        kind: "order",
      },
    ];

    if (order.payment_id) {
      entries.push({
        timestamp: order.updated_at || order.created_at,
        title: "Payment reference attached",
        detail: `Payment ID: ${order.payment_id}`,
        kind: "payment",
      });
    }

    for (const log of webhookLogsResult.data || []) {
      entries.push({
        timestamp: log.processed_at,
        title: log.event_type,
        detail: `${log.status}${log.cf_payment_id ? ` // ${log.cf_payment_id}` : ""}`,
        kind: "webhook",
      });
    }

    for (const license of licensesResult.data || []) {
      entries.push({
        timestamp: license.created_at,
        title: "License issued",
        detail: `${license.product_id} // ${license.license_key.slice(0, 18)}...`,
        kind: "license",
      });
    }

    entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        cashfreeOrderId: order.cashfree_order_id,
        customerEmail: order.customer_email,
        status: order.status,
      },
      timeline: entries,
      diagnostics: {
        webhookLogsAvailable: !webhookLogsResult.error,
        licensesFound: (licensesResult.data || []).length,
      },
    });
  } catch (error) {
    console.error("[ADMIN_ORDER_TIMELINE_ERR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
