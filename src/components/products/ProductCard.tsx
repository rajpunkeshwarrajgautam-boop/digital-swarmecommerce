"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatCurrency } from "@/lib/utils";
import { trackAddToCart, trackSelectItem } from "@/lib/web-analytics";
import { useSwarmPrefetch } from "@/hooks/useSwarmPrefetch";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  listName?: string;
}

export function ProductCard({ product, priority = false, listName = "product_grid" }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isWishlisted } = useWishlistStore();
  const { currency } = useCurrency();
  const { prefetch } = useSwarmPrefetch();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (added) return;
    addItem(product);
    trackAddToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, category: product.category });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const toggleWishlist = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (wishlisted) removeFromWishlist(product.id);
    else addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image });
  };

  const handleSelectItem = () => {
    trackSelectItem(listName, { id: product.id, name: product.name, price: product.price, category: product.category });
  };

  const description = product.description.replace(/\*\*/g, "").replace(/#{1,3} /g, "");

  return (
    <article
      className="group flex h-full flex-col overflow-hidden border border-black/20 bg-[#f1eee6] text-[#151515] transition-transform duration-300 hover:-translate-y-1"
      onMouseEnter={() => prefetch(`/api/products/${product.id}`)}
    >
      <Link href={`/product/${product.id}`} onClick={handleSelectItem} className="relative block aspect-[4/3] overflow-hidden border-b border-black/15 bg-[#d9d0ff]">
        <Image
          src={product.image}
          fill
          className="object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          alt={product.name}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          unoptimized={product.image.endsWith(".svg")}
        />
        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(114,92,255,.04),transparent_48%,rgba(216,182,109,.2))]" />
        <div className="absolute left-4 top-4 border border-black/20 bg-[#f1eee6]/90 px-3 py-1.5 font-mono text-[8px] font-black uppercase tracking-[.2em] backdrop-blur-sm">
          {product.category}
        </div>
        <button
          type="button"
          onClick={toggleWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-black/20 transition ${wishlisted ? "bg-[#725cff] text-white" : "bg-[#f1eee6]/90 text-black/60 hover:bg-[#151515] hover:text-white"}`}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
        <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#151515] text-[#f1eee6] transition-transform duration-300 group-hover:rotate-[-35deg]">
          <ArrowRight className="h-4 w-4 -rotate-45" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 border-b border-black/15 pb-4">
          <span className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-[#725cff]">Approved catalog</span>
          <span className="font-mono text-[8px] font-bold uppercase tracking-[.15em] text-black/35">Private delivery</span>
        </div>

        <Link href={`/product/${product.id}`} onClick={handleSelectItem} className="mt-5 block">
          <h3 className="line-clamp-2 text-2xl font-black uppercase leading-[.92] tracking-[-.05em] transition-colors group-hover:text-[#725cff] md:text-3xl">{product.name}</h3>
        </Link>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/50">{description}</p>

        <div className="mt-auto pt-7">
          <div className="flex items-end justify-between gap-4 border-t border-black/15 pt-5">
            <div>
              <span className="block font-mono text-[8px] font-black uppercase tracking-[.18em] text-black/40">Catalog price</span>
              <span className="mt-1 block text-3xl font-black tracking-[-.05em]">{formatCurrency(product.price, currency)}</span>
            </div>
            <Link href={`/product/${product.id}`} onClick={handleSelectItem} className="text-[9px] font-black uppercase tracking-[.15em] text-black/45 underline decoration-black/20 underline-offset-4 transition hover:text-black">
              Details
            </Link>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`mt-5 flex min-h-12 w-full items-center justify-center gap-2 border px-5 text-[10px] font-black uppercase tracking-[.17em] transition ${added ? "border-[#725cff] bg-[#d9d0ff] text-[#151515]" : "border-[#151515] bg-[#151515] text-[#f1eee6] hover:border-[#725cff] hover:bg-[#725cff]"}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span key="added" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> Added to cart
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" /> Add to cart
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </article>
  );
}
