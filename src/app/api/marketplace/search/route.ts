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
    const { query, isNeural, catalog: providedCatalog } = await req.json();
    let catalog: Product[] = providedCatalog || staticProducts;
    // We no longer fetch /api/products internally to prevent potential deadlocks.
    // Instead, the client passes the raw products if needed, or we rely on static data as fallback.

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
