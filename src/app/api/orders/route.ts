import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customer } = body;

    // Simulate order processing for preview
    console.log('Processing Order:', { items, total, customer });
    
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return dummy success for the preview so the user sees the flow completion
    return NextResponse.json({ 
        success: true, 
        orderId: 'preview_order_' + Date.now(),
        message: 'Order simulation successful'
    });

  } catch (err) {
    console.error('Order endpoint error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
