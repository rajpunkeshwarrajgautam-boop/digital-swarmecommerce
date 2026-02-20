import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products as fallbackData } from '@/lib/data';

// Normalize Supabase snake_case to match the Product type (camelCase)
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

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    // --- 1. Try Supabase by UUID ---
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    if (isUUID) {
      const { data: dbProduct, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (dbProduct) {
        return NextResponse.json(normalizeProduct(dbProduct));
      }

      if (error) {
        console.warn('[products/[id]] Supabase UUID lookup failed:', error.message);
      }
    }

    // --- 2. Try Supabase: search by name match (in case the id is a slug or number stored differently) ---
    if (!isUUID) {
      // Try looking up all and matching by a numeric index or name-based match isn't needed here
      // Non-UUID IDs come from static data — fall through to step 3
    }

    // --- 3. Fallback to static data ---
    const staticProduct = fallbackData.find((p) => p.id === id);

    if (staticProduct) {
      return NextResponse.json(staticProduct);
    }

    // --- 4. Not found anywhere ---
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  } catch (err) {
    console.error('[products/[id]] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
