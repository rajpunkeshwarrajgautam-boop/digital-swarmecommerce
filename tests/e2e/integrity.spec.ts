import { test, expect, type APIRequestContext } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { products } from '../../src/lib/data';
import {
  getPrivateDeliveryAssetName,
  isSellableProductId,
  NON_SELLABLE_PRODUCT_IDS,
} from '../../src/lib/catalog-integrity';

const sellableProducts = products.filter((product) => product.inStock && isSellableProductId(product.id));

const PUBLIC_ROUTES = [
  '/',
  '/products',
  '/pricing',
  '/search',
  '/pulse',
  '/about',
  '/blog',
  '/freebies',
  '/bundle-builder',
  '/ai-agents',
  '/verticals',
  '/software-stacks',
  '/neural-swarms',
  '/affiliate',
  '/merchant',
  '/merchant/apply',
  '/faq',
  '/refund',
  '/licenses',
  '/contact',
  '/help',
  '/terms',
  '/privacy',
  '/cookie',
  '/cart',
  '/wishlist',
  '/health',
  '/tools/prompt-generator',
  '/solutions',
] as const;

const FREE_ASSETS = [
  ['saas-checklist', 'saas-launch-checklist.txt'],
  ['ai-prompt-library', 'ai-prompt-library.txt'],
  ['mini-ui-kit', 'cyberpunk-mini-ui-kit.tsx'],
  ['tech-stack-audit', 'saas-tech-stack-audit.txt'],
  ['design-system-tokens', 'design-system-tokens.css'],
] as const;

function normalizeInternalHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return null;
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) return null;

  try {
    const url = new URL(trimmed, 'https://digitalswarm.in');
    if (url.hostname !== 'digitalswarm.in' && url.hostname !== 'www.digitalswarm.in') return null;
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/')) return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

async function expectReachable(request: APIRequestContext, path: string) {
  const response = await request.get(path, { maxRedirects: 0, timeout: 20_000 });
  expect(response.status(), `${path} returned ${response.status()}`).toBeLessThan(400);
  return response;
}

test.describe('Storefront integrity', () => {
  test('all customer-visible public routes respond successfully', async ({ request }) => {
    for (const path of PUBLIC_ROUTES) {
      await expectReachable(request, path);
    }
  });

  test('sitemap exposes only real, sellable product pages and every sitemap page responds', async ({ request }) => {
    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const xml = await sitemapResponse.text();
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

    expect(locs.length).toBeGreaterThan(10);

    for (const blockedId of NON_SELLABLE_PRODUCT_IDS) {
      expect(xml).not.toContain(`/product/${blockedId}`);
    }

    for (const product of sellableProducts) {
      expect(xml).toContain(`/product/${product.id}`);
    }

    for (const loc of locs) {
      const url = new URL(loc);
      await expectReachable(request, `${url.pathname}${url.search}`);
    }
  });

  test('all server-rendered internal links from sitemap pages are reachable', async ({ request }) => {
    const sitemapResponse = await request.get('/sitemap.xml');
    expect(sitemapResponse.ok()).toBeTruthy();
    const xml = await sitemapResponse.text();
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    const links = new Set<string>();

    for (const loc of locs) {
      const source = new URL(loc);
      const response = await request.get(`${source.pathname}${source.search}`);
      if (!response.ok()) continue;
      const contentType = response.headers()['content-type'] || '';
      if (!contentType.includes('text/html')) continue;
      const html = await response.text();
      for (const match of html.matchAll(/href=["']([^"']+)["']/gi)) {
        const normalized = normalizeInternalHref(match[1]);
        if (normalized) links.add(normalized);
      }
    }

    expect(links.size).toBeGreaterThan(10);
    for (const link of links) {
      await expectReachable(request, link);
    }
  });

  test('public catalog rejects dummy SKUs and never exposes a public paid-asset URL', async ({ request }) => {
    const catalogResponse = await request.get('/api/products');
    expect(catalogResponse.ok()).toBeTruthy();
    const catalog = await catalogResponse.json() as Array<{ id: string; downloadUrl?: string }>;
    const ids = new Set(catalog.map((product) => product.id));

    expect(ids.size).toBe(sellableProducts.length);
    for (const product of sellableProducts) expect(ids.has(product.id)).toBeTruthy();

    for (const publicProduct of catalog) {
      expect(
        publicProduct.downloadUrl?.startsWith('private:'),
        `${publicProduct.id} must expose only a non-routable private delivery marker`,
      ).toBeTruthy();
      expect(publicProduct.downloadUrl).not.toMatch(/^https?:\/\//i);
      expect(publicProduct.downloadUrl).not.toMatch(/^\/downloads\//i);
    }

    for (const blockedId of NON_SELLABLE_PRODUCT_IDS) {
      expect(ids.has(blockedId)).toBeFalsy();
      const direct = await request.get(`/api/products/${blockedId}`);
      expect(direct.status()).toBe(404);
    }
  });

  test('every freebie endpoint resolves to a real signed asset redirect', async ({ request }) => {
    for (const [id] of FREE_ASSETS) {
      const response = await request.get(`/api/freebies/${id}`, { maxRedirects: 0, timeout: 20_000 });
      expect(response.status(), `${id} did not create a signed download redirect`).toBe(302);
      const location = response.headers().location || '';
      expect(location, `${id} redirect must contain a signed storage URL`).toMatch(/^https:\/\//i);
    }
  });

  test('every sellable SKU has exactly one live DB row and a private self-contained ZIP', async ({ browserName }) => {
    test.skip(browserName !== 'chromium', 'Backend catalog/storage integrity only needs one browser project.');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(supabaseUrl, 'NEXT_PUBLIC_SUPABASE_URL is required for catalog integrity').toBeTruthy();
    expect(serviceRoleKey, 'SUPABASE_SERVICE_ROLE_KEY is required for catalog integrity').toBeTruthy();

    const admin = createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const names = sellableProducts.map((product) => product.name);
    const { data: dbRows, error: dbError } = await admin
      .from('products')
      .select('id,name,in_stock')
      .in('name', names);
    expect(dbError?.message || '').toBe('');

    const rows = dbRows || [];
    for (const product of sellableProducts) {
      const matches = rows.filter((row) => row.name === product.name);
      expect(matches.length, `${product.id} must map to exactly one products row`).toBe(1);
      expect(matches[0]?.in_stock, `${product.id} database row must be in stock`).toBe(true);
    }

    const { data: storageObjects, error: storageError } = await admin.storage
      .from('digital_assets')
      .list('', { limit: 1000, sortBy: { column: 'name', order: 'asc' } });
    expect(storageError?.message || '').toBe('');
    const filenames = new Set((storageObjects || []).map((entry) => entry.name));

    for (const product of sellableProducts) {
      const filename = getPrivateDeliveryAssetName(product);
      expect(filename, `${product.id} must define a private delivery asset`).toBeTruthy();
      expect(filename.endsWith('.zip'), `${product.id} delivery must be a self-contained ZIP`).toBeTruthy();
      expect(filenames.has(filename), `${product.id} is missing private storage object ${filename}`).toBeTruthy();
    }

    for (const [, filename] of FREE_ASSETS) {
      expect(filenames.has(filename), `Free asset ${filename} is missing from private storage`).toBeTruthy();
    }
  });

  test('customer license schema matches the account delivery code', async ({ browserName }) => {
    test.skip(browserName !== 'chromium', 'Backend schema integrity only needs one browser project.');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(supabaseUrl).toBeTruthy();
    expect(serviceRoleKey).toBeTruthy();

    const admin = createClient(supabaseUrl!, serviceRoleKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: licenses, error } = await admin
      .from('customer_licenses')
      .select('id,user_email,order_id,license_key,license_tier,product_id,created_at')
      .limit(20);
    expect(error?.message || '').toBe('');

    const referencedIds = [...new Set((licenses || []).map((license) => license.product_id).filter(Boolean))];
    if (referencedIds.length) {
      const { data: referencedProducts, error: productError } = await admin
        .from('products')
        .select('id,name')
        .in('id', referencedIds);
      expect(productError?.message || '').toBe('');
      const resolvedIds = new Set((referencedProducts || []).map((row) => String(row.id)));
      for (const productId of referencedIds) {
        expect(resolvedIds.has(String(productId)), `License references missing DB product ${productId}`).toBeTruthy();
      }
    }
  });
});
