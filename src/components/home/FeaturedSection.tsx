
"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Just take the first 4 as "featured" for now
        setProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-32 container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-16 border-l-4 border-primary pl-8 leading-none">Catalog_Fetch</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-6 relative py-32">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 mb-20 relative z-10">
        <div className="text-center md:text-left flex flex-col gap-2">
          <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.8]">
            Trending_Now
          </h2>
          <p className="text-primary font-black uppercase tracking-[0.4em] text-[10px] italic">Global_Usage_Spikes_Detected</p>
        </div>
        <Link href="/products">
          <Button variant="outline" size="lg">
            Access_Full_Catalog <ArrowRight className="ml-4 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
