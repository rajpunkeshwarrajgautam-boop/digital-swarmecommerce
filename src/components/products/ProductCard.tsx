"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Cpu, Code2, ShoppingCart, Check, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-2.5 h-2.5 ${
            s <= Math.round(rating) ? "fill-accent text-accent" : "text-white/10"
          }`}
        />
      ))}
    </div>
  );
}

function TechBadges({ category }: { category: string }) {
  const isAI = category.includes("AI") || category.includes("Agent");
  const isWeb = category.includes("Web") || category.includes("Software") || category.includes("Boilerplates");

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4">
      {isAI && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-accent/5 border border-accent/20 text-[9px] font-mono uppercase tracking-widest text-accent">
          <Cpu className="w-3 h-3" /> Neural
        </div>
      )}
      {isWeb && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 border border-primary/20 text-[9px] font-mono uppercase tracking-widest text-primary">
          <Code2 className="w-3 h-3" /> High-Perf
        </div>
      )}
      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 border border-white/5 text-[9px] font-mono uppercase tracking-widest text-white/30">
        <Terminal className="w-3 h-3" /> v2.0
      </div>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlistStore();
  const { currency } = useCurrency();

  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (added) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

  return (
    <GlassCard className="p-0 overflow-hidden h-full group flex flex-col ono-reveal">
      <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-white/5 silk-reveal-mask">
        <div className="ono-reveal h-full w-full">
          <Image
            src={product.image}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
            alt={product.name}
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        {/* Most Popular Badge */}
        {product.id === "ai-agent-boilerplate" && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-primary text-black text-[9px] font-outfit font-black px-3 py-1 rounded-sm uppercase tracking-widest shadow-lg italic">
              Elite Protocol
            </div>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all z-20 ${
            wishlisted
              ? "bg-primary text-black"
              : "bg-black/40 backdrop-blur-md text-white/40 hover:text-primary hover:bg-black/60 border border-white/10"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="font-outfit font-black text-lg text-white uppercase italic tracking-tighter glow-text">
            {formatCurrency(product.price, currency)}
          </span>
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">{product.category}</span>
          <StarRating rating={product.rating} />
        </div>

        <h3 className="text-xl font-outfit font-black italic uppercase text-white group-hover:text-accent transition-colors line-clamp-1 leading-none">
          {product.name}
        </h3>

        <p className="text-sm text-white/40 font-inter line-clamp-2 leading-snug">
          {product.description}
        </p>

        <TechBadges category={product.category} />

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
          <ForgeButton
            variant={added ? "outline" : "primary"}
            size="sm"
            onClick={handleAddToCart}
            className="w-full"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" /> Protocol Active
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Materialize
                </motion.span>
              )}
            </AnimatePresence>
          </ForgeButton>

          <Link href={`/product/${product.id}`} className="w-full">
            <button className="w-full text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors">
              Access Documentation
            </button>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
