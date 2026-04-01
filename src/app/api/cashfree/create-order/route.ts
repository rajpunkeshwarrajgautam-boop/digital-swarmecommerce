import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { env } from '@/lib/env';

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

    // 1. Generate clean Order ID
    const orderId = `DS_${Date.now()}`;

    // 1.5. Resolve Affiliate Cookie (if any)
    const cookieStore = await cookies();
    const affiliateCode = cookieStore.get('affiliate_id')?.value;
    let affiliateRecordId = null;

    if (affiliateCode && supabaseAdmin) {
      const { data: affiliateMatch } = await supabaseAdmin
        .from('affiliates')
        .select('id')
        .eq('referral_code', affiliateCode)
        .single();
      
      if (affiliateMatch) {
        affiliateRecordId = affiliateMatch.id;
      }
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 });
    }

    // 2. Create Order in Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        total: parseFloat(total),
        status: 'pending',
        user_id: customer.email,
        cashfree_order_id: orderId,
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
        customer_phone: customer.phone.replace(/[^0-9]/g, '') || '9999999999',
      })
      .select()
      .single();

    if (orderError) {
      console.error('[DB Error]', orderError);
      return NextResponse.json({ error: 'Database record failed' }, { status: 500 });
    }

    // 3. Create Order Items (Async)
    const orderItems = items.map((item: { id: string; price: number }) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: 1,
      price: item.price,
    }));
    
    if (supabaseAdmin) {
      supabaseAdmin.from('order_items').insert(orderItems).then(({ error }: { error: { message: string } | null }) => {
        if (error) console.error('[OrderItems Error]', error.message);
      });
    }

    // 3.5 Log Affiliate Referral (Pending)
    if (affiliateRecordId && supabaseAdmin) {
      const commission = parseFloat(total) * 0.30;
      supabaseAdmin.from('referrals').insert({
        affiliate_id: affiliateRecordId,
        order_id: orderId,
        commission_amount: commission,
        status: 'pending'
      }).then(({ error }: { error: { message: string } | null }) => {
        if (error) console.error('[Affiliate Logging Error]', error);
      });
    }

    // 4. Create Cashfree Order
    const cfPayload = {
      order_id: orderId,
      order_amount: convertedTotal,
      order_currency: currency,
      customer_details: {
        customer_id: customer.email.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 45),
        customer_email: customer.email,
        customer_phone: customer.phone.replace(/[^0-9]/g, '').slice(-10) || '9999999999',
        customer_name: `${customer.firstName} ${customer.lastName}`.trim().slice(0, 100),
      },
      order_meta: {
        return_url: `${SITE_URL}/success?order_id={order_id}`,
      },
    };

    const cfRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': CLIENT_ID,
        'x-client-secret': CLIENT_SECRET,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(cfPayload),
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
