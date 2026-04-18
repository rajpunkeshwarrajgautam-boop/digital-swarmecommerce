import { products } from "@/lib/data";
import { MetadataRoute } from "next";

/** Regenerate periodically so crawlers always get a fresh XML without cold errors. */
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.95 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${baseUrl}/freebies`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/bundle-builder`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${baseUrl}/ai-agents`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${baseUrl}/verticals`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.75 },
    { url: `${baseUrl}/software-stacks`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.65 },
    { url: `${baseUrl}/neural-swarms`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.65 },
    { url: `${baseUrl}/affiliate`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.55 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.55 },
    { url: `${baseUrl}/refund`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.45 },
    { url: `${baseUrl}/licenses`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.45 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/help`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.45 },
    { url: `${baseUrl}/merchant`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/merchant/apply`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  return [...staticUrls, ...productUrls];
}
