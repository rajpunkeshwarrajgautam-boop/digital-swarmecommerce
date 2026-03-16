import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customer } = body;

    const CLIENT_ID = process.env.CASHFREE_APP_ID?.trim() || '';
    const CLIENT_SECRET = process.env.CASHFREE_SECRET_KEY?.trim() || '';
    
    // Auto-detect environment based on the Secret Key prefix
    // Sandbox keys start with 'cfsk_ma_test_', Production keys start with 'cfsk_ma_prod_'
    const isProdKey = CLIENT_SECRET.startsWith('cfsk_ma_prod_');
    const ENV = isProdKey ? 'PROD' : (process.env.CASHFREE_ENV || 'TEST');

    const BASE_URL = ENV === 'PROD'
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';

    if (!items || !items.length || !total || !customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // 1. Generate clean Order ID
    const orderId = `DS_${Date.now()}`;

    // 2. Create Order in Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        total: parseFloat(total),
        status: 'pending',
        user_id: customer.email,
        cashfree_order_id: orderId,
        customer_email: customer.email,
        customer_name: `${customer.firstName} ${customer.lastName}`,
        customer_phone: customer.phone.replace(/[^0-9]/g, '') || '9999999999',
      })
      .select()
      .single();

    if (orderError) {
      console.error('[DB Error]', orderError);
      return NextResponse.json({ error: 'Database record failed', details: orderError.message }, { status: 500 });
    }

    // 3. Create Order Items (Async, don't block if minor failure)
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: 1,
      price: item.price,
    }));
    supabaseAdmin.from('order_items').insert(orderItems).then(({ error }) => {
      if (error) console.error('[OrderItems Error]', error);
    });

    // 4. Create Cashfree Order
    const cfPayload = {
      order_id: orderId,
      order_amount: parseFloat(total).toFixed(2), // Cashfree expects string/number with decimals
      order_currency: 'INR',
      customer_details: {
        customer_id: customer.email.replace(/[^a-zA-Z0-9]/g, '_'),
        customer_email: customer.email,
        customer_phone: customer.phone.replace(/[^0-9]/g, '') || '9999999999',
        customer_name: `${customer.firstName} ${customer.lastName}`.trim(),
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id={order_id}`,
      },
    };

    const cfRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': CLIENT_ID!,
        'x-client-secret': CLIENT_SECRET!,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cfPayload),
    });

    const cfData = await cfRes.json();

    if (!cfRes.ok) {
      console.error('[Cashfree API Error]', cfData);
      return NextResponse.json({ 
        error: cfData.message || 'Payment authentication failed',
        code: cfData.code,
        type: cfData.type
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: cfData.order_id,
      paymentSessionId: cfData.payment_session_id,
    });

  } catch (err: any) {
    console.error('[Checkout API Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
