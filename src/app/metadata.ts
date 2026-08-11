import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";
// Production storefront metadata is intentionally claim-minimal and factual.

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Digital Swarm | Digital Products & AI Workflow Assets",
    template: "%s | Digital Swarm",
  },
  description:
    "Digital Swarm sells downloadable digital products, AI workflow assets, prompt systems, playbooks, and software kits with server-validated checkout and private delivery.",
  keywords: [
    "digital products",
    "AI workflow assets",
    "AI prompt systems",
    "software kits",
    "digital playbooks",
    "SaaS launch kit",
    "Digital Swarm",
  ],
  creator: "Digital Swarm",
  publisher: "Digital Swarm",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Digital Swarm | Digital Products & AI Workflow Assets",
    description:
      "Downloadable digital products with clear scope, server-validated checkout, and private post-payment delivery.",
    url: baseUrl,
    siteName: "Digital Swarm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital Swarm digital product storefront",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Swarm | Digital Products",
    description: "Digital products and AI workflow assets with clear deliverables and private fulfillment.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  alternates: {
    canonical: "/",
  },
};
