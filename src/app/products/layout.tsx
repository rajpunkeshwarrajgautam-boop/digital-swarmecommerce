import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";

export const metadata: Metadata = {
  title: "Premium Asset Catalog | AI Agents & SaaS Kits",
  description: "Browse the Digital Swarm registry: elite AI agent protocols, production-ready SaaS boilerplates, and industrial-grade automation tools.",
  alternates: {
    canonical: `${baseUrl}/products`,
  },
  openGraph: {
    title: "Asset Catalog | Digital Swarm Elite Forge",
    description: "Browse high-performance digital assets: AI agents, SaaS kits, and production-ready protocols.",
    url: `${baseUrl}/products`,
    siteName: "Digital Swarm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital Swarm Asset Catalog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Asset Catalog | Digital Swarm",
    description: "Industrial-grade AI and SaaS templates for elite engineers.",
    images: ["/og-image.png"],
    creator: "@DigitalSwarm",
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
