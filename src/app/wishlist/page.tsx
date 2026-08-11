"use client";

import { useWishlistStore } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/store";
import type { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, PackageOpen, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, syncWithCatalog } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  const [mounted, setMounted] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [catalogReady, setCatalogReady] = useState(false);

  useEffect(() => {
    setMounted(true);
    let active = true;
    fetch("/api/products", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`);
        return response.json() as Promise<Product[]>;
      })
      .then((products) => {
        if (!active || !Array.isArray(products)) return;
        setCatalog(products);
        syncWithCatalog(products);
      })
      .catch((error) => console.error("[wishlist] Catalog refresh failed", error))
      .finally(() => {
        if (active) setCatalogReady(true);
      });
    return () => {
      active = false;
    };
  }, [syncWithCatalog]);

  const catalogById = useMemo(
    () => new Map(catalog.map((product) => [product.id, product])),
    [catalog],
  );

  if (!mounted || !catalogReady) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono uppercase tracking-[.2em] text-white/35">
        Checking saved products…
      </div>
    );
  }

  return (
    <main className="container mx-auto min-h-[80vh] max-w-6xl px-4 py-24">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-red-500/10 p-2">
              <Heart className="h-6 w-6 fill-red-500 text-red-500" />
            </div>
            <h1 className="text-4xl font-black uppercase italic tracking-tight md:text-6xl">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground">Saved products that are still available in the approved catalog.</p>
        </div>

        {items.length > 0 ? (
          <Button
            variant="outline"
            onClick={clearWishlist}
            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        ) : null}
      </div>

      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border-2 border-dashed border-border bg-secondary/5 py-28 text-center"
          >
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-secondary/10">
              <PackageOpen className="h-10 w-10 text-muted-foreground opacity-50" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">Your wishlist is empty</h2>
            <p className="mx-auto mb-8 max-w-sm text-muted-foreground">Browse currently available products and save anything you want to compare later.</p>
            <Link href="/products">
              <Button size="lg" className="rounded-full px-8">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const product = catalogById.get(item.id);
              if (!product) return null;
              return (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/30"
                >
                  <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-2xl">
                    <Image src={product.image} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" alt={product.name} />
                    <button
                      type="button"
                      aria-label={`Remove ${product.name} from wishlist`}
                      onClick={() => removeItem(item.id)}
                      className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 text-red-300 backdrop-blur-md transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex grow flex-col">
                    <p className="mb-2 font-mono text-[9px] font-black uppercase tracking-[.18em] text-white/35">{product.category}</p>
                    <h3 className="mb-2 text-2xl font-black leading-tight group-hover:text-primary">{product.name}</h3>
                    <p className="mb-7 text-2xl font-black text-primary">{inr.format(product.price)}</p>

                    <div className="mt-auto flex gap-3">
                      <Button onClick={() => addItemToCart(product)} className="h-12 flex-1">
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                      </Button>
                      <Link href={`/product/${product.id}`} aria-label={`View ${product.name}`}>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {items.length > 0 ? (
        <section className="mt-20 rounded-[2rem] border border-white/10 bg-zinc-950 p-9 text-center md:p-12">
          <h2 className="text-3xl font-black uppercase italic text-white md:text-4xl">Ready to compare or purchase?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
            Open a product page for exact scope and licence details, or add an available product to the cart. Checkout revalidates catalog price and availability on the server.
          </p>
          <Link href="/products" className="mt-7 inline-flex">
            <Button variant="outline" className="h-13 px-8 text-white">Continue Shopping</Button>
          </Link>
        </section>
      ) : null}
    </main>
  );
}
