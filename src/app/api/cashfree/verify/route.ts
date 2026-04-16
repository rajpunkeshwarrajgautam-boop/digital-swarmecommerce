import { NextResponse } from 'next/server';

const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID!;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY!;
const isProdKey = CASHFREE_SECRET_KEY.startsWith('cfsk_ma_prod_');
const BASE_URL = isProdKey 
  ? 'https://api.cashfree.com/pg' 
  : 'https://sandbox.cashfree.com/pg';

import { supabaseAdmin } from '@/lib/supabase';
import { LedgerService } from '@/lib/ledger';
import { getNodeIdentity } from '@/lib/nodes';
import { CommissionService } from '@/lib/commissions';
import { TokenService } from '@/lib/token-minting';
import { fetchWithRetry } from '@/lib/http';

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const response = await fetchWithRetry(`${BASE_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'x-api-version': '2023-08-01',
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
      },
      timeoutMs: 8000,
      retries: 2,
      retryDelayMs: 500,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
    }

    const isPaid = data.order_status === 'PAID';
    const newStatus = isPaid ? 'paid' : data.order_status.toLowerCase();
    let transitionedToPaid = false;
    let internalOrderId: string | null = null;

    // ── Update Supabase order status ─────────────────────────────────────────
    if (orderId.startsWith('DS_') && supabaseAdmin) {
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('cashfree_order_id', orderId)
        .maybeSingle();

      internalOrderId = existingOrder?.id || null;
      transitionedToPaid = Boolean(isPaid && existingOrder && existingOrder.status !== 'paid');

      const { data: orderData, error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: newStatus,
          payment_id: data.cf_order_id, // Link to Cashfree order ID
          updated_at: new Date().toISOString(),
        })
        .eq('cashfree_order_id', orderId)
        .select('id, customer_email, status')
        .single();

      if (updateError) {
        console.error('[Cashfree Verify] Failed to update order status:', updateError.message);
      }

      // If just paid, trigger post-purchase logic (idempotent)
      if (transitionedToPaid && orderData && supabaseAdmin) {
        // 1. Check if license already exists
        const { data: existingLicense } = await supabaseAdmin
          .from('customer_licenses')
          .select('id')
          .eq('order_id', orderId)
          .maybeSingle();

        if (!existingLicense) {
          // 2. Fetch order items
          const { data: items } = await supabaseAdmin
            .from('order_items')
            .select('product_id')
            .eq('order_id', orderData.id);

          // 3. Generate License Key
          const licenseKey = `DS-${orderId.split('_').pop()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

          // 4. Create licenses
          if (items && items.length > 0) {
            const licenseInserts = items.map((item: { product_id: string }) => ({
              user_email: orderData.customer_email,
              order_id: orderId,
              license_key: `${licenseKey}-${item.product_id.substring(0, 4)}`,
              product_id: item.product_id,
              license_tier: 'standard',
            }));

            await supabaseAdmin.from('customer_licenses').insert(licenseInserts);
          }

          // 5. Trigger Webhook
          fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/purchase`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderId,
              customerEmail: orderData.customer_email,
              productId: items?.[0]?.product_id || "bundle"
            })
          }).catch(e => console.error("Internal webhook trigger failed", e));
        }
      }
    }

    // 🛸 [LEDGER PROTOCOL] Generate verifiable proof of purchase
    let ledgerEntry = null;
    const node = getNodeIdentity(request.headers);

    if (transitionedToPaid && internalOrderId) {
      try {
        const entry = LedgerService.signPurchase(
          orderId,
          data.order_amount,
          data.customer_details?.customer_email || 'anonymous@swarm.in'
        );
        // Tag with signing node
        ledgerEntry = { 
          orderId: entry.orderId,
          signature: entry.signature,
          timestamp: entry.timestamp,
          amount: entry.amount,
          customer: entry.customer,
          node_id: node.id, 
          region: node.region 
        };

        // 💰 [FINANCE PROTOCOL] Process commission split
        await CommissionService.calculateSplit(internalOrderId);

        // 🏗️ [TOKEN PROTOCOL] Mint Digital Swarm Tokens (NFTs)
        const mintResult = await TokenService.mintFromOrder(internalOrderId, entry.signature);
        if (mintResult.success) {
            console.log(`[VAULT] Tokens minted: ${mintResult.tokens.join(', ')}`);
        }

      } catch (ledgerErr) {
        console.error('[Ledger Protocol] Signing failed:', ledgerErr);
      }
    }

    return NextResponse.json({
      success: true,
      isPaid,
      status: data.order_status,
      orderId: data.order_id,
      amount: data.order_amount,
      ledger_entry: ledgerEntry,
    });
  } catch (err) {
    console.error('[Cashfree Verify] Error:', err);
    const error = err as Error;
    return NextResponse.json(
      {
        error:
          error.name === 'AbortError'
            ? 'Payment verification timed out. Please retry shortly.'
            : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

