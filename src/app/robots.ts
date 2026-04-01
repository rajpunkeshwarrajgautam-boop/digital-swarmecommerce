import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout", "/success", "/api"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in"}/sitemap.xml`,
  };
}
