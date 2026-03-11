import { NextResponse } from 'next/server';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
// Use "TEST" for sandbox, "PROD" for live
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'TEST';

const BASE_URL =
  CASHFREE_ENV === 'PROD'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

import { supabaseAdmin } from '@/lib/supabase';

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
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        total,
        status: 'pending',
        user_id: customer.email, // Use email if no auth, or actual userId if logged in
        cashfree_order_id: orderId,
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`,
        customer_phone: customer.phone || '9999999999',
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
      // We don't fail the whole request but log it
    }

    const payload = {
      order_id: orderId,
      order_amount: total,
      order_currency: 'INR',
      customer_details: {
        customer_id: customer.email.replace(/[^a-zA-Z0-9_-]/g, '_'),
        customer_email: customer.email,
        customer_phone: customer.phone || '9999999999',
        customer_name: `${customer.firstName} ${customer.lastName}`,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id={order_id}`,
        notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/cashfree/webhook`,
      },
      order_note: `Digital Swarm Order: ${items.map((i: { name: string }) => i.name).join(', ')}`,
    };

    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[Cashfree] Order creation failed:', data);
      return NextResponse.json({ error: data.message || 'Payment gateway error' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: data.order_id,
      paymentSessionId: data.payment_session_id,
      cfOrderId: data.cf_order_id,
    });
  } catch (err) {
    console.error('[Cashfree] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
