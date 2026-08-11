import { NextResponse } from "next/server";
import { products } from "@/lib/data";
import { isSellableProductId, sanitizePublicProduct } from "@/lib/catalog-integrity";

export async function GET() {
  const sellable = products.filter((product) => product.inStock && isSellableProductId(product.id));
  const explicitlyFeatured = sellable.filter((product) => product.isFeatured);
  const featured = (explicitlyFeatured.length >= 2 ? explicitlyFeatured : sellable).slice(0, 3);

  return NextResponse.json(featured.map(sanitizePublicProduct), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
