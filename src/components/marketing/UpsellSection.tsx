"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Zap, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "@/lib/types";

interface UpsellSectionProps {
  /** IDs of already-purchased products to exclude from upsell */
  excludeIds?: string[];
}

/**
 * Post-purchase upsell block shown on the /success page.
 * Fetches up to 2 products the customer hasn't bought and surfaces them
 * as "upgrade your arsenal" cards in the Digital Swarm neobrutalist aesthetic.
 */
export function UpsellSection({ excludeIds = [] }: UpsellSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUpsells() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) return;
        const data: Product[] = await res.json();
        const filtered = data
          .filter((p) => !excludeIds.includes(p.id) && p.inStock)
          .sort(() => Math.random() - 0.5)
          .slice(0, 2);
        setProducts(filtered);
      } catch {
        // Silently fail — upsell is non-critical
      } finally {
        setIsLoading(false);
      }
    }
    fetchUpsells();
  }, [excludeIds]);

  if (isLoading || products.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-5xl mt-8"
    >
      {/* Section header */}
      <div className="flex items-center gap-6 mb-8">
        <div className="h-px flex-1 bg-black/15" />
        <div className="flex items-center gap-2 px-4 py-2 bg-black border-2 border-black shadow-[4px_4px_0_#ffc737]">
          <Zap className="w-4 h-4 text-[#CCFF00]" />
          <span className="text-[10px] font-black italic uppercase tracking-[0.3em] text-[#CCFF00]">
            UPGRADE_YOUR_ARSENAL
          </span>
        </div>
        <div className="h-px flex-1 bg-black/15" />
      </div>

      <p className="text-center text-xs font-black italic uppercase tracking-widest text-black/50 mb-10">
        Agents who bought this also deployed —
      </p>

      {/* Upsell cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 + idx * 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="group relative bg-white border-4 border-black shadow-[10px_10px_0_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0_#000] transition-all duration-300"
          >
            {/* Accent stripe */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#CCFF00]" />

            <div className="flex gap-6 p-6 items-start">
              {/* Product image */}
              <div className="w-20 h-20 border-2 border-black shrink-0 relative overflow-hidden shadow-[4px_4px_0_#000]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="80px"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-black/40 italic mb-1">
                  {product.category}
                </div>
                <h3 className="text-lg font-black italic uppercase tracking-tighter leading-tight mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-2xl font-black italic text-black">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-black/30 line-through font-bold italic">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                <Link href={`/product/${product.slug || product.id}`}>
                  <button
                    id={`upsell-cta-${idx}`}
                    className="flex items-center gap-2 h-10 px-5 bg-black text-[#CCFF00] border-2 border-black font-black uppercase italic tracking-widest text-[10px] hover:bg-[#CCFF00] hover:text-black transition-all shadow-[3px_3px_0_rgba(0,0,0,0.3)] active:translate-x-px active:translate-y-px active:shadow-none"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    GET IT NOW
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Savings badge */}
            {product.originalPrice && (
              <div className="absolute -top-3 -right-3 bg-[#CCFF00] border-2 border-black px-2 py-1 shadow-[2px_2px_0_#000]">
                <span className="text-[9px] font-black uppercase italic tracking-wider text-black">
                  SAVE ₹{(product.originalPrice - product.price).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Browse all CTA */}
      <div className="mt-10 text-center">
        <Link href="/products">
          <button className="h-12 px-8 border-2 border-black bg-transparent text-black font-black uppercase italic tracking-widest text-xs hover:bg-black hover:text-[#CCFF00] transition-all shadow-[4px_4px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none">
            Browse_Full_Arsenal →
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
