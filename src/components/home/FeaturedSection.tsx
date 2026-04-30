"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { ForgeButton } from "@/components/ui/ForgeButton";

// ─── Skeleton card shown while loading ───────────────────────────────────────
function FeaturedCardSkeleton() {
  return (
    <div className="flex flex-col bg-white/3 border border-white/5 animate-pulse">
      <div className="h-48 bg-white/5" />
      <div className="p-6 flex flex-col gap-3">
        <div className="h-3 w-1/3 bg-white/10 rounded" />
        <div className="h-6 w-3/4 bg-white/10 rounded" />
        <div className="h-4 w-full bg-white/5 rounded" />
        <div className="h-4 w-2/3 bg-white/5 rounded" />
        <div className="mt-4 h-10 w-full bg-white/10 rounded" />
      </div>
    </div>
  );
}

// ─── Individual featured product card ────────────────────────────────────────
function FeaturedCard({ product, index }: { product: Product; index: number }) {
  const displayPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  const originalPrice = product.originalPrice
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(product.originalPrice)
    : null;

  const discountPct =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Truncate description to ~120 chars for the card
  const shortDesc =
    product.description.replace(/\*\*/g, "").replace(/#{1,3} /g, "").slice(0, 120) +
    (product.description.length > 120 ? "…" : "");

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 24 },
        show:  { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col bg-[#0d0d12] border border-white/8 hover:border-primary/30 transition-colors duration-300 relative overflow-hidden"
      aria-label={product.name}
    >
      {/* Gold accent line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Discount badge */}
      {discountPct && (
        <div className="absolute top-4 right-4 z-10 bg-primary text-black text-[9px] font-outfit font-black px-2 py-1 uppercase tracking-widest">
          -{discountPct}%
        </div>
      )}

      {/* Category tag */}
      <div className="px-6 pt-6 pb-0">
        <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-[0.3em] text-primary/80">
          <Tag className="w-2.5 h-2.5" />
          {product.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <h3 className="text-xl font-outfit font-black italic uppercase tracking-tighter text-white leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-[12px] font-inter text-white/35 leading-relaxed line-clamp-3">
          {shortDesc}
        </p>

        {/* Price row */}
        <div className="flex items-end gap-3 mt-auto pt-4 border-t border-white/5">
          <span className="text-2xl font-outfit font-black italic text-white tracking-tighter">
            {displayPrice}
          </span>
          {originalPrice && (
            <span className="text-sm font-mono text-white/20 line-through pb-0.5">
              {originalPrice}
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/product/${product.id}`}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-black font-outfit font-black text-sm uppercase tracking-widest italic px-6 py-3 hover:bg-primary/90 active:scale-[0.98] transition-all duration-150"
          aria-label={`Buy ${product.name}`}
        >
          <ShoppingBag className="w-4 h-4" />
          Buy Now
        </Link>
      </div>

      {/* Card index watermark */}
      <div className="absolute bottom-4 right-5 text-[60px] font-outfit font-black italic text-white/[0.02] leading-none select-none pointer-events-none">
        {String(index + 1).padStart(2, "0")}
      </div>
    </motion.article>
  );
}

// ─── Main exported section ────────────────────────────────────────────────────
export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Product[] = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid response shape");
        // Sort: highest-rated first, then by price desc as tiebreaker
        const sorted = [...data].sort(
          (a, b) => b.rating - a.rating || b.price - a.price
        );
        setProducts(sorted.slice(0, 6));
      } catch (err) {
        console.error("[FeaturedSection] Failed to fetch products:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section id="catalog" className="py-12 container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <FeaturedCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error || products.length === 0) {
    return (
      <section id="catalog" className="py-12 container mx-auto px-6 max-w-7xl text-center">
        <p className="text-white/20 font-mono text-xs uppercase tracking-widest">
          {error ? "Failed to load products. Please try again." : "No products available."}
        </p>
        <Link href="/products" className="inline-block mt-6">
          <ForgeButton variant="outline">View All Products</ForgeButton>
        </Link>
      </section>
    );
  }

  // ── Populated state ──────────────────────────────────────────────────────
  return (
    <section id="catalog" className="bg-transparent py-12">
      <div className="container mx-auto px-6 w-full max-w-7xl">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product, index) => (
            <FeaturedCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>

        {/* Browse all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 flex flex-col items-center gap-6"
        >
          <Link href="/products">
            <ForgeButton variant="outline" size="lg">
              Browse Full Catalog
              <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
            </ForgeButton>
          </Link>
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] italic text-center max-w-md">
            {products.length} products shown — full catalog at /products
          </p>
        </motion.div>
      </div>
    </section>
  );
}
