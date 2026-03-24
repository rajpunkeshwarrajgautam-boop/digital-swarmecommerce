"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { id: 'all', label: 'All Protocols' },
  { id: 'AI Agents', label: 'AI Agents' },
  { id: 'Web Development', label: 'Software' },
  { id: 'Marketing AI', label: 'Marketing' },
];

export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data.slice(0, 8)); // Initially show first 8 items
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredProducts(products.slice(0, 8));
    } else {
      setFilteredProducts(products.filter(p => p.category === activeTab).slice(0, 8));
    }
  }, [activeTab, products]);

  if (loading) {
    return (
      <section className="py-24 container mx-auto px-6">
        <div className="h-12 w-64 bg-gray-100 rounded-full animate-pulse mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-4/5 bg-gray-100 rounded-4xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-32 border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 w-full max-w-7xl">
        <div className="flex flex-col items-center text-center gap-6 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600 italic">Advanced Catalog v4.0</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic">
            Trending <span className="text-cyan-500">Collections</span>
          </h2>
          <p className="text-gray-500 font-bold text-lg max-w-2xl uppercase tracking-tight">
            Explore the absolute standard in high-performance digital infrastructure.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 bg-gray-100 rounded-full">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                  activeTab === tab.id 
                    ? "bg-white text-gray-900 shadow-sm scale-105" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-20 flex justify-center">
          <Link href="/products">
            <button className="flex items-center gap-3 px-10 py-5 rounded-none bg-black text-white font-black uppercase italic border-4 border-black shadow-[10px_10px_0_#22d3ee] hover:shadow-[5px_5px_0_#22d3ee] hover:translate-x-1 hover:translate-y-1 transition-all group">
              View All Protocols
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

