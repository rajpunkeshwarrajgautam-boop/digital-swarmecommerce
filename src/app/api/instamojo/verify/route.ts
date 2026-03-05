import { NextResponse } from 'next/server';

const INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY!;
const INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN!;
const INSTAMOJO_ENV = process.env.INSTAMOJO_ENV || 'TEST';

const BASE_URL =
  INSTAMOJO_ENV === 'PROD'
    ? 'https://www.instamojo.com/api/1.1'
    : 'https://test.instamojo.com/api/1.1';

export async function POST(request: Request) {
  try {
    const { paymentRequestId } = await request.json();

    if (!paymentRequestId) {
      return NextResponse.json({ error: 'paymentRequestId required' }, { status: 400 });
    }

    const response = await fetch(`${BASE_URL}/payment-requests/${paymentRequestId}/`, {
      method: 'GET',
      headers: {
        'X-Api-Key': INSTAMOJO_API_KEY,
        'X-Auth-Token': INSTAMOJO_AUTH_TOKEN,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return NextResponse.json({ error: 'Could not verify payment request' }, { status: 500 });
    }

    // A payment request is 'Completed' once fully paid
    const isPaid = data.payment_request.status === 'Completed';

    return NextResponse.json({
      success: true,
      isPaid,
      status: data.payment_request.status,
      orderId: data.payment_request.id, // instamojo request id
      amount: data.payment_request.amount,
    });
  } catch (err) {
    console.error('[Instamojo Verify] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
