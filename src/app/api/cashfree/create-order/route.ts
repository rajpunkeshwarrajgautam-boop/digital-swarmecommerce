import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { env } from '@/lib/env';
import { fetchWithRetry } from '@/lib/http';

type CheckoutItem = { id?: string; productId?: string; price: number; quantity?: number };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customer, currency = 'INR' } = body;

    const EXCHANGE_RATES: Record<string, number> = {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0094,
    };

    const rate = EXCHANGE_RATES[currency as string] || 1;
    const convertedTotal = (parseFloat(total) * rate).toFixed(2);

    const CLIENT_ID = env.CASHFREE_APP_ID!;
    const CLIENT_SECRET = env.CASHFREE_SECRET_KEY!;
    
    // Hard-detect environment based on the Secret Key signature
    const isProdKey = CLIENT_SECRET.startsWith('cfsk_ma_prod_');
    const BASE_URL = isProdKey 
      ? 'https://api.cashfree.com/pg' 
      : 'https://sandbox.cashfree.com/pg';

    const SITE_URL = env.NEXT_PUBLIC_SITE_URL!.replace(/\/$/, '');

    if (!items || !items.length || !total || !customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const normalizedPhone = String(customer.phone || '').replace(/[^0-9]/g, '');
    const safePhone = normalizedPhone || '9999999999';

    // 1. Generate clean Order ID
    const orderId = `DS_${Date.now()}`;

    // 1.5. Resolve Affiliate Cookie → get ref_code for commission attribution
    const cookieStore = await cookies();
    const affiliateRef = cookieStore.get('affiliate_id')?.value || null;

    // Validate the ref_code exists in our affiliates table (prevents spoofing)
    let validatedAffiliateRef: string | null = null;
    if (affiliateRef && supabaseAdmin) {
      const { data: affiliateMatch } = await supabaseAdmin
        .from('affiliates')
        .select('ref_code')
        .eq('ref_code', affiliateRef)
        .eq('status', 'active')
        .single();

      if (affiliateMatch?.ref_code) {
        validatedAffiliateRef = affiliateMatch.ref_code;
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 });
    }

    // 2. Create Order in Supabase (with affiliate_ref + total_amount for commission)
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        total: parseFloat(total),
        total_amount: parseFloat(total),            // Used by webhook for commission calc
        status: 'pending',
        user_id: customer.email,
        cashfree_order_id: orderId,
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_phone: safePhone,
        ...(validatedAffiliateRef && { affiliate_ref: validatedAffiliateRef }),
      })
      .select()
      .single();

    if (orderError) {
      console.error('[DB Error]', orderError);
      return NextResponse.json({ error: 'Database record failed' }, { status: 500 });
    }

    // 3. Create Order Items (blocking, so we can rollback cleanly on failure)
    const orderItems = (items as CheckoutItem[]).map((item) => ({
      order_id: order.id,
      product_id: item.productId || item.id,
      quantity: item.quantity || 1,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      // Prevent orphan pending orders with no item rows.
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      console.error('[OrderItems Error]', orderItemsError.message);
      return NextResponse.json({ error: 'Order item persistence failed' }, { status: 500 });
    }

    // 3.5 Log Affiliate impression in create-order (webhook handles commission on payment success)
    if (validatedAffiliateRef) {
      console.log(`[Affiliate] Order ${orderId} attributed to ref: ${validatedAffiliateRef}`);
    }

    // 4. Create Cashfree Order
    const cfPayload = {
      order_id: orderId,
      order_amount: convertedTotal,
      order_currency: currency,
      customer_details: {
        customer_id: customer.email.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 45),
        customer_email: customer.email,
        customer_phone: safePhone.slice(-10),
        customer_name: `${customer.firstName} ${customer.lastName}`.trim().slice(0, 100),
      },
      order_meta: {
        return_url: `${SITE_URL}/success?order_id={order_id}`,
      },
    };

    const cfRes = await fetchWithRetry(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': CLIENT_ID,
        'x-client-secret': CLIENT_SECRET,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(cfPayload),
      timeoutMs: 10000,
      retries: 2,
      retryDelayMs: 700,
    });

    interface CashfreeOrderResponse {
      order_id: string;
      payment_session_id: string;
      cf_order_id: string;
      order_status: string;
      message?: string;
      code?: string;
      type?: string;
    }

    const cfData = await cfRes.json() as CashfreeOrderResponse;

    if (!cfRes.ok) {
      await supabaseAdmin
        .from('orders')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      console.error('[Cashfree Error Response]', {
        status: cfRes.status,
        data: cfData,
        keysUsed: `${CLIENT_ID.substring(0, 5)}... / ${CLIENT_SECRET.substring(0, 12)}...`
      });
      return NextResponse.json({ 
        error: cfData.message || 'Payment Gateway Authentication Failed',
        code: cfData.code,
        type: cfData.type
      }, { status: 500 });
    }

    // Order created successfully
    console.log('[Cashfree Order Created]', {
      orderId: cfData.order_id,
      hasSessionId: !!cfData.payment_session_id,
      mode: isProdKey ? "production" : "sandbox"
    });

    return NextResponse.json({
      success: true,
      orderId: cfData.order_id,
      paymentSessionId: cfData.payment_session_id,
      cfMode: isProdKey ? "production" : "sandbox"
    });

  } catch (err: unknown) {
    const error = err as Error;
    console.error('[Checkout API Error]', error);
    const isTimeout = error.name === 'AbortError';
    return NextResponse.json(
      {
        error: isTimeout
          ? 'Payment gateway timed out. Please try again.'
          : error.message,
      },
      { status: 500 }
    );
  }
}
