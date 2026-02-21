import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    // Rate Limit Check
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(5, ip); // 5 requests per minute
    } catch {
      return NextResponse.json({ error: 'Too many order attempts. Please wait a moment.' }, { status: 429 });
    }

    const body = await request.json();
    const { items, total, customer } = body;

    if (!items || !items.length || !total || !customer?.email) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // 1. Create the Order
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: customer.email, // Using email as identifier for guest checkouts
        total: total,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // 2. Create the Order Items
    const orderItems = items.map((item: { id: string, quantity: number, price: number }) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      // We could ideally delete the order here or handle partial fail
      return NextResponse.json({ error: 'Failed to record order items' }, { status: 500 });
    }

    // Return success for the flow completion
    return NextResponse.json({ 
        success: true, 
        orderId: order.id,
        message: 'Order recorded successfully'
    });

  } catch (err) {
    console.error('Order endpoint error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
