"use client";

import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, Zap, Cpu, Code2, ShoppingCart, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${
            s <= Math.round(rating) ? "fill-primary text-primary" : "text-secondary/10"
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
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[8px] font-black uppercase tracking-widest text-accent italic">
          <Cpu className="w-2.5 h-2.5" /> Neural
        </div>
      )}
      {isWeb && (
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-black uppercase tracking-widest text-primary italic">
          <Code2 className="w-2.5 h-2.5" /> Next.js 15
        </div>
      )}
      <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/5 border border-secondary/10 text-[8px] font-black uppercase tracking-widest text-secondary/40 italic">
        <Zap className="w-2.5 h-2.5" /> Optimized
      </div>
    </div>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlistStore();

  /**
   * ShopEase Inspiration: Visual feedback on cart add.
   * Shows a "Added!" confirmation state before resetting.
   */
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (added) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
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
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-4xl transition-all duration-500 h-full flex flex-col hover:shadow-[0_40px_80px_rgba(26,26,46,0.12)] border border-secondary/5 hover:border-primary/20 overflow-hidden"
    >
      {/* ── IMAGE BLOCK ────────────────────────────────── */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-secondary/5">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            alt={product.name}
            loading="lazy"
          />
          {/*
           * ShopEase Inspiration: gradient overlay on hover
           * (rgba(0,0,0,0.5) darkens product image on interaction)
           */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        {/* Most Popular Badge */}
        {product.id === "ai-agent-boilerplate" && (
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-primary text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20 italic">
              Most Popular
            </div>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={toggleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 shadow-xl ${
            wishlisted
              ? "bg-primary text-white scale-110"
              : "bg-white/80 backdrop-blur-md text-secondary/40 hover:text-primary hover:scale-110 border border-secondary/5"
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>

        {/*
         * ShopEase Inspiration: Prominent price badge on the image.
         * ShopEase styles the price in a card footer; we surface it earlier
         * on the image itself for at-a-glance scanning.
         */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="bg-white/95 backdrop-blur-md text-secondary font-black text-base px-4 py-1.5 rounded-full border border-secondary/10 shadow-lg -skew-x-3 inline-block">
            ₹{Math.round(product.price).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* ── CONTENT BLOCK ──────────────────────────────── */}
      <div className="flex flex-col grow gap-2 px-6 pt-5 pb-6 relative z-10">
        {/* Category + Stars */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">{product.category}</span>
          <StarRating rating={product.rating} />
        </div>

        <h3 className="text-xl font-black text-secondary leading-none tracking-tighter mb-2 group-hover:text-primary transition-colors line-clamp-2 uppercase italic">
          {product.name}
        </h3>

        <p className="text-sm text-secondary/50 line-clamp-2 grow font-bold uppercase tracking-tight leading-tight">
          {product.description}
        </p>

        <TechBadges category={product.category} />

        {/*
         * ShopEase Inspiration: Full-width "Add to Cart" as the primary CTA,
         * with a secondary "View Details" ghost button beneath it.
         * ShopEase uses: `.add-to-cart { width: 100%; border-radius: 5px; }`
         * We adapt this to the ONO system with an animation state.
         */}
        <div className="flex flex-col gap-2 mt-6">
          <button
            onClick={handleAddToCart}
            aria-label={added ? "Added to cart" : "Add to cart"}
            className={`w-full h-12 font-black uppercase italic text-xs rounded-2xl border-2 transition-all flex items-center justify-center gap-2 ${
              added
                ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20"
                : "bg-primary text-white border-secondary hover:shadow-xl hover:shadow-primary/20"
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Added to Cart!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <Link href={`/product/${product.id}`} className="w-full">
            <button className="w-full h-10 bg-secondary/5 text-secondary rounded-2xl font-black uppercase italic text-xs border-2 border-transparent hover:bg-secondary/10 hover:border-secondary/10 transition-all">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
