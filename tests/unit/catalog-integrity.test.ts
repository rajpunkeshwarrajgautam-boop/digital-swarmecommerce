import { describe, expect, it } from 'vitest';
import {
  getPrivateDeliveryAssetName,
  isSellableProductId,
  sanitizeCatalogText,
} from '@/lib/catalog-integrity';

describe('catalog integrity guardrails', () => {
  it('blocks retired catalog product IDs while allowing maintained products', () => {
    expect(isSellableProductId('notion-crm-protocol')).toBe(false);
    expect(isSellableProductId('ai-social-automation')).toBe(false);
    expect(isSellableProductId('ai-executive-playbook')).toBe(true);
  });

  it('maps maintained paid products to private delivery bundle filenames', () => {
    expect(
      getPrivateDeliveryAssetName({
        id: 'ai-executive-playbook',
        downloadUrl: 'https://example.com/should-not-win.zip',
      }),
    ).toBe('ai-executive-playbook.zip');
  });

  it('extracts a filename for products without an explicit private mapping', () => {
    expect(
      getPrivateDeliveryAssetName({
        id: 'future-product',
        downloadUrl: 'https://cdn.example.com/private/future%20bundle.zip',
      }),
    ).toBe('future bundle.zip');
  });

  it('removes unsupported blanket promises and public download paths from catalog copy', () => {
    const raw = 'Includes 24/7 priority support, HIPAA-compliant mode and /downloads/private-bundle.zip';
    const sanitized = sanitizeCatalogText(raw);

    expect(sanitized).not.toMatch(/24\s*\/\s*7/i);
    expect(sanitized).not.toMatch(/HIPAA-compliant/i);
    expect(sanitized).not.toContain('/downloads/');
    expect(sanitized).toContain('Email support');
    expect(sanitized).toContain('healthcare-oriented');
    expect(sanitized).toContain('private-bundle.zip');
  });
});
