import { Metadata } from "next";
import { products } from "@/lib/data";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested digital protocol was not found in our registry.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";
  const url = `${baseUrl}/product/${product.id}`;
  const ogImage = product.image; 

  // Clean description for meta tags
  const cleanDescription = product.description
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return {
    title: product.name,
    description: cleanDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${product.name} | Digital Swarm`,
      description: cleanDescription,
      url: url,
      siteName: "Digital Swarm",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${product.name} - Elite Digital Asset`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: cleanDescription,
      images: [ogImage],
      creator: "@DigitalSwarm",
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "INR",
      "product:availability": product.inStock ? "instock" : "oos",
      "product:category": product.category,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
