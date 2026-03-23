"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
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
      <section className="py-24 container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Loading collection...</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-[4/5] bg-gray-100 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-white py-32 border-t border-gray-100">
      <div className="container mx-auto px-6 w-full max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 mb-16">
          <div className="text-center md:text-left flex flex-col gap-3">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Trending Collections
            </h2>
            <p className="text-gray-500 font-medium text-lg">
              Explore the most downloaded AI agents this week
            </p>
          </div>
          <Link href="/products">
            <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-bold shadow-sm hover:shadow hover:-translate-y-0.5 transition-all group">
              View All Products
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
            </button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
