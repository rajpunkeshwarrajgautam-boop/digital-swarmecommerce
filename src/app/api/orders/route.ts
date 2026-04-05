import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rate-limit';
import { auth, currentUser } from '@clerk/nextjs/server';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    // 0. Authentication Check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. Identity required for provisioning.' }, { status: 401 });
    }

    const authUser = await currentUser();
    const authEmail = authUser?.emailAddresses[0]?.emailAddress;

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

    // Shield against email spoofing
    if (customer.email !== authEmail) {
      console.warn(`[SECURITY] Attempted order spoofing: Auth=${authEmail} vs Payload=${customer.email}`);
      return NextResponse.json({ error: 'Identity mismatch. Please use your authenticated email.' }, { status: 403 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database service unavailable' }, { status: 500 });
    }

    // 1. Attempt Atomic Transaction via RPC (Gold Standard)
    const { data: rpcData, error: rpcError } = await (supabaseAdmin as any).rpc('create_order_v3', {
      p_user_email: customer.email,
      p_total: total,
      p_items: items
    });

    if (!rpcError && rpcData?.success) {
      return NextResponse.json({ 
        success: true, 
        orderId: rpcData.order_id,
        message: 'Order created via secure transaction'
      });
    }

    // 2. Manual Fallback with Clean-up Logic
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: customer.email,
        total: total,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('[ORDERS/ROUTE] Creation Error:', orderError);
      return NextResponse.json({ error: 'TRANS_FAULT: Order creation failed.' }, { status: 500 });
    }

    // Attempt individual items insert
    const orderItems = items.map((item: { productId?: string; id?: string; quantity: number; price: number }) => ({
      order_id: order.id,
      product_id: item.productId || item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[ORDERS/ROUTE] Items Error:', itemsError);
      // Emergency Cleanup: Delete order to avoid phantom record
      await supabaseAdmin.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: 'TRANS_FAULT: Items provisioning failed. Record discarded.' }, { status: 500 });
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
