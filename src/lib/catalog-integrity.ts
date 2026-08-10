import type { Product } from './types';

export const NON_SELLABLE_PRODUCT_IDS = new Set([
  'notion-crm-protocol',
  'ai-social-automation',
  'cyberpunk-ui-kit',
]);

/**
 * Private, self-contained fulfillment assets. These filenames live only in the
 * non-public `digital_assets` bucket and are signed after a paid order is
 * verified. Public product APIs expose only a `private:` delivery marker so a
 * catalog page can describe the format without rendering a fake public link.
 */
export const PRIVATE_DELIVERY_ASSET_BY_PRODUCT_ID: Readonly<Record<string, string>> = {
  'ai-executive-playbook': 'ai-executive-playbook.zip',
  'ai-for-lawyers': 'swarm-legal-optimized.zip',
  'ai-for-real-estate': 'swarm-property-optimized.zip',
  'ai-for-finance': 'swarm-capital-optimized.zip',
  'ai-for-healthcare': 'swarm-voice.zip',
  'ai-for-marketing': 'sentinel-seo-optimized.zip',
  'ai-for-copywriting': 'swarm-content-architect.zip',
  'ai-for-saas': 'swarm-uiux-auditor.zip',
  'ai-for-ecommerce': 'ai-services-agency.zip',
  'sentinel-research-infiltrator': 'sentinel-research-optimized.zip',
  'cinema-infiltrator': 'swarm-cinema.zip',
  'finance-infiltrator': 'swarm-finance-optimized.zip',
  'sales-infiltrator': 'swarm-sales-optimized.zip',
  'ai-for-recruitment': 'swarm-talent-optimized.zip',
  'ai-for-home-services': 'sentinel-voyager.zip',
  'starter-kit': 'starter-kit.zip',
  'nextjs-saas-kit': 'pro-kit.zip',
};

export function isSellableProductId(id: string): boolean {
  return !NON_SELLABLE_PRODUCT_IDS.has(id);
}

export function getPrivateDeliveryAssetName(product: Pick<Product, 'id' | 'downloadUrl'>): string {
  const configured = PRIVATE_DELIVERY_ASSET_BY_PRODUCT_ID[product.id];
  if (configured) return configured;

  const raw = product.downloadUrl?.trim() || '';
  if (!raw) return '';
  try {
    const pathname = new URL(raw, 'https://digitalswarm.in').pathname;
    return decodeURIComponent(pathname.split('/').filter(Boolean).pop() || '');
  } catch {
    return '';
  }
}

/** Remove legacy blanket promises and public-looking paid-asset paths that are
 * not backed by a written SLA or a genuinely public download. */
export function sanitizeCatalogText(value: string): string {
  return value
    .replace(/24\s*\/\s*7\s*(priority\s*)?support/gi, 'Email support')
    .replace(/24\s*\/\s*7\s*priority/gi, 'Email')
    .replace(/priority\s+support/gi, 'Email support')
    .replace(/\s*\(HIPAA\s*Mode\)/gi, '')
    .replace(/HIPAA[- ]compliant/gi, 'healthcare-oriented')
    .replace(/\/downloads\/([A-Za-z0-9._-]+)/g, '$1')
    .replace(/`?\/downloads\/`?/g, 'the private delivery bundle')
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

  const privateAsset = getPrivateDeliveryAssetName(product);

  return {
    ...product,
    description: sanitizeCatalogText(product.description),
    installGuide: product.installGuide ? sanitizeCatalogText(product.installGuide) : undefined,
    specs,
    // This is deliberately not an HTTP path. The product page can infer the
    // file format from it, but cannot render a pre-purchase download link.
    downloadUrl: privateAsset ? `private:${privateAsset}` : undefined,
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
