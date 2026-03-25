import { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { VisualQuality } from "@/components/layout/VisualQuality";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalswarm.in"),
  title: {
    default: "Digital Swarm | Premium SaaS Boilerplates & AI Agent Templates",
    template: "%s | Digital Swarm"
  },
  description: "Accelerate your development with production-ready Next.js starters, AI agent boilerplates, and high-performance UI kits. Built for elite developers.",
  keywords: ["SaaS Starter Kit", "AI Agent Boilerplate", "Next.js Template", "React UI Kit", "Digital Swarm", "Code Marketplace", "Premium Assets"],
  authors: [{ name: "Digital Swarm Team" }],
  creator: "Digital Swarm",
  publisher: "Digital Swarm",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Digital Swarm | High-Performance Code Protocols",
    description: "Stop rebuilding. Start shipping with the swarm. Premium architectural patterns for modern software.",
    url: "https://digitalswarm.in",
    siteName: "Digital Swarm",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital Swarm Marketplace",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Swarm | SaaS Boilerplates",
    description: "Premium Next.js & AI templates for elite engineers.",
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-secondary selection:bg-primary selection:text-white">
        <ClientProviders>
          <VisualQuality />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
