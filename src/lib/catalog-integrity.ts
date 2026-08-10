export const NON_SELLABLE_PRODUCT_IDS = new Set([
  'notion-crm-protocol',
  'ai-social-automation',
  'cyberpunk-ui-kit',
]);

export function isSellableProductId(id: string): boolean {
  return !NON_SELLABLE_PRODUCT_IDS.has(id);
}
