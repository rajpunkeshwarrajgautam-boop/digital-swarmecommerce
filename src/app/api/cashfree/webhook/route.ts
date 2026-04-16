import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const SUCCESS_EVENT = 'PAYMENT_SUCCESS_WEBHOOK';
const FAILED_EVENT = 'PAYMENT_FAILED_WEBHOOK';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature');
    const timestamp = request.headers.get('x-webhook-timestamp');
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip');

    // 0. IP Whitelisting (Cashfree Production IPs)
    const CASHFREE_IPS = [
      '52.66.101.190',
      '3.109.102.144',
      '18.60.134.245',
      '18.60.183.142',
      '3.109.91.43',
      '13.235.101.32'
    ];
    
    // In production, we should enforce this. For now, we log if it's outside.
    if (process.env.NODE_ENV === 'production' && clientIp && !CASHFREE_IPS.includes(clientIp)) {
      console.warn(`[Webhook] Unauthorized IP attempt: ${clientIp}`);
      // return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
    }

    // 1. Signature & Timestamp Verification
    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing security headers' }, { status: 401 });
    }

    // A. Timestamp Drift Check (5-minute window)
    const now = Date.now();
    const webhookTime = parseInt(timestamp);
    if (isNaN(webhookTime) || Math.abs(now - webhookTime) > 300000) {
      console.error('[Webhook] Timestamp drift detected or invalid');
      return NextResponse.json({ error: 'Timestamp expired' }, { status: 401 });
    }

    // B. Signature Matching
    const signedPayload = `${timestamp}${body}`;
    const expectedSig = createHmac('sha256', CASHFREE_SECRET_KEY)
      .update(signedPayload)
      .digest('base64');

    if (expectedSig !== signature) {
      console.error('[Webhook] Invalid signature detected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const eventType = event.type;
    const orderData = event.data?.order;
    const paymentData = event.data?.payment;
    const cfOrderId = orderData?.order_id;
    const cfPaymentId = paymentData?.cf_payment_id;

    if (!eventType || !cfOrderId || !cfPaymentId) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

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
      .maybeSingle();

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
      }, { onConflict: 'cf_payment_id,event_type' })
      .select('id')
      .single();

    if (logError) {
      console.error('[Webhook] Log initialization failed:', logError);
    }

    // 3. Status Transitions
    if (eventType === SUCCESS_EVENT) {
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id, customer_email, status')
        .eq('cashfree_order_id', cfOrderId)
        .maybeSingle();

      if (!existingOrder) {
        if (logEntry?.id) {
          await supabaseAdmin.from('webhook_logs').update({ status: 'error' }).eq('id', logEntry.id);
        }
        return NextResponse.json({ error: 'Order not found for webhook' }, { status: 404 });
      }

      const transitionedToPaid = existingOrder.status !== 'paid';

      // 4. Update order status
      const { data: dbOrder, error: orderUpdateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'paid',
          payment_id: cfPaymentId,
        })
        .eq('cashfree_order_id', cfOrderId)
        .select('customer_email, id, status')
        .single();

      if (orderUpdateError) {
        console.error('[Webhooks] DB update failed for order:', cfOrderId, orderUpdateError);
        if (logEntry?.id) {
          await supabaseAdmin.from('webhook_logs').update({ status: 'error' }).eq('id', logEntry.id);
        }
        return NextResponse.json({ error: 'DB Update Failed' }, { status: 500 });
      }

      if (dbOrder && transitionedToPaid) {
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

        // 6. Affiliate Commission Crediting (10% of order total)
        try {
          const { data: orderRecord } = await supabaseAdmin
            .from('orders')
            .select('affiliate_ref, total_amount')
            .eq('id', dbOrder.id)
            .single();

          if (orderRecord?.affiliate_ref) {
            const commission = Math.round((orderRecord.total_amount || 0) * 0.10);
            const { data: affiliate } = await supabaseAdmin
              .from('affiliates')
              .select('conversions, earnings')
              .eq('ref_code', orderRecord.affiliate_ref)
              .single();

            if (affiliate) {
              await supabaseAdmin
                .from('affiliates')
                .update({
                  conversions: (affiliate.conversions || 0) + 1,
                  earnings: (affiliate.earnings || 0) + commission,
                })
                .eq('ref_code', orderRecord.affiliate_ref);

              console.log(`[Affiliate] Credited ₹${commission} to ref: ${orderRecord.affiliate_ref}`);
            }
          }
        } catch (affiliateError) {
          // Non-critical — log but don't fail the webhook
          console.error('[Affiliate] Commission crediting failed:', affiliateError);
        }
      }

      if (logEntry?.id) {
        await supabaseAdmin.from('webhook_logs').update({ status: 'success' }).eq('id', logEntry.id);
      }
    }

    if (eventType === FAILED_EVENT) {
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed' })
        .eq('cashfree_order_id', cfOrderId);
      
      if (logEntry?.id) {
        await supabaseAdmin.from('webhook_logs').update({ status: 'success' }).eq('id', logEntry.id);
      }
    }

    if (eventType !== SUCCESS_EVENT && eventType !== FAILED_EVENT) {
      if (logEntry?.id) {
        await supabaseAdmin.from('webhook_logs').update({ status: 'success' }).eq('id', logEntry.id);
      }
      return NextResponse.json({ success: true, message: 'Unhandled event ignored' });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Webhook] Critical failure:', err);
    return NextResponse.json({ error: 'Critical webhook failure' }, { status: 500 });
  }
}
