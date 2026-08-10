import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchWithRetry } from '@/lib/http';

function safeOrderId(value: unknown): string {
  const id = typeof value === 'string' ? value.trim() : '';
  return /^DS_[A-Za-z0-9_-]{6,180}$/.test(id) ? id : '';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = safeOrderId(body?.orderId);
    if (!orderId) return NextResponse.json({ error: 'Valid order ID required' }, { status: 400 });

    const appId = process.env.CASHFREE_APP_ID?.trim();
    const secret = process.env.CASHFREE_SECRET_KEY?.trim();
    if (!appId || !secret) return NextResponse.json({ error: 'Payment verification unavailable' }, { status: 503 });
    if (!supabaseAdmin) return NextResponse.json({ error: 'Order database unavailable' }, { status: 503 });

    const isProduction = secret.startsWith('cfsk_ma_prod_');
    const baseUrl = isProduction ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

    const response = await fetchWithRetry(`${baseUrl}/orders/${encodeURIComponent(orderId)}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': appId,
        'x-client-secret': secret,
        Accept: 'application/json',
      },
      timeoutMs: 8000,
      retries: 2,
      retryDelayMs: 500,
    });

    const gatewayOrder = await response.json() as {
      order_id?: string;
      order_status?: string;
      order_amount?: number;
    };

    if (!response.ok || gatewayOrder.order_id !== orderId) {
      return NextResponse.json({ error: 'Could not verify payment' }, { status: response.ok ? 409 : 502 });
    }

    const isPaid = gatewayOrder.order_status === 'PAID';
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id,status,customer_email,total,total_amount')
      .eq('cashfree_order_id', orderId)
      .maybeSingle();

    if (orderError || !order) return NextResponse.json({ error: 'Local order not found' }, { status: 404 });

    if (!isPaid) {
      return NextResponse.json({
        success: true,
        isPaid: false,
        status: gatewayOrder.order_status || 'UNKNOWN',
        orderId,
      });
    }

    if (order.status !== 'paid') {
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ status: 'paid', updated_at: new Date().toISOString() })
        .eq('id', order.id);
      if (updateError) {
        console.error('[Cashfree verify] local paid transition failed:', updateError.message);
        return NextResponse.json({ error: 'Payment verified but local order update failed' }, { status: 503 });
      }
    }

    const { data: items, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select('product_id')
      .eq('order_id', order.id);
    if (itemsError || !items?.length) {
      return NextResponse.json({ error: 'Payment verified but order items are unavailable' }, { status: 503 });
    }

    const internalSecret = process.env.INTERNAL_FULFILLMENT_SECRET?.trim();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://digitalswarm.in').replace(/\/$/, '');
    let fulfilledItems = 0;
    let fulfillmentPending = false;

    if (!internalSecret || internalSecret.length < 32) {
      console.error('[Cashfree verify] INTERNAL_FULFILLMENT_SECRET missing');
      fulfillmentPending = true;
    } else {
      for (const item of items) {
        try {
          const fulfillment = await fetch(`${siteUrl}/api/webhooks/purchase`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-internal-fulfillment-secret': internalSecret,
            },
            body: JSON.stringify({ orderId, productId: item.product_id }),
          });
          if (fulfillment.ok) fulfilledItems += 1;
          else fulfillmentPending = true;
        } catch (error) {
          console.error('[Cashfree verify] fulfillment fallback failed:', error);
          fulfillmentPending = true;
        }
      }
    }

    const { count: licenseCount } = await supabaseAdmin
      .from('customer_licenses')
      .select('id', { count: 'exact', head: true })
      .eq('order_id', orderId);

    return NextResponse.json({
      success: true,
      isPaid: true,
      status: 'PAID',
      orderId,
      amount: Number(order.total_amount ?? order.total ?? gatewayOrder.order_amount ?? 0),
      itemCount: items.length,
      licensedItems: licenseCount || fulfilledItems,
      fulfillment: fulfillmentPending ? 'processing' : 'complete',
    });
  } catch (error) {
    console.error('[Cashfree verify] unexpected error:', error);
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 });
  }
}
