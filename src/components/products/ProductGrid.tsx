"use client";

import { useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { trackViewItemList } from "@/lib/web-analytics";

interface ProductGridProps {
  products: Product[];
  listName?: string;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.48, ease: [0.16, 1, 0.3, 1] } },
};

export function ProductGrid({ products, listName = "product_grid" }: ProductGridProps) {
  const lastSignature = useRef<string>("");

  useEffect(() => {
    if (!products.length) return;
    const signature = `${listName}:${products.map((product) => product.id).join("|")}`;
    if (lastSignature.current === signature) return;

    trackViewItemList(
      listName,
      products.slice(0, 24).map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
      }))
    );
    lastSignature.current = signature;
  }, [products, listName]);

  if (products.length === 0) {
    return (
      <div className="border border-black/20 bg-[#f1eee6] px-6 py-16 text-center text-[#151515]">
        <span className="font-mono text-[9px] font-black uppercase tracking-[.22em] text-[#725cff]">No matching products</span>
        <h3 className="mt-4 text-3xl font-black uppercase tracking-[-.045em]">Try a broader search.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/50">Change the category or search phrase to see other approved catalog items.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
    >
      {products.map((product, index) => (
        <motion.div key={product.id} variants={item} className="h-full">
          <ProductCard product={product} priority={index < 3} listName={listName} />
        </motion.div>
      ))}
    </motion.div>
  );
}
