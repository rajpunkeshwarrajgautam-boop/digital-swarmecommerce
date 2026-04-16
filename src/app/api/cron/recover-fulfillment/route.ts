import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

type WebhookLogRow = {
  id: string;
  cf_order_id: string;
  status: string;
  processed_at: string;
};

type SupabaseError = {
  code?: string;
  message?: string;
};

/**
 * Retries purchase fulfillment for webhook rows that reached paid status
 * but failed during downstream provisioning.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized CRON execution' }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin unavailable' }, { status: 500 });
  }

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

    const { data: stuckLogs, error: fetchError } = await supabaseAdmin
      .from('webhook_logs')
      .select('id, cf_order_id, status, processed_at')
      .eq('event_type', 'PAYMENT_SUCCESS_WEBHOOK')
      .in('status', ['partial_success_fulfillment_failed', 'pending'])
      .gt('processed_at', twentyFourHoursAgo)
      .order('processed_at', { ascending: true })
      .limit(50);

    if (fetchError) {
      const err = fetchError as SupabaseError;
      if (err.code === 'PGRST205') {
        // Some environments may not yet have webhook_logs migrated.
        return NextResponse.json({
          success: true,
          scanned: 0,
          recovered: 0,
          failed: 0,
          skipped: true,
          message: 'webhook_logs table not available in this environment',
        });
      }
      throw fetchError;
    }

    if (!stuckLogs || stuckLogs.length === 0) {
      return NextResponse.json({
        success: true,
        scanned: 0,
        recovered: 0,
        failed: 0,
        message: 'No fulfillment retries required',
      });
    }

    let recovered = 0;
    let failed = 0;

    for (const log of stuckLogs as WebhookLogRow[]) {
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id, customer_email, status')
        .eq('cashfree_order_id', log.cf_order_id)
        .maybeSingle();

      if (!order || order.status !== 'paid') {
        await supabaseAdmin
          .from('webhook_logs')
          .update({ status: 'error' })
          .eq('id', log.id);
        failed += 1;
        continue;
      }

      const { data: orderItems } = await supabaseAdmin
        .from('order_items')
        .select('product_id')
        .eq('order_id', order.id);

      const productId = orderItems?.[0]?.product_id || 'unknown';

      try {
        const fulfillmentRes = await fetch(`${siteUrl}/api/webhooks/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: log.cf_order_id,
            customerEmail: order.customer_email,
            productId,
          }),
        });

        if (!fulfillmentRes.ok) {
          throw new Error(`Fulfillment response ${fulfillmentRes.status}`);
        }

        await supabaseAdmin
          .from('webhook_logs')
          .update({ status: 'success' })
          .eq('id', log.id);
        recovered += 1;
      } catch (retryError) {
        console.error('[Recover Fulfillment] Retry failed:', retryError);
        await supabaseAdmin
          .from('webhook_logs')
          .update({ status: 'partial_success_fulfillment_failed' })
          .eq('id', log.id);
        failed += 1;
      }
    }

    return NextResponse.json({
      success: true,
      scanned: stuckLogs.length,
      recovered,
      failed,
    });
  } catch (err) {
    console.error('[Recover Fulfillment] Critical failure:', err);
    return NextResponse.json({ error: 'Internal reconciliation failure' }, { status: 500 });
  }
}
