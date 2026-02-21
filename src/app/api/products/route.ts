import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/data';

// Normalize Supabase snake_case fields to match the Product type (camelCase)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeProduct(p: any) {
  return {
    ...p,
    inStock: p.inStock ?? p.in_stock ?? true,
    rating: p.rating ?? 5.0,
    features: p.features ?? [],
    specs: p.specs ?? {},
  };
}

export async function GET() {
  try {
    // Attempt to fetch from Supabase
    const { data, error } = await supabase
      .from('products')
      .select('id, name, description, price, category, image, in_stock, rating, features, specs')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[products/route] Supabase error, falling back to static data:', error.message);
      return NextResponse.json(staticProducts);
    }

    // If DB is empty, fall back to static data
    if (!data || data.length === 0) {
      console.info('[products/route] DB empty, falling back to static data');
      return NextResponse.json(staticProducts);
    }

    return NextResponse.json(data.map(normalizeProduct));
  } catch (err) {
    console.error('[products/route] Unexpected error:', err);
    // Graceful degradation — always serve something
    return NextResponse.json(staticProducts);
  }
}
