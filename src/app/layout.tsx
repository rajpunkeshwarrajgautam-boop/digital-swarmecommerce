import { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { VisualQuality } from "@/components/layout/VisualQuality";
import { ForgeToast } from "@/components/ui/ForgeToast";
import { AIConcierge } from "@/components/forge/AIConcierge";
import Script from "next/script";
import { env } from "@/lib/env";
import { ForgeErrorBoundary } from "@/components/ui/ForgeErrorBoundary";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const outfit = Outfit({ 
  subsets: ["latin"], 
  variable: "--font-outfit",
  display: 'swap',
});

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-jetbrains",
  display: 'swap',
});

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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital Swarm Forge Marketplace",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DIGITAL SWARM | The Elite Forge",
    description: "Premium Next.js & AI templates for elite engineers.",
    images: ["/og-image.png"],
  },
// ... (omitting robots/icons for brevity in chunk but will keep in actual file)
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
  manifest: undefined, // Removed until file is materialized
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrains.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-white selection:bg-primary selection:text-black">
        <ForgeErrorBoundary>
          <ClientProviders>
            <VisualQuality />
            <ForgeToast />
            <AIConcierge />
            <Header />
            <Script
              id="fb-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${env.NEXT_PUBLIC_FB_PIXEL_ID || ""}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </ClientProviders>
        </ForgeErrorBoundary>
      </body>
    </html>
  );
}
