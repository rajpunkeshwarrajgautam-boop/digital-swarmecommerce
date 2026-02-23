import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');

    // Verify webhook signature
    if (signature && timestamp) {
      const signedPayload = `${timestamp}${body}`;
      const expectedSig = createHmac('sha256', CASHFREE_SECRET_KEY)
        .update(signedPayload)
        .digest('base64');

      if (expectedSig !== signature) {
        console.error('[Webhook] Invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const eventType = event.type;
    const orderData = event.data?.order;
    const paymentData = event.data?.payment;

    console.log(`[Cashfree Webhook] Event: ${eventType}`, { orderId: orderData?.order_id });

    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
      const orderId = orderData?.order_id;
      if (orderId) {
        // Update order status in Supabase
        const { error } = await supabaseAdmin
          .from('orders')
          .update({
            status: 'paid',
            payment_id: paymentData?.cf_payment_id,
          })
          .eq('cashfree_order_id', orderId);

        if (error) {
          console.error('[Webhook] DB update error:', error);
        } else {
          console.log(`[Webhook] Order ${orderId} marked as PAID`);
        }
      }
    }

    if (eventType === 'PAYMENT_FAILED_WEBHOOK') {
      const orderId = orderData?.order_id;
      if (orderId) {
        await supabaseAdmin
          .from('orders')
          .update({ status: 'failed' })
          .eq('cashfree_order_id', orderId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Webhook] Error:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
