import { NextResponse } from 'next/server';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const CASHFREE_ENV = process.env.CASHFREE_ENV || 'TEST';

const BASE_URL =
  CASHFREE_ENV === 'PROD'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
    }

    const isPaid = data.order_status === 'PAID';

    return NextResponse.json({
      success: true,
      isPaid,
      status: data.order_status,
      orderId: data.order_id,
      amount: data.order_amount,
    });
  } catch (err) {
    console.error('[Cashfree Verify] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
