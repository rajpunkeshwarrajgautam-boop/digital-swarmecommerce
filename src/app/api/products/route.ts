import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { products as staticProducts } from '@/lib/data';

export const dynamic = 'force-dynamic';

// Normalize Supabase snake_case fields to match the Product type (camelCase)
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
  merchant_id: string;
  is_verified: boolean;
}

function normalizeProduct(p: DBProduct): Product {
  // Merge DB record with static fulfillment data by ID (more reliable than name matching)
  const staticMatch = staticProducts.find(
    (sp) => sp.id === p.id
  );

  // Fallback: match by name if ID lookup fails (e.g. DB has different slug)
  const staticFallback = staticMatch ?? staticProducts.find(
    (sp) => sp.name.trim().toLowerCase() === p.name.trim().toLowerCase()
  );

  return {
    id: staticFallback?.id ?? p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    // originalPrice is sourced exclusively from static registry (luxury anchoring)
    originalPrice: staticFallback?.originalPrice,
    category: p.category,
    image: staticFallback?.image ?? p.image,
    inStock: p.in_stock ?? true,
    rating: p.rating ?? 5.0,
    features: p.features ?? staticFallback?.features ?? [],
    specs: p.specs ?? staticFallback?.specs ?? {},
    installGuide: p.install_guide ?? staticFallback?.installGuide ?? undefined,
    downloadUrl: p.download_url ?? staticFallback?.downloadUrl ?? undefined,
    merchantId: p.merchant_id || "SYSTEM",
    isVerified: p.is_verified ?? true,
  };
}

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

    return NextResponse.json(data.map(normalizeProduct));

  } catch {
    // Fallback to static products on unexpected errors
    let result = staticProducts;
    if (id) result = result.filter((p) => p.id === id);
    if (category) result = result.filter((p) => p.category === category);
    return NextResponse.json(result);
  }
}
