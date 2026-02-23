import { NextResponse } from 'next/server';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
// Use "TEST" for sandbox, "PROD" for live
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'TEST';

const BASE_URL =
  CASHFREE_ENV === 'PROD'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customer } = body;

    if (!items || !items.length || !total || !customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Generate a unique order ID
    const orderId = `DS_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

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
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id={order_id}&order_token={order_token}`,
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
