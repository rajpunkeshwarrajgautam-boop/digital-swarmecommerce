import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalswarm.in"),
  title: {
    default: "DIGITAL SWARM | The Elite Digital Forge",
    template: "%s | DIGITAL SWARM"
  },
  description:
    "Buy digital products with instant delivery: AI prompt libraries, elite vertical playbooks, starter ZIPs, and Notion templates. Secure checkout on digitalswarm.in — India and global cards where enabled.",
  keywords: [
    "AI prompts India",
    "digital products instant download",
    "Notion CRM template",
    "AI agent prompts",
    "SaaS checklist",
    "Digital Swarm",
    "elite AI protocols",
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
    title: "DIGITAL SWARM | Digital products & AI protocols",
    description:
      "Instant-download digital goods: prompts, playbooks, kits, and templates. Honest listings, secure checkout, refund policy on-site.",
    url: "https://digitalswarm.in",
    siteName: "DIGITAL SWARM",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIGITAL SWARM | The Elite Forge",
    description: "Premium Next.js & AI templates for elite engineers.",
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
