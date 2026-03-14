
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
      <section className="py-24 container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-4/5 bg-secondary/30 rounded-2xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-3xl rounded-full pointer-events-none opacity-50" />
      
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-16 relative z-10">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-primary via-white to-primary/40 leading-none mb-2">
            Trending Now
          </h2>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Top picks from the swarm community</p>
        </div>
        <Link href="/products">
          <Button variant="outline" className="group rounded-full border-primary/20 hover:border-primary transition-all px-8 h-12">
            View All Products <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
