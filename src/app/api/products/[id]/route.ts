import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { isSellableProductId } from '@/lib/catalog-integrity';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> | { id: string } },
) {
  const { id } = await props.params;

  const product = products.find((entry) => entry.id === id);
  if (!product || !product.inStock || !isSellableProductId(product.id)) {
    return NextResponse.json({ error: 'Product unavailable' }, { status: 404 });
  }

  return NextResponse.json(product, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
