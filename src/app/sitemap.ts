import type { MetadataRoute } from 'next';
import { products } from '@/lib/data';

// Auto-generating Programmatic SEO Pages via Sitemap
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://digitalswarm.in';

  // Core Static SEO Pages
  const staticPages = [
    '',
    '/freebies',
    '/about',
    '/products',
    '/faq',
    '/contact',
    '/license',
    '/terms',
    '/affiliate',
    '/bundle-builder'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : (route === '/freebies' ? 0.9 : 0.8),
  }));

  // Auto-generate deep Programmable SEO Product Pages
  const dynamicProductPages = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Let Google also crawl categories as discrete hubs
  const categories = Array.from(new Set(products.map(p => p.category)));
  const categoryHubs = categories.map(category => ({
    url: `${baseUrl}/products?category=${encodeURIComponent(category)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...dynamicProductPages, ...categoryHubs];
}
