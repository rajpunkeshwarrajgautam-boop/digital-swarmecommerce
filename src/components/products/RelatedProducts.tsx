
"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { Product } from "@/lib/types";

export function RelatedProducts({ category, currentProductId }: { category: string, currentProductId: string }) {
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
        if (!res.ok) throw new Error('Failed to fetch related products');
        const data = await res.json();
        const filtered = data
          .filter((p: Product) => p.id !== currentProductId)
          .slice(0, 4);
        setRelated(filtered);
      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (category) {
      fetchRelated();
    }
  }, [category, currentProductId]);

  if (loading) return <div className="mt-24 pt-16 border-t border-border animate-pulse h-64 bg-secondary/30 rounded-lg"></div>;
  if (related.length === 0) return null;

  return (
    <div className="mt-24 border-t border-border pt-16">
      <h2 className="text-3xl font-bold mb-8">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {related.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
