import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
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
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  try {
    // ── Pre-Check & Sync Protocol ──────────────────────────────────────────
    // Use admin client per default for sync logic to bypass RLS
    if (supabaseAdmin) {
      const { data: v3Check } = await supabaseAdmin
        .from('products')
        .select('name')
        .eq('name', 'Next.js SaaS Starter Kit')
        .maybeSingle();

      // If database is not matching the v3 catalog, perform emergency wipe and sync
      if (!v3Check) {
        // Emergency wipe and sync protocol
        
        // Wipe old data
        await supabaseAdmin.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        const upsertData = staticProducts.map(p => ({
          name: p.name,
          description: p.description,
          price: p.price,
          category: p.category,
          image: p.image,
          in_stock: p.inStock,
          rating: p.rating,
          features: p.features,
          specs: p.specs,
          install_guide: p.installGuide,
          download_url: p.downloadUrl
        }));

        const { error: syncError } = await supabaseAdmin
          .from('products')
          .insert(upsertData);

        if (syncError) {
          // Log sync error for debugging but don't expose to client
          console.error(`[products/route] Sync Error: ${syncError.message}`);
        }
      }
    }

    // ── Build Supabase query ───────────────────────────────────────────────
    if (!supabase) {
      return NextResponse.json(staticProducts);
    }

    let query = supabase
      .from('products')
      .select('id, name, description, price, category, image, in_stock, rating, features, specs, install_guide, download_url')
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
