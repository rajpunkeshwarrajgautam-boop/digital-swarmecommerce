import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "DIGITAL SWARM | Elite AI Agent Store & SaaS Boilerplates",
    template: "%s | DIGITAL SWARM"
  },
  description:
    "Industrial-grade digital assets for engineers: AI agent protocols, Next.js SaaS kits, elite vertical playbooks, and production-ready Notion systems. Instant delivery on digitalswarm.in.",
  keywords: [
    "AI agents for sale",
    "Next.js SaaS boilerplate",
    "AI prompt engineering India",
    "Notion CRM for freelancers",
    "Digital Swarm ecommerce",
    "elite AI protocols",
    "autonomous agent templates",
    "SaaS launch kits",
  ],
  authors: [{ name: "Swarm Architects" }],
  creator: "DIGITAL SWARM",
  publisher: "DIGITAL SWARM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "DIGITAL SWARM | Elite AI Agent Store & SaaS Boilerplates",
    description:
      "Instant-download digital goods for high-performance builds: AI protocols, SaaS kits, and industrial playbooks. Secure checkout and verified delivery.",
    url: baseUrl,
    siteName: "DIGITAL SWARM",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or fallback to a default
        width: 1200,
        height: 630,
        alt: "Digital Swarm - Elite Digital Forge",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIGITAL SWARM | The Elite Forge",
    description: "Premium Next.js templates and AI agent protocols for elite engineers.",
    images: ["/og-image.png"],
    creator: "@DigitalSwarm",
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

