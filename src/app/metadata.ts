import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalswarm.in"),
  title: {
    default: "DIGITAL SWARM | The Elite Digital Forge",
    template: "%s | DIGITAL SWARM"
  },
  description: "Accelerate your development with production-ready architectural stacks, AI-native boilerplates, and high-performance protocols. Materialize your vision in the Swarm.",
  keywords: ["SaaS Starter Kit", "AI Agent Boilerplate", "Next.js Template", "React UI Kit", "Digital Swarm", "Code Marketplace", "Premium Assets"],
  authors: [{ name: "Swarm Architects" }],
  creator: "DIGITAL SWARM",
  publisher: "DIGITAL SWARM",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "DIGITAL SWARM | High-Performance Code Protocols",
    description: "Stop rebuilding. Start shipping with the swarm. Premium architectural patterns for modern software.",
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
