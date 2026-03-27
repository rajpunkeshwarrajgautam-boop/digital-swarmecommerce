import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products as fallbackData } from '@/lib/data';

export const dynamic = 'force-dynamic';

import { Product } from "@/lib/types";

interface DBProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  in_stock: boolean;
  rating: number;
  features: string[] | null;
  specs: Record<string, string> | null;
  install_guide: string | null;
  download_url: string | null;
}

function normalizeProduct(p: DBProduct): Product {
  // Find matching static product for fulfillment links (by name or slug id)
  const staticMatch = fallbackData.find(
    (sp) => sp.name === p.name || sp.id === p.id
  );

  return {
    id: staticMatch?.id ?? p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    category: p.category,
    image: staticMatch?.image ?? p.image,
    inStock: p.in_stock ?? true,
    rating: p.rating ?? 5.0,
    features: p.features ?? staticMatch?.features ?? [],
    specs: p.specs ?? staticMatch?.specs ?? {},
    installGuide: p.install_guide ?? staticMatch?.installGuide ?? undefined,
    downloadUrl: p.download_url ?? staticMatch?.downloadUrl ?? undefined,
  };
}

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const { id } = params;

  try {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

    // ── 1. UUID lookup in Supabase ────────────────────────────────────────
    if (isUUID) {
      const { data: dbProduct, error } = await supabase
        .from('products')
        .select('id, name, description, price, category, image, in_stock, rating, features, specs, install_guide, download_url')
        .eq('id', id)
        .single();

      if (dbProduct) return NextResponse.json(normalizeProduct(dbProduct));
      if (error) console.warn('[products/[id]] UUID lookup failed:', error.message);
    }

    // ── 2. Slug lookup — match static data id against Supabase name ──────
    // Static products use human-readable slugs (e.g. "swarm-sales").
    // If the Supabase DB has the product stored by name, match via static alias.
    if (!isUUID) {
      const staticProduct = fallbackData.find((p) => p.id === id);

      if (staticProduct) {
        // Try to find in Supabase by name (in case it's been synced with a UUID)
        const { data: dbByName } = await supabase
          .from('products')
          .select('id, name, description, price, category, image, in_stock, rating, features, specs, install_guide, download_url')
          .eq('name', staticProduct.name)
          .maybeSingle();

        if (dbByName) {
          // Merge DB data with static fulfillment links
          return NextResponse.json(normalizeProduct({
            ...dbByName,
            id, // keep the slug-based id for frontend routing
          }));
        }

        // Supabase doesn't have it — serve from static data (guaranteed full data)
        return NextResponse.json(staticProduct);
      }
    }

    // ── 3. Not found anywhere ─────────────────────────────────────────────
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  } catch (err) {
    console.error('[products/[id]] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
