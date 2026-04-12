import { NextResponse } from 'next/server';
import { SearchService } from '@/lib/search';
import { products as staticProducts } from '@/lib/data';
import type { Product } from '@/lib/types';

/**
 * ✨ NEURAL DISCOVERY UPLINK
 * --------------------------
 * Processes conceptual and semantic queries.
 */
export async function POST(req: Request) {
  try {
    const { query, isNeural } = await req.json();

    const { origin } = new URL(req.url);
    let catalog: Product[] = staticProducts;
    try {
      const r = await fetch(`${origin}/api/products`, {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (r.ok) {
        const data = (await r.json()) as Product[];
        if (Array.isArray(data) && data.length > 0) catalog = data;
      }
    } catch {
      /* keep static catalog */
    }

    if (!query) {
      return NextResponse.json({ results: catalog });
    }

    // 1. Process Conceptual or Standard Search
    const results = isNeural
      ? SearchService.neuralSearch(query, catalog)
      : SearchService.tagSearch(query, catalog);

    return NextResponse.json({ 
      success: true, 
      results,
      count: results.length
    });

  } catch (err) {
    console.error('[NEURAL_API_FAULT] Internal logic failure:', err);
    return NextResponse.json({ error: 'Internal Core Sync Fault' }, { status: 500 });
  }
}
