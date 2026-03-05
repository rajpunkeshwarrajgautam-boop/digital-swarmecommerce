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
    // The orderId from Plural matches cashfree_order_id (re-used field for Plural order IDs)
    if (orderId.startsWith('DS_')) {
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('cashfree_order_id', orderId);

      if (updateError) {
        console.error('[Plural Verify] Failed to update order status:', updateError.message);
        // Don't fail the response — the payment check was successful
      }
    }

    return NextResponse.json({
      success: true,
      isPaid,
      status: response.ppc_TxnResponseMessage || response.ppc_PinePGTxnStatus,
      orderId: response.ppc_UniqueMerchantTxnID,
      // Convert paisa back to INR
      amount: parseInt(response.ppc_Amount || '0') / 100,
    });

  } catch (err) {
    console.error('[Plural Verify] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
