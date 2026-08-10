"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CreditCard, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    syncWithCatalog,
    getCartTotal,
    getCartCount,
  } = useCartStore();
  const [catalogChecked, setCatalogChecked] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/products", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Catalog HTTP ${response.status}`);
        return response.json() as Promise<Product[]>;
      })
      .then((catalog) => {
        if (active && Array.isArray(catalog)) syncWithCatalog(catalog);
      })
      .catch((error) => console.error("[cart] Catalog refresh failed", error))
      .finally(() => {
        if (active) setCatalogChecked(true);
      });
    return () => {
      active = false;
    };
  }, [syncWithCatalog]);

  const total = getCartTotal();
  const count = getCartCount();

  if (!catalogChecked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono uppercase tracking-[.2em] text-white/35">
        Checking current catalog…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-white/20" />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Your cart is empty</h1>
        <p className="text-white/45 mb-8 max-w-md">
          Add a currently available Digital Swarm product to continue. Products removed from the approved catalog are automatically removed from saved carts.
        </p>
        <Link href="/products">
          <Button className="px-8 py-6 text-lg font-black uppercase tracking-widest">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070b] pt-32 pb-24 text-white">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 font-mono text-[10px] font-black uppercase tracking-[.28em] text-primary">Current catalog cart</p>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">Your Cart</h1>
          </div>
          <p className="text-sm text-white/35">{count} item{count === 1 ? "" : "s"} · prices shown in INR</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <section className="lg:col-span-8 space-y-5">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.article
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  className="group flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/[0.025] border border-white/10 rounded-3xl hover:border-primary/25 transition-all"
                >
                  <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-white/5 border border-white/8">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
                  </div>

                  <div className="flex-1 min-w-0 w-full">
                    <Link href={`/product/${item.productId}`} className="text-xl font-black uppercase italic tracking-tight text-white hover:text-primary transition-colors block mb-1">
                      {item.name}
                    </Link>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{item.category}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-5">
                      <div className="flex items-center rounded-xl border border-white/8 bg-white/[0.025]">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2.5 text-white/45 hover:text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-9 text-center font-black">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="p-2.5 text-white/45 hover:text-white disabled:opacity-20 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-red-300/55 hover:text-red-300 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black tracking-tighter text-white">
                      {inr.format(item.price * item.quantity)}
                    </div>
                    <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">
                      {inr.format(item.price)} each
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </section>

          <aside className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="p-8 bg-[#0d0d12] border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden">
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-7">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-white/50 text-sm">
                  <span>Catalog subtotal</span>
                  <span>{inr.format(total)}</span>
                </div>
                <div className="flex justify-between items-center text-white/50 text-sm">
                  <span>Shipping</span>
                  <span>Not applicable</span>
                </div>
                <div className="pt-5 border-t border-white/10 flex justify-between items-end gap-4">
                  <span className="text-sm font-black uppercase text-white/50">Amount shown</span>
                  <span className="text-4xl font-black tracking-tighter text-primary">{inr.format(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full py-7 text-lg font-black uppercase tracking-widest group">
                  Continue to Checkout <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/products" className="mt-5 block text-center text-[10px] font-black uppercase text-white/35 hover:text-white transition-colors tracking-widest">
                Continue Shopping
              </Link>

              <div className="mt-8 pt-7 border-t border-white/8 flex items-start gap-3 text-white/35">
                <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-[11px] leading-5">
                  Checkout uses Cashfree. The server revalidates product availability, quantity and INR price before creating the payment session.
                </p>
              </div>
            </div>

            <div className="mt-5 p-5 border border-white/10 rounded-2xl bg-white/[0.025]">
              <p className="text-xs font-bold text-white/70">Private digital delivery</p>
              <p className="mt-1 text-[11px] leading-5 text-white/35">Paid products are delivered with expiring private links after payment verification. No shipping address is collected.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
