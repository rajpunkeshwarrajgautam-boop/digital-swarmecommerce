import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
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
    // ── Pre-Check & Sync Protocol ──────────────────────────────────────────
    // Use admin client per default for sync logic to bypass RLS
    const { data: v3Check } = await supabaseAdmin
      .from('products')
      .select('name')
      .eq('name', 'Next.js SaaS Starter Kit')
      .maybeSingle();

    // If database is not matching the v3 catalog, perform emergency wipe and sync
    if (!v3Check) {
      console.log(`[products/route] V3 Sync required. Initiating deep sync...`);
      
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

      if (syncError) console.error('[products/route] Sync Error:', syncError.message);
      else console.log('[products/route] Sync Perfected.');
    }

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

    return NextResponse.json(data.map(normalizeProduct));

  } catch (err) {
    console.error('[products/route] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
