import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";

export const metadata: Metadata = {
  title: "AI Agent Protocols | Autonomous Intelligence Registry",
  description: "Deploy elite AI agent protocols for research, finance, sales, and more. Production-ready templates for the autonomous future.",
  alternates: {
    canonical: `${baseUrl}/ai-agents`,
  },
  openGraph: {
    title: "AI Agent Protocols | Digital Swarm",
    description: "Explore our collection of specialized AI agent templates designed for high-performance automation.",
    url: `${baseUrl}/ai-agents`,
    siteName: "Digital Swarm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital Swarm AI Agents",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent Protocols | Digital Swarm",
    description: "Industrial-grade AI agent templates for elite engineers.",
    images: ["/og-image.png"],
  },
};

export default function AIAgentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
