
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/setup/check
 * Returns database connection status and product count.
 * Provides actionable message if Supabase project is paused.
 */
export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  try {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      // Detect Supabase project paused or DNS failure
      const isPaused =
        error.message?.includes('ENOTFOUND') ||
        error.message?.includes('fetch failed') ||
        error.message?.includes('getaddrinfo') ||
        error.code === 'PGRST301';

      return NextResponse.json({
        connected: false,
        product_count: 0,
        status: isPaused ? 'paused' : 'error',
        message: isPaused
          ? 'Supabase project appears to be paused. Visit app.supabase.com and resume the project, then try again.'
          : `Database error: ${error.message}`,
        action: isPaused
          ? 'Go to https://app.supabase.com → Your Project → Click "Resume Project", then run POST /api/products/sync'
          : 'Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env',
        supabase_url: supabaseUrl.replace(/^(https?:\/\/[^.]+).*/, '$1.***'), // Masked for security
      });
    }

    // Success — DB is reachable
    const productCount = count ?? 0;
    return NextResponse.json({
      connected: true,
      product_count: productCount,
      status: 'ok',
      message: productCount === 0
        ? 'Connected but database is empty. Run POST /api/products/seed to populate.'
        : `Connected. ${productCount} products in database.`,
      action: productCount === 0
        ? 'POST /api/products/seed'
        : productCount < 11
          ? 'POST /api/products/sync — some products may be missing'
          : 'All good! ✓',
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const isPaused =
      message.includes('ENOTFOUND') ||
      message.includes('fetch failed') ||
      message.includes('getaddrinfo');

    return NextResponse.json({
      connected: false,
      product_count: 0,
      status: isPaused ? 'paused' : 'error',
      message: isPaused
        ? 'Supabase project appears to be paused or unreachable.'
        : `Unexpected error: ${message}`,
      action: 'Go to https://app.supabase.com and resume your project.',
      supabase_url: supabaseUrl.replace(/^(https?:\/\/[^.]+).*/, '$1.***'),
    }, { status: 200 }); // Return 200 so frontend can handle gracefully
  }
}
