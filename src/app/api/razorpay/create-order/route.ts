import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase";

let razorpayInstance: Razorpay | null = null;
const getRazorpay = () => {
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: (process.env.RAZORPAY_KEY_ID || "").trim(),
      key_secret: (process.env.RAZORPAY_KEY_SECRET || "").trim(),
    });
  }
  return razorpayInstance;
};

export async function POST(req: Request) {
  const razorpay = getRazorpay();
  try {
    const { amount, currency = "INR", receipt, items, customer } = await req.json();

    if (!items || !items.length || !amount || !customer?.email) {
      return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
    }

    // 1. Create Razorpay Order
    const razorOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
    });

    // 2. Sync to Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        total: parseFloat(amount),
        status: "pending",
        user_id: customer.email,
        razorpay_order_id: razorOrder.id,
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_phone: customer.phone.replace(/[^0-9]/g, "") || "9999999999",
      })
      .select()
      .single();

    if (orderError) {
      console.error("[DB Error Razorpay]", orderError);
      return NextResponse.json({ error: "Database sync failed" }, { status: 500 });
    }

    // 3. Create Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      price: item.price,
    }));
    await supabaseAdmin.from("order_items").insert(orderItems);

    return NextResponse.json({ ...razorOrder, orderId: order.id });
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
