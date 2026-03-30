import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');

    // 1. Signature Verification
    if (signature && timestamp) {
      const signedPayload = `${timestamp}${body}`;
      const expectedSig = createHmac('sha256', CASHFREE_SECRET_KEY)
        .update(signedPayload)
        .digest('base64');

      if (expectedSig !== signature) {
        console.error('[Webhook] Invalid signature detected');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const eventType = event.type;
    const orderData = event.data?.order;
    const paymentData = event.data?.payment;
    const cfOrderId = orderData?.order_id;
    const cfPaymentId = paymentData?.cf_payment_id;

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin client not initialized' }, { status: 500 });
    }

    // 2. Idempotency Check & Structured Logging
    // Check if we've already successfully processed this payment ID for this event type
    const { data: existingLog } = await supabaseAdmin
      .from('webhook_logs')
      .select('status')
      .eq('cf_payment_id', cfPaymentId)
      .eq('event_type', eventType)
      .single();

    if (existingLog?.status === 'success') {
      console.log(`[Webhook] Duplicate event ignored: ${cfPaymentId} (${eventType})`);
      return NextResponse.json({ success: true, message: 'Duplicate event' });
    }

    // Initialize Log Entry (Atomic Log)
    const { data: logEntry, error: logError } = await supabaseAdmin
      .from('webhook_logs')
      .upsert({
        cf_order_id: cfOrderId,
        cf_payment_id: cfPaymentId,
        event_type: eventType,
        raw_payload: event,
        status: 'pending'
      })
      .select('id')
      .single();

    if (logError) {
      console.error('[Webhook] Log initialization failed:', logError);
    }

    // 3. Status Transitions
    if (eventType === 'PAYMENT_SUCCESS_WEBHOOK') {
      // 4. Update order status
      const { data: dbOrder, error: orderUpdateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          payment_id: cfPaymentId,
        })
        .eq('cashfree_order_id', cfOrderId)
        .select('customer_email, id')
        .single();

      if (orderUpdateError) {
        console.error('[Webhooks] DB update failed for order:', cfOrderId, orderUpdateError);
        if (logEntry?.id) {
          await supabaseAdmin.from('webhook_logs').update({ status: 'error' }).eq('id', logEntry.id);
        }
        return NextResponse.json({ error: 'DB Update Failed' }, { status: 500 });
      }

      if (dbOrder) {
        // 5. Trigger fulfillment (Atomic/Async)
        const { data: orderItems } = await supabaseAdmin
          .from('order_items')
          .select('product_id')
          .eq('order_id', dbOrder.id);

        const productId = orderItems && orderItems.length > 0 ? orderItems[0].product_id : 'unknown';
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

        try {
          const fulfillmentRes = await fetch(`${siteUrl}/api/webhooks/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: cfOrderId,
              customerEmail: dbOrder.customer_email,
              productId: productId
            })
          });

          if (!fulfillmentRes.ok) throw new Error(`Fulfillment Response: ${fulfillmentRes.status}`);

          // Mark log as successful
          if (logEntry?.id) {
            await supabaseAdmin.from('webhook_logs').update({ status: 'success' }).eq('id', logEntry.id);
          }
        } catch (fulfillmentError) {
          console.error('[Webhooks] Fulfillment trigger failed:', fulfillmentError);
          if (logEntry?.id) {
            await supabaseAdmin.from('webhook_logs').update({ status: 'partial_success_fulfillment_failed' }).eq('id', logEntry.id);
          }
        }
      }
    }

    if (eventType === 'PAYMENT_FAILED_WEBHOOK') {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed' })
        .eq('cashfree_order_id', cfOrderId);
      
      await supabaseAdmin.from('webhook_logs').update({ status: 'success' }).eq('id', logEntry?.id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Webhook] Critical failure:', err);
    return NextResponse.json({ error: 'Critical webhook failure' }, { status: 500 });
  }
}
