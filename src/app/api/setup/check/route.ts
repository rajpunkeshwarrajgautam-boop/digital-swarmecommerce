import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Backward-compatible, read-only connection probe used by CI and old clients.
 * It deliberately exposes no reset/seed/sync instructions or environment
 * details. `/api/health` is the fuller production-readiness endpoint.
 */
export async function GET() {
  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json(
        {
          connected: false,
          product_count: 0,
          status: 'error',
          message: 'Database connectivity check failed.',
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      connected: true,
      product_count: count ?? 0,
      status: 'ok',
      message: 'Database connection is available.',
    });
  } catch (error) {
    console.error('[setup-check] Connectivity probe failed', error);
    return NextResponse.json(
      {
        connected: false,
        product_count: 0,
        status: 'error',
        message: 'Database connectivity check failed.',
      },
      { status: 503 },
    );
  }
}
