import type { Product } from './types';

export const NON_SELLABLE_PRODUCT_IDS = new Set([
  'notion-crm-protocol',
  'ai-social-automation',
  'cyberpunk-ui-kit',
]);

export function isSellableProductId(id: string): boolean {
  return !NON_SELLABLE_PRODUCT_IDS.has(id);
}

export function sanitizePublicProduct(product: Product): Product {
  return {
    ...product,
    originalPrice: undefined,
    scarcityStock: undefined,
    sales: undefined,
    swarmScore: undefined,
    matchDensity: undefined,
    aura: undefined,
    // Customer review UI calculates its own score from published reviews.
    rating: 0,
  };
}
