import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Asset Catalog",
  description: "Browse our collection of high-performance SaaS boilerplates, AI agent templates, and production-ready code protocols.",
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
