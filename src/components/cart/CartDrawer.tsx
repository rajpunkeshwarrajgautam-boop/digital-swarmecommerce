"use client";

import { useCartStore } from "@/lib/store";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ForgeButton } from "@/components/ui/ForgeButton";
import type { Product } from "@/lib/types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    syncWithCatalog,
    isOpen,
    toggleCart,
    getCartTotal,
  } = useCartStore();
  const total = getCartTotal();
  const [isClient, setIsClient] = useState(false);

  const drawerVariants: Variants = {
    closed: { x: "100%", opacity: 0 },
    open: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
  };

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient || !isOpen) return;
    let active = true;
    fetch("/api/products", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`);
        return response.json() as Promise<Product[]>;
      })
      .then((catalog) => {
        if (active && Array.isArray(catalog)) syncWithCatalog(catalog);
      })
      .catch((error) => console.error("[cart-drawer] Catalog refresh failed", error));
    return () => {
      active = false;
    };
  }, [isClient, isOpen, syncWithCatalog]);

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-lg"
          />

          <motion.aside
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-100 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#09090e] shadow-[-40px_0_80px_rgba(0,0,0,.75)]"
          >
            <div className="flex items-center justify-between border-b border-white/8 p-7">
              <div>
                <h2 className="font-outfit text-2xl font-black uppercase italic tracking-tighter text-white">Your Cart</h2>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[.18em] text-white/30">
                  {items.reduce((sum, item) => sum + item.quantity, 0)} selected · INR
                </p>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={toggleCart}
                className="rounded-xl border border-white/8 bg-white/5 p-3 text-white/45 transition hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-7">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/8 bg-white/[0.025]">
                    <ShoppingBag className="h-9 w-9 text-white/15" />
                  </div>
                  <div>
                    <h3 className="font-outfit text-xl font-black uppercase text-white/65">Your cart is empty</h3>
                    <p className="mt-2 max-w-[230px] text-xs leading-5 text-white/30">Browse the currently approved catalog and add the products you want.</p>
                  </div>
                  <Link href="/products" onClick={toggleCart} className="w-full max-w-[220px]">
                    <ForgeButton className="w-full">Browse Products</ForgeButton>
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <article key={item.productId} className="flex gap-5">
                    <Link
                      href={`/product/${item.productId}`}
                      onClick={toggleCart}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/8 bg-white/5"
                    >
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <Link href={`/product/${item.productId}`} onClick={toggleCart} className="line-clamp-2 text-sm font-bold leading-5 text-white/80 hover:text-primary">
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => removeItem(item.productId)}
                            className="shrink-0 text-white/20 transition hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-xs font-bold text-primary">{inr.format(item.price * item.quantity)}</p>
                      </div>

                      <div className="mt-3 flex w-fit items-center overflow-hidden rounded-lg border border-white/8 bg-white/[0.025]">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          className="flex h-8 w-8 items-center justify-center text-white/40 transition hover:text-white"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-black text-white">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          disabled={item.quantity >= 10}
                          className="flex h-8 w-8 items-center justify-center text-white/40 transition hover:text-white disabled:opacity-20"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-white/8 p-7">
                <div className="mb-6 flex items-end justify-between gap-5">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/30">Catalog subtotal</p>
                    <p className="mt-1 text-xs text-white/25">Server rechecked at checkout</p>
                  </div>
                  <span className="font-outfit text-3xl font-black text-primary">{inr.format(total)}</span>
                </div>

                <Link href="/checkout" onClick={toggleCart} className="block w-full">
                  <ForgeButton className="w-full py-5 text-base">
                    Continue to Checkout <ArrowRight className="ml-3 inline-block h-4 w-4" />
                  </ForgeButton>
                </Link>
                <Link href="/cart" onClick={toggleCart} className="mt-4 block text-center text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white">
                  Review full cart
                </Link>
                <p className="mt-5 text-center text-[10px] leading-5 text-white/25">
                  Cashfree payment · private digital delivery after payment verification
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
