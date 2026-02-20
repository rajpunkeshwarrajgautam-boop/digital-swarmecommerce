import type { Metadata } from "next";
import { Geist, Geist_Mono, Titan_One, Fredoka } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/layout/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const titanOne = Titan_One({
  weight: "400",
  variable: "--font-titan",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Digital Swarm | Digital Store",
    template: "%s | Digital Swarm"
  },
  description: "Premium digital products, bundles, and web development resources by Digital Swarm.",
  keywords: ["digital products", "web development bundles", "nextjs templates", "ecommerce", "digital assets", "code bundles"],
  authors: [{ name: "Digital Swarm Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  metadataBase: new URL('https://digitalswarm.in'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://digitalswarm.in',
    title: 'Digital Swarm | Premium Digital Products',
    description: 'Premium digital products, web development bundles, and curated resources.',
    siteName: 'Digital Swarm',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Swarm — Premium Digital Products' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Swarm | Premium Digital Products',
    description: 'Premium digital products, web development bundles, and curated resources.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { colorPrimary: '#3b82f6' },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${titanOne.variable} ${fredoka.variable} antialiased bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-black`}
        >
          <Header />
          <main className="flex-1 w-full pt-16">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
