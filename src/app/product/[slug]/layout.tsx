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
    };
  }

  const baseUrl = "https://digitalswarm.in";
  const url = `${baseUrl}/product/${product.id}`;

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: url,
      images: [
        {
          url: product.image,
          alt: product.name,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
