import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

// Normalize Supabase snake_case fields to match the Product type (camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(p: any) {
  // Merge DB record with static fulfillment data
  const staticMatch = staticProducts.find(
    (sp) => sp.name === p.name
  );

  return {
    ...p,
    // Ensure the slug-based id is preserved if the DB record has a UUID
    // Frontend routing uses slugs, not UUIDs
    id: staticMatch?.id ?? p.id,
    image: staticMatch?.image ?? p.image,
    inStock: p.inStock ?? p.in_stock ?? true,
    rating: p.rating ?? 5.0,
    features: p.features ?? staticMatch?.features ?? [],
    specs: p.specs ?? staticMatch?.specs ?? {},
    installGuide: p.installGuide ?? p.install_guide ?? staticMatch?.installGuide ?? null,
    downloadUrl: p.downloadUrl ?? p.download_url ?? staticMatch?.downloadUrl ?? null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    // ── Build Supabase query ───────────────────────────────────────────────
    let query = supabase
      .from('products')
      .select('id, name, description, price, category, image, in_stock, rating, features, specs, install_guide, download_url')
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[products/route] Supabase error:', error.message);
      return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
    }

    // If DB is empty, return empty array
    if (!data || data.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(data.map(normalizeProduct));

  } catch (err) {
    console.error('[products/route] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
