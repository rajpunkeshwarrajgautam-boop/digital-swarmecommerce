import { Product } from "./types";
import { products as staticProducts } from "./data";

/** Supabase `products` row fields used when merging with the static registry. */
export interface DbProductRow {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  in_stock?: boolean | null;
  rating?: number | null;
  features?: string[] | null;
  specs?: Record<string, string> | null;
  install_guide?: string | null;
  download_url?: string | null;
  merchant_id?: string | null;
  is_verified?: boolean | null;
}

/**
 * When a DB row matches the static catalog (by id or name), prefer static
 * marketing + fulfillment fields so listing copy stays aligned with delivery.
 */
export function normalizeProductFromDb(p: DbProductRow): Product {
  const staticMatch = staticProducts.find((sp) => sp.id === p.id);
  const staticFallback =
    staticMatch ??
    staticProducts.find(
      (sp) => sp.name.trim().toLowerCase() === p.name.trim().toLowerCase()
    );
  const useStatic = !!staticFallback;

  return {
    id: staticFallback?.id ?? p.id,
    name: useStatic ? staticFallback!.name : p.name,
    description: useStatic ? staticFallback!.description : p.description,
    price: p.price,
    originalPrice: staticFallback?.originalPrice,
    category: useStatic ? staticFallback!.category : p.category,
    image: staticFallback?.image ?? p.image,
    inStock: p.in_stock ?? true,
    rating: p.rating ?? 5.0,
    features: useStatic ? (staticFallback!.features ?? []) : (p.features ?? []),
    specs: useStatic ? (staticFallback!.specs ?? {}) : (p.specs ?? {}),
    installGuide: useStatic
      ? staticFallback!.installGuide
      : (p.install_guide ?? undefined),
    downloadUrl: useStatic
      ? staticFallback!.downloadUrl
      : (p.download_url ?? undefined),
    merchantId: p.merchant_id || "SYSTEM",
    isVerified: p.is_verified ?? true,
  };
}
