import { NextResponse } from 'next/server';
import { products } from '@/lib/data';
import { isSellableProductId } from '@/lib/catalog-integrity';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category')?.trim();
  const id = searchParams.get('id')?.trim();

  let result = products.filter((product) => product.inStock && isSellableProductId(product.id));

  if (id) {
    result = result.filter((product) => product.id === id);
  }

  if (category) {
    result = result.filter((product) => product.category.toLowerCase() === category.toLowerCase());
  }

  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
