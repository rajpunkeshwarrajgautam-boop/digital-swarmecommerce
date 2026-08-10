import { Metadata } from "next";
import { products } from "@/lib/data";
import { isSellableProductId, sanitizeCatalogText } from "@/lib/catalog-integrity";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((entry) => entry.id === slug && entry.inStock && isSellableProductId(entry.id));

  if (!product) {
    return {
      title: "Product Unavailable",
      description: "This product is not currently available for purchase on Digital Swarm.",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in";
  const url = `${baseUrl}/product/${product.id}`;
  const cleanDescription = sanitizeCatalogText(product.description)
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  return {
    title: product.name,
    description: cleanDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} | Digital Swarm`,
      description: cleanDescription,
      url,
      siteName: "Digital Swarm",
      images: [{ url: product.image, width: 1200, height: 630, alt: `${product.name} catalog artwork` }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: cleanDescription,
      images: [product.image],
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "INR",
      "product:availability": "instock",
      "product:category": product.category,
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
