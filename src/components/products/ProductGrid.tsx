"use client";

import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { motion, Variants } from "framer-motion";

interface ProductGridProps {
  products: Product[];
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  }
};

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-white/5 bg-white/5 backdrop-blur-md silk-reveal-mask">
        <div className="text-primary font-mono text-[10px] uppercase tracking-[0.4em] mb-4 glow-text">
          - No Signal Detected -
        </div>
        <h3 className="text-2xl font-outfit font-black italic uppercase text-white/40">
          Swarm Data Restricted
        </h3>
        <p className="text-white/20 font-inter mt-2 text-sm max-w-md mx-auto">
          The current filter query returned zero autonomous entities. Adjust your parameters or return to full surveillance.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="product-grid"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
