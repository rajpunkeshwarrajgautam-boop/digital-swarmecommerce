import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const PLURAL_MID = process.env.NEXT_PUBLIC_PLURAL_MID!;
const PLURAL_ACCESS_CODE = process.env.PLURAL_ACCESS_CODE!;
const PLURAL_SECRET_KEY = process.env.PLURAL_SECRET_KEY!;
const PLURAL_ENV = process.env.PLURAL_ENV || 'TEST';
const isTest = PLURAL_ENV === 'TEST';

/**
 * POST /api/plural/verify
 * Verifies a Pine Labs (Plural) payment and updates the Supabase order status.
 */
export async function POST(request: Request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pinelabs = require('pinelabs_node').default(
      PLURAL_MID,
      PLURAL_ACCESS_CODE,
      PLURAL_SECRET_KEY,
      isTest
    );

    // txnType 3 = order status fetch (Pine Labs SDK docs)
    const response = await pinelabs.payment.fetch(orderId, 3);

    if (!response || !response.ppc_PinePGTxnStatus) {
      return NextResponse.json({ error: 'Could not verify payment status' }, { status: 500 });
    }

    // Pine Labs status "4" = successful capture
    const isPaid = response.ppc_PinePGTxnStatus === '4';
    const newStatus = isPaid ? 'paid' : 'failed';

    // ── Update Supabase order status ─────────────────────────────────────────
    if (orderId.startsWith('DS_') || orderId.startsWith('ORDER_')) {
      const { data: orderData, error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('cashfree_order_id', orderId)
        .select('id, customer_email, status')
        .single();

      if (updateError) {
        console.error('[Plural Verify] Failed to update order status:', updateError.message);
      }

      // If just paid, trigger post-purchase logic (idempotent)
      if (isPaid && orderData) {
        // 1. Check if license already exists (idempotency)
        const { data: existingLicense } = await supabaseAdmin
          .from('customer_licenses')
          .select('id')
          .eq('order_id', orderId)
          .single();

        if (!existingLicense) {
          console.log(`[Plural Verify] Generating new license for: ${orderData.customer_email}`);
          
          // 2. Fetch order items to get product IDs
          const { data: items } = await supabaseAdmin
            .from('order_items')
            .select('product_id')
            .eq('order_id', orderData.id);

          // 3. Generate License Key
          const licenseKey = `DS-${orderId.split('_').pop()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

          // 4. Create licenses (Atomic)
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

          // 5. Trigger Webhook (Async/Fire-and-forget) to handle Emails etc.
          // Note: We call it internally if possible or just assume Success page handles UI.
          // The /api/webhooks/purchase route can also be called.
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

    return NextResponse.json({
      success: true,
      isPaid,
      status: response.ppc_TxnResponseMessage || response.ppc_PinePGTxnStatus,
      orderId: response.ppc_UniqueMerchantTxnID,
      amount: parseInt(response.ppc_Amount || '0') / 100,
    });

  } catch (err) {
    console.error('[Plural Verify] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

