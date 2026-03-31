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
  // Merge DB record with static fulfillment data
  const staticMatch = staticProducts.find(
    (sp) => sp.name === p.name
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
    merchantId: p.merchant_id || "SYSTEM",
    isVerified: p.is_verified ?? true,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    /**
     * Gold Standard: Product sync should be handled via migrations/seeds.
     * We no longer perform destructive wipes on every GET request.
     */

    // ── Build Supabase query ───────────────────────────────────────────────
    if (!supabase) {
      return NextResponse.json(staticProducts);
    }

    let query = supabase
      .from('products')
      .select('id, name, description, price, category, image, in_stock, rating, features, specs, install_guide, download_url, merchant_id, is_verified')
      .eq('is_verified', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      // Fallback to static products if database unavailable
      return NextResponse.json(staticProducts);
    }

    return NextResponse.json(data.map(normalizeProduct));

  } catch (_err) {
    // Fallback to static products on unexpected errors
    return NextResponse.json(staticProducts);
  }
}
