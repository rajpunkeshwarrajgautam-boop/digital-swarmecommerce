import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabase";

let stripeInstance: Stripe | null = null;
const getStripe = () => {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-01-27-preview" as any,
    });
  }
  return stripeInstance;
};

export async function POST(req: Request) {
  const stripe = getStripe();
  try {
    const { items, currency = "usd", customer } = await req.json();

    if (!items || !items.length || !customer?.email) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100 * 0.012), // Rough conversion for example
      },
      quantity: item.quantity || 1,
    }));

    // 1. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      customer_email: customer.email,
    });

    // 2. Create Order in Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        total: items.reduce((acc: number, item: any) => acc + (item.price * (item.quantity || 1)), 0),
        status: "pending",
        user_id: customer.email,
        stripe_session_id: session.id,
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_phone: customer.phone.replace(/[^0-9]/g, "") || "9999999999",
      })
      .select()
      .single();

    if (orderError) {
      console.error("[DB Error Stripe]", orderError);
    }

    // 3. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order?.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      price: item.price,
    }));
    await supabaseAdmin.from("order_items").insert(orderItems);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
