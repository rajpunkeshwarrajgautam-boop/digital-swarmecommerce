import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/data';
import { normalizeProductFromDb } from '@/lib/mergeStaticProductFromDb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const id = searchParams.get('id');

  // ── Static-only fast path (no Supabase) ───────────────────────────────
  if (!supabase) {
    let result = staticProducts;
    if (id) result = result.filter((p) => p.id === id);
    if (category) result = result.filter((p) => p.category === category);
    return NextResponse.json(result);
  }

  try {
    // ── Build Supabase query ─────────────────────────────────────────────
    let query = supabase
      .from('products')
      .select('id, name, description, price, category, image, in_stock, rating, features, specs, install_guide, download_url, merchant_id, is_verified')
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (id) {
      query = query.eq('id', id);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      // Fallback to static products if database unavailable
      let result = staticProducts;
      if (id) result = result.filter((p) => p.id === id);
      if (category) result = result.filter((p) => p.category === category);
      return NextResponse.json(result);
    }

    return NextResponse.json(data.map(normalizeProductFromDb));

  } catch {
    // Fallback to static products on unexpected errors
    let result = staticProducts;
    if (id) result = result.filter((p) => p.id === id);
    if (category) result = result.filter((p) => p.category === category);
    return NextResponse.json(result);
  }
}
