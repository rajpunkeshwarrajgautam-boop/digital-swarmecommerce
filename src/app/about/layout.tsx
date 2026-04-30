import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";

export const metadata: Metadata = {
  title: "About the Forge | Our Mission & Engineering Standards",
  description: "Digital Swarm is an industrial-grade digital forge. We build the architecture of the future, providing engineers with hardened AI agent protocols and SaaS boilerplates.",
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: "About Digital Swarm | The Elite Digital Forge",
    description: "Learn about our engineering standards and the mission behind Digital Swarm's autonomous asset distribution.",
    url: `${baseUrl}/about`,
    siteName: "Digital Swarm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Digital Swarm",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Mission | Digital Swarm",
    description: "Forging the future of digital asset distribution for elite engineers.",
    images: ["/og-image.png"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
