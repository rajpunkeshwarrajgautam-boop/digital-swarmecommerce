import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const PLURAL_MID = process.env.NEXT_PUBLIC_PLURAL_MID!;
const PLURAL_ACCESS_CODE = process.env.PLURAL_ACCESS_CODE!;
const PLURAL_SECRET_KEY = process.env.PLURAL_SECRET_KEY!;
const PLURAL_ENV = process.env.PLURAL_ENV || 'TEST';
const isTest = PLURAL_ENV === 'TEST';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customer } = body;

    if (!items || !items.length || !total || !customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Generate a unique order ID
    const orderId = `DS_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Step 1: Create Order in Supabase
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        total,
        status: 'pending',
        user_id: customer.email,
        cashfree_order_id: orderId, // using this as a generic order_id
        customer_email: customer.email,
      })
      .select()
      .single();

    if (orderError) {
      console.error('[Supabase] Order creation failed:', orderError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Step 2: Create Order Items
    const orderItems = items.map((item: { id: string; price: number; quantity?: number }) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      price: item.price,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[Supabase] Order items failed:', itemsError);
    }

    // Step 3: Create Payment Request via Pine Labs SDK
    const pinelabs = require('pinelabs_node').default(PLURAL_MID, PLURAL_ACCESS_CODE, PLURAL_SECRET_KEY, isTest);

    const txn_data = {
      txn_id: orderId,
      callback: `${process.env.NEXT_PUBLIC_SITE_URL}/success`, 
      amount_in_paisa: (total * 100).toString(),
    };

    const payment_mode = {
      netbanking: true, cards: true, emi: true, upi: true, cardless_emi: true, wallet: true, debit_emi: true, bnpl: true, paybypoints: false
    };

    const customer_data = {
      email_id: customer.email,
      first_name: customer.firstName || "Digital",
      last_name: customer.lastName || "Swarm",
      mobile_no: customer.phone || "9999999999",
      customer_id: customer.email.replace(/[^a-zA-Z0-9_-]/g, '_'),
    };

    const billing_data = customer.address ? {
      address1: customer.address,
      pincode: customer.zip || "110001",
      city: customer.city || "New Delhi",
      state: "Delhi",
      country: "India",
    } : {};

    const shipping_data = {};
    const udf_data = {};
    const product_details: any[] = [];

    const response = await pinelabs.payment.create(txn_data, payment_mode, customer_data, billing_data, shipping_data, udf_data, product_details);

    if (response && response.status === true && response.redirect_url) {
      return NextResponse.json({
        success: true,
        orderId: orderId,
        paymentUrl: response.redirect_url,
      });
    } else {
      console.error('[Plural] Order creation failed:', response);
      return NextResponse.json({ error: 'Payment gateway error' }, { status: 500 });
    }
  } catch (err: any) {
    console.error('[Plural] Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
