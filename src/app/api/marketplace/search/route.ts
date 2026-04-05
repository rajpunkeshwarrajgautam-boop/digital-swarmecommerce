import { NextResponse } from 'next/server';
import { SearchService } from '@/lib/search';
import { products } from '@/lib/data';

/**
 * ✨ NEURAL DISCOVERY UPLINK
 * --------------------------
 * Processes conceptual and semantic queries.
 */
export async function POST(req: Request) {
  try {
    const { query, isNeural } = await req.json();

    if (!query) {
      return NextResponse.json({ results: products });
    }

    // 1. Process Conceptual or Standard Search
    const results = isNeural 
      ? SearchService.neuralSearch(query, products)
      : SearchService.tagSearch(query, products);

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
