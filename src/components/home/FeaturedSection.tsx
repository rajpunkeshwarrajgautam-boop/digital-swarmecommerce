"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { ForgeButton } from "@/components/ui/ForgeButton";

function FeaturedCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/7 bg-white/[0.025]">
      <div className="aspect-[16/10] animate-pulse bg-white/5" />
      <div className="space-y-4 p-6">
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/10" />
        <div className="h-7 w-4/5 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-full animate-pulse rounded bg-white/5" />
        <div className="h-11 w-full animate-pulse rounded-xl bg-white/8" />
      </div>
    </div>
  );
}

function FeaturedCard({ product, index }: { product: Product; index: number }) {
  const reduceMotion = useReducedMotion();
  const displayPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(product.price);
  const originalPrice = product.originalPrice
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.originalPrice)
    : null;
  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;
  const shortDesc = product.description.replace(/\*\*/g, "").replace(/#{1,3} /g, "").slice(0, 118) +
    (product.description.length > 118 ? "…" : "");

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.28), ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduceMotion ? undefined : { y: -8, rotateX: 1.5, rotateY: index % 2 ? -1.2 : 1.2 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a10] shadow-[0_30px_90px_rgba(0,0,0,.25)] [transform-style:preserve-3d]"
      aria-label={product.name}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#111118]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover opacity-78 transition duration-700 group-hover:scale-[1.045] group-hover:opacity-95"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(5,5,9,.22)_62%,#0a0a10_100%)]" />
        <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[.18em] text-white/65 backdrop-blur-xl">
          {product.category}
        </div>
        {discountPct ? (
          <div className="absolute right-4 top-4 rounded-full border border-primary/25 bg-primary/90 px-3 py-1.5 font-mono text-[9px] font-black text-black">
            SAVE {discountPct}%
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-primary">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span className="font-mono text-[10px] font-bold">{product.rating.toFixed(1)}</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[.16em] text-white/25">Digital delivery</span>
        </div>

        <h3 className="text-xl font-black uppercase italic leading-tight tracking-[-.035em] text-[#f6f1e8] transition-colors group-hover:text-primary md:text-2xl">
          {product.name}
        </h3>
        <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-white/42">{shortDesc}</p>

        <div className="mt-6 flex items-end gap-3 border-t border-white/7 pt-5">
          <span className="text-2xl font-black tracking-[-.03em] text-white">{displayPrice}</span>
          {originalPrice ? <span className="pb-1 text-xs text-white/25 line-through">{originalPrice}</span> : null}
        </div>

        <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[.12em] text-white/35">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Clear scope &amp; license details on product page
        </div>

        <Link
          href={`/product/${product.id}`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/25 bg-primary/[0.08] px-5 py-3.5 font-outfit text-xs font-black uppercase tracking-[.12em] text-primary transition hover:bg-primary hover:text-black"
          aria-label={`View ${product.name}`}
        >
          <ShoppingBag className="h-4 w-4" /> View product
        </Link>
      </div>
    </motion.article>
  );
}

export function FeaturedSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data: Product[] = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid product response");
        setProducts([...data].sort((a, b) => b.rating - a.rating || b.price - a.price).slice(0, 6));
      } catch (fetchError) {
        console.error("[FeaturedSection] Failed to fetch products:", fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  if (loading) {
    return <section id="catalog" className="container mx-auto max-w-7xl px-6 py-8"><div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((i) => <FeaturedCardSkeleton key={i} />)}</div></section>;
  }

  if (error || products.length === 0) {
    return (
      <section id="catalog" className="container mx-auto max-w-7xl px-6 py-12 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-white/35">{error ? "Catalog is temporarily unavailable." : "No products available."}</p>
        <Link href="/products" className="mt-6 inline-block"><ForgeButton variant="outline">Open catalog</ForgeButton></Link>
      </section>
    );
  }

  return (
    <section id="catalog" className="bg-transparent py-8">
      <div className="container mx-auto w-full max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => <FeaturedCard key={product.id} product={product} index={index} />)}
        </div>
        <div className="mt-14 flex justify-center">
          <Link href="/products"><ForgeButton variant="outline" size="lg">Browse full catalog <ArrowRight className="h-4 w-4" /></ForgeButton></Link>
        </div>
      </div>
    </section>
  );
}
