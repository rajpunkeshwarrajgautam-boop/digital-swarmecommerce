import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth, currentUser } from '@clerk/nextjs/server';

/**
 * API Route to fetch purchased items for an order.
 * Required for the 'Full Completion' success page handover.
 */
export async function GET(
  request: Request,
  props: { params: Promise<{ orderId: string }> | { orderId: string } }
) {
  try {
    const params = await props.params;
    const { orderId } = params;

    // 0. Authentication & Authorization Check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!orderId || !supabaseAdmin) {
      return NextResponse.json({ error: 'Order ID or Database unavailable' }, { status: 400 });
    }

    // Resolve by either internal UUID (`orders.id`) or provider order id (`cashfree_order_id`).
    const { data: orderById } = await supabaseAdmin
      .from('orders')
      .select('id, user_id')
      .eq('id', orderId)
      .maybeSingle();

    const { data: orderByGatewayId } = await supabaseAdmin
      .from('orders')
      .select('id, user_id')
      .eq('cashfree_order_id', orderId)
      .maybeSingle();

    const order = orderById || orderByGatewayId;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.user_id !== userEmail && order.user_id !== userId) {
      console.warn(`[SECURITY] IDOR Attempt detected for order ${orderId} by user ${userEmail}`);
      return NextResponse.json({ error: 'Operation not permitted' }, { status: 403 });
    }

    // 1. Fetch Order items with product details
    const { data: orderItems, error: fetchError } = await supabaseAdmin
      .from('order_items')
      .select(`
        *,
        products (*)
      `)
      .eq('order_id', order.id);

    if (fetchError) {
      console.error('[API OrderItems] Fetch Error:', fetchError.message);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // 2. Flatten the dynamic product objects
    const items = orderItems.map((oi: { products: Record<string, unknown>; quantity: number; price: number }) => ({
      ...(oi.products as object),
      quantity: oi.quantity,
      price: oi.price
    }));

    return NextResponse.json({
      success: true,
      items
    });

  } catch (err: unknown) {
    const error = err as Error;
    console.error('[API OrderItems] Catch Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
