import type { Product } from './types';

export const NON_SELLABLE_PRODUCT_IDS = new Set([
  'notion-crm-protocol',
  'ai-social-automation',
  'cyberpunk-ui-kit',
]);

export function isSellableProductId(id: string): boolean {
  return !NON_SELLABLE_PRODUCT_IDS.has(id);
}

/** Remove legacy blanket promises that are not backed by a written SLA or
 * product-specific compliance agreement. */
export function sanitizeCatalogText(value: string): string {
  return value
    .replace(/24\s*\/\s*7\s*(priority\s*)?support/gi, 'Email support')
    .replace(/24\s*\/\s*7\s*priority/gi, 'Email')
    .replace(/priority\s+support/gi, 'Email support')
    .replace(/\s*\(HIPAA\s*Mode\)/gi, '')
    .replace(/HIPAA[- ]compliant/gi, 'healthcare-oriented')
    .trim();
}

export function sanitizePublicProduct(product: Product): Product {
  const specs = product.specs
    ? Object.fromEntries(
        Object.entries(product.specs)
          // Licensing is selected/displayed by the checkout tier; legacy
          // catalog labels such as "Enterprise" were not a reliable grant.
          .filter(([key]) => key.toLowerCase() !== 'license')
          .map(([key, value]) => [
            key,
            key.toLowerCase() === 'support' ? 'Email' : sanitizeCatalogText(String(value)),
          ]),
      )
    : undefined;

  return {
    ...product,
    description: sanitizeCatalogText(product.description),
    installGuide: product.installGuide ? sanitizeCatalogText(product.installGuide) : undefined,
    specs,
    originalPrice: undefined,
    scarcityStock: undefined,
    sales: undefined,
    swarmScore: undefined,
    matchDensity: undefined,
    aura: undefined,
    // Customer review UI calculates its own score from verified purchases.
    rating: 0,
  };
}
