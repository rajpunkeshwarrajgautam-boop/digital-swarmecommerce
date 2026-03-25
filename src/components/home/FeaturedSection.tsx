"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        // Shift most popular to front if exists
        const sorted = data.sort((a: Product) => a.id === 'ai-agent-boilerplate' ? -1 : 1);
        setProducts(sorted.slice(0, 6)); 
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
      <section id="catalog" className="py-24 container mx-auto px-6">
        <div className="h-12 w-64 bg-secondary/5 rounded-full animate-pulse mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-4/5 bg-secondary/5 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="catalog" className="bg-background py-32 overflow-hidden">
      <div className="container mx-auto px-6 w-full max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center gap-6 mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Premium Asset Catalog</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-secondary tracking-tighter uppercase italic">
            Trending <span className="text-primary italic underline decoration-secondary/10 underline-offset-8">Now</span>
          </h2>
          <p className="text-secondary/50 font-bold text-lg max-w-2xl uppercase tracking-tight">
            The absolute standard in production-ready digital architecture.
          </p>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
 
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-24 flex flex-col items-center gap-6"
        >
          <Link href="/products">
            <button className="h-20 px-12 bg-white text-secondary font-black uppercase italic rounded-3xl border-4 border-secondary hover:bg-secondary/5 transition-all flex items-center justify-center gap-4 group shadow-2xl shadow-secondary/5">
              View All Products
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <p className="text-[10px] font-black text-secondary/30 uppercase tracking-[0.2em] italic">Updated Daily // Worldwide Access</p>
        </motion.div>
      </div>
    </section>
  );
}
