import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";

export const metadata: Metadata = {
  title: "Digital Product Catalog | AI Workflow Assets & Software Kits",
  description:
    "Browse Digital Swarm digital products, AI workflow assets, playbooks, prompt systems and software kits with explicit deliverables, INR pricing and clear licence terms.",
  alternates: {
    canonical: `${baseUrl}/products`,
  },
  openGraph: {
    title: "Digital Product Catalog | Digital Swarm",
    description:
      "Browse digital products with clear scope, requirements, licence options and private post-payment delivery.",
    url: `${baseUrl}/products`,
    siteName: "Digital Swarm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital Swarm digital product catalog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Product Catalog | Digital Swarm",
    description:
      "Digital products and AI workflow assets with explicit deliverables, clear licences and private fulfillment.",
    images: ["/og-image.png"],
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
