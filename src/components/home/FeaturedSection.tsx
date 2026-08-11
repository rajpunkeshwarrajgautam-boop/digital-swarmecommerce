"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Product } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;

function FeaturedCardSkeleton() {
  return (
    <div className="overflow-hidden border border-black/15 bg-[#f1eee6]/35">
      <div className="aspect-[4/3] animate-pulse bg-black/5" />
      <div className="space-y-4 p-6">
        <div className="h-3 w-1/3 animate-pulse bg-black/10" />
        <div className="h-7 w-4/5 animate-pulse bg-black/10" />
        <div className="h-4 w-full animate-pulse bg-black/5" />
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
  const shortDesc = product.description.replace(/\*\*/g, "").replace(/#{1,3} /g, "").slice(0, 104) +
    (product.description.length > 104 ? "…" : "");

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.07, 0.28), ease }}
      className="group relative flex h-full flex-col border border-black/20 bg-[#f1eee6] transition-transform duration-300 hover:-translate-y-1"
      aria-label={product.name}
    >
      <div className="relative aspect-[4/3] overflow-hidden border-b border-black/15 bg-[#cfc7fa]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover mix-blend-multiply transition duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(114,92,255,.06),transparent_50%,rgba(216,182,109,.18))]" />
        <div className="absolute left-4 top-4 border border-black/20 bg-[#f1eee6]/90 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.2em] backdrop-blur-sm">
          {product.category}
        </div>
        <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#151515] text-[#f1eee6] transition-transform duration-300 group-hover:rotate-[-35deg]">
          <ArrowRight className="h-4 w-4 -rotate-45" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-black/15 pb-4">
          <span className="font-mono text-[8px] font-black uppercase tracking-[.2em] text-[#725cff]">CATALOG / {String(index + 1).padStart(2, "0")}</span>
          <span className="font-mono text-[8px] font-bold uppercase tracking-[.17em] text-black/40">Private delivery</span>
        </div>

        <h3 className="text-2xl font-black uppercase leading-[.92] tracking-[-.05em] text-[#151515] md:text-3xl">
          {product.name}
        </h3>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/55">{shortDesc}</p>

        <div className="mt-auto pt-7">
          <div className="flex items-end justify-between gap-4 border-t border-black/15 pt-5">
            <span className="font-mono text-[8px] font-black uppercase tracking-[.16em] text-black/45">Price</span>
            <span className="text-3xl font-black tracking-[-.05em] text-[#151515]">{displayPrice}</span>
          </div>

          <div className="mt-4 flex items-start gap-2 text-[9px] font-bold uppercase leading-4 tracking-[.1em] text-black/45">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#725cff]" /> Exact scope, format and license details on product page
          </div>

          <Link
            href={`/product/${product.id}`}
            className="mt-5 flex w-full items-center justify-between border border-black/25 bg-[#151515] px-5 py-4 text-[10px] font-black uppercase tracking-[.18em] text-[#f1eee6] transition hover:bg-[#725cff]"
            aria-label={`View ${product.name}`}
          >
            View product <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
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
        setProducts(
          data
            .map((product, catalogIndex) => ({ product, catalogIndex }))
            .sort((a, b) => Number(Boolean(b.product.isFeatured)) - Number(Boolean(a.product.isFeatured)) || a.catalogIndex - b.catalogIndex)
            .slice(0, 6)
            .map(({ product }) => product)
        );
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
    return <section id="catalog"><div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((i) => <FeaturedCardSkeleton key={i} />)}</div></section>;
  }

  if (error || products.length === 0) {
    return (
      <section id="catalog" className="border border-black/20 bg-[#f1eee6]/40 px-6 py-12 text-center">
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-black/50">{error ? "Catalog is temporarily unavailable." : "No products available."}</p>
        <Link href="/products" className="editorial-button editorial-button-dark mt-6">Open catalog <ArrowRight className="h-4 w-4" /></Link>
      </section>
    );
  }

  return (
    <section id="catalog">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => <FeaturedCard key={product.id} product={product} index={index} />)}
      </div>
      <div className="mt-10 flex justify-end">
        <Link href="/products" className="editorial-button editorial-button-dark">Browse full catalog <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}
