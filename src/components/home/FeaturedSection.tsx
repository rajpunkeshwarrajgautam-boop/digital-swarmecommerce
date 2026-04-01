"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="catalog" className="bg-transparent py-12">
      <div className="container mx-auto px-6 w-full max-w-7xl">
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <ProductCard product={product} priority={index < 3} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
 
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 flex flex-col items-center gap-10"
        >
          <Link href="/products">
            <ForgeButton variant="outline" size="lg">
              Explore Collection
              <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
            </ForgeButton>
          </Link>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] italic">
            Updated Real-Time // v2.0
          </p>
        </motion.div>
      </div>
    </section>
  );
}
