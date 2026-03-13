import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';
import { products as localProducts } from '@/lib/data';

/**
 * POST /api/products/sync
 * 
 * Admin-only endpoint. Performs a full UPSERT of the current local product
 * catalog into Supabase. Safe to run multiple times — it uses name-based
 * conflict resolution so it won't create duplicates.
 */
export async function POST() {
  try {
    // ── Auth guard ──────────────────────────────────────────────────────────
    const user = await currentUser();
    const adminEmail = process.env.ADMIN_EMAIL;
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    if (!user || !adminEmail || userEmail !== adminEmail) {
      return NextResponse.json(
        { message: 'Unauthorized: Admin access required.' },
        { status: 401 }
      );
    }

    // ── Map local products to Supabase format ──────────────────────────────
    const catalog = localProducts.map(p => ({
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
      download_url: p.downloadUrl,
    }));

    const results: { name: string; status: string; error?: string }[] = [];

    for (const product of catalog) {
      // Check if product exists by name
      const { data: existing } = await supabaseAdmin
        .from('products')
        .select('id, name')
        .eq('name', product.name)
        .maybeSingle();

      if (existing) {
        // Update existing record
        const { error } = await supabaseAdmin
          .from('products')
          .update(product)
          .eq('id', existing.id);

        results.push({
          name: product.name,
          status: error ? 'update_failed' : 'updated',
          ...(error && { error: error.message }),
        });
      } else {
        // Insert new record
        const { error } = await supabaseAdmin
          .from('products')
          .insert(product);

        results.push({
          name: product.name,
          status: error ? 'insert_failed' : 'inserted',
          ...(error && { error: error.message }),
        });
      }
    }

    const inserted = results.filter(r => r.status === 'inserted').length;
    const updated = results.filter(r => r.status === 'updated').length;
    const failed = results.filter(r => r.status.includes('failed')).length;

    return NextResponse.json({
      success: failed === 0,
      summary: { total: catalog.length, inserted, updated, failed },
      results,
    });

  } catch (err) {
    console.error('[sync] Unexpected error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * GET /api/products/sync
 * Returns the current DB product count and sync status.
 */
export async function GET() {
  try {
    const { count, error } = await supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
    }

    const localCount = localProducts.length;

    return NextResponse.json({
      status: 'ok',
      db_product_count: count ?? 0,
      local_catalog_count: localCount,
      in_sync: (count ?? 0) >= localCount,
      message: count === 0
        ? 'Database is empty — run POST /api/products/sync to populate.'
        : `${count} products in Supabase. ${(count ?? 0) >= localCount ? 'In sync ✓' : 'Run sync to update.'}`,
    });
  } catch (err) {
    console.error('[sync/GET] Unexpected error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
