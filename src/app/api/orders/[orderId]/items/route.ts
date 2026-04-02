import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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

    if (!orderId || !supabaseAdmin) {
      return NextResponse.json({ error: 'Order ID or Database unavailable' }, { status: 400 });
    }

    // 1. Fetch Order items with product details
    const { data: orderItems, error: fetchError } = await supabaseAdmin
      .from('order_items')
      .select(`
        *,
        products (*)
      `)
      .eq('order_id', orderId);

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
