import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27-preview" as any,
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "No Session ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Update Supabase
      // Note: We might not have created the order yet if we relied on Stripe's direct flow.
      // But for consistency, we should have a pre-created order or create it now.
      
      const { error } = await supabaseAdmin
        .from("orders")
        .update({ status: "paid", payment_id: session.payment_intent as string })
        .eq("stripe_session_id", sessionId);

      if (error) {
         // Fallback: If not found, it might be due to the session_id not being stored yet.
         // We might need a webhook for robust handling, but for this success page verification:
         console.warn("Order not found for session_id, possibly pending webhook:", sessionId);
      }

      return NextResponse.json({ success: true, status: session.payment_status });
    }

    return NextResponse.json({ success: false, status: session.payment_status });
  } catch (error: any) {
    console.error("Stripe Verify Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
