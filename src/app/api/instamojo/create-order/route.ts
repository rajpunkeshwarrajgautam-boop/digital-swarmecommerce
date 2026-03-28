import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY!;
const INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN!;
const INSTAMOJO_ENV = process.env.INSTAMOJO_ENV || 'TEST';

const BASE_URL =
  INSTAMOJO_ENV === 'PROD'
    ? 'https://www.instamojo.com/api/1.1'
    : 'https://test.instamojo.com/api/1.1';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customer } = body;

    if (!items || !items.length || !total || !customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Generate a unique order ID
    const orderId = `DS_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Step 1: Create Order in Supabase
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        total,
        status: 'pending',
        user_id: customer.email, 
        cashfree_order_id: orderId, // using this as a generic order_id
        customer_email: customer.email,
      })
      .select()
      .single();

    if (orderError) {
      console.error('[Supabase] Order creation failed:', orderError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Step 2: Create Order Items
    const orderItems = items.map((item: { id: string; price: number; quantity?: number }) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      price: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[Supabase] Order items failed:', itemsError);
    }

    // Step 3: Create Payment Request in Instamojo
    const payload = new URLSearchParams({
      purpose: 'Digital Swarm Assets',
      amount: total.toString(),
      buyer_name: `${customer.firstName} ${customer.lastName}`.trim(),
      email: customer.email,
      phone: customer.phone || '9999999999',
      redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      send_email: 'True',
      allow_repeated_payments: 'False'
    });

    const response = await fetch(`${BASE_URL}/payment-requests/`, {
      method: 'POST',
      headers: {
        'X-Api-Key': INSTAMOJO_API_KEY,
        'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload.toString(),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('[Instamojo] Order creation failed:', data);
      return NextResponse.json({ error: data.message ? JSON.stringify(data.message) : 'Payment gateway error' }, { status: 500 });
    }

    // Return the generated longurl to redirect the user
    return NextResponse.json({
      success: true,
      orderId: orderId, // Internal DS order ID
      paymentUrl: data.payment_request.longurl,
      paymentRequestId: data.payment_request.id,
    });
  } catch (err) {
    console.error('[Instamojo] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
