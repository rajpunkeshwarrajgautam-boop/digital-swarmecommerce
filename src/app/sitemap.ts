import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://digitalswarm.in";
  
  const staticPages = [
    "",
    "/products",
    "/pricing",
    "/about",
    "/faq",
    "/blog",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // In a real app, we'd fetch dynamic product slugs here
  return [...staticPages];
}
