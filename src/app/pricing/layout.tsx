import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";

export const metadata: Metadata = {
  title: "Pricing Protocols | Elite Access & Bundle Options",
  description: "Transparent pricing for Digital Swarm assets. From single AI agent protocols to full SaaS launch bundles with lifetime updates.",
  alternates: {
    canonical: `${baseUrl}/pricing`,
  },
  openGraph: {
    title: "Pricing | Digital Swarm Elite Forge",
    description: "Invest in high-performance digital assets. View our tier-based pricing for AI protocols and software stacks.",
    url: `${baseUrl}/pricing`,
    siteName: "Digital Swarm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital Swarm Pricing",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Protocols | Digital Swarm",
    description: "Industrial-grade AI and SaaS templates at transparent prices.",
    images: ["/og-image.png"],
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
