"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Check, Plus, ShoppingBag, Zap, Rocket, Crown } from "lucide-react";
import Image from "next/image";
import { useSwarmSWR } from "@/hooks/useSwarmSWR";

export default function BundleBuilderPage() {
  const { data: productsData, isLoading: loading } = useSwarmSWR<Product[]>("/api/products");
  const { data: featuredData } = useSwarmSWR<Product[]>("/api/products/featured");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const products = productsData || [];
  const featuredProducts = featuredData || [];
  const { addBundle } = useCartStore();
  const [stackDeployed, setStackDeployed] = useState(false);

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const bundlePrice = Math.round(totalPrice * 0.8); // 20% off
  const savings = totalPrice - bundlePrice;

  // Full Swarm Stack pricing (25% off featured products)
  const stackTotalPrice = featuredProducts.reduce((sum, p) => sum + p.price, 0);
  const stackBundlePrice = Math.round(stackTotalPrice * 0.75);
  const stackSavings = stackTotalPrice - stackBundlePrice;

  const handleAddBundle = () => {
    if (selectedProducts.length === 3) {
      addBundle(selectedProducts, 20);
      setSelectedIds([]);
    }
  };

  const handleDeployFullStack = () => {
    if (featuredProducts.length >= 2) {
      addBundle(featuredProducts, 25);
      setStackDeployed(true);
      setTimeout(() => setStackDeployed(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-zinc-800 border-t-primary animate-spin mx-auto rounded-full" />
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest animate-pulse">
            Infiltrating Catalog...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-32 pt-12">
      <div className="container mx-auto px-4">

        {/* ─── FULL SWARM STACK HERO ─── */}
        {featuredProducts.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="mb-24 relative overflow-hidden rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-zinc-900 to-black p-8 md:p-12"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/40 rounded-full mb-8">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary italic">
                RECOMMENDED BUNDLE
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <div>
                <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6">
                  THE FULL<br />
                  <span className="text-primary">SWARM</span><br />
                  STACK
                </h2>
                <p className="text-zinc-400 text-lg mb-8 leading-relaxed max-w-md">
                  The complete arsenal. Every flagship asset bundled together at our deepest discount —
                  built for founders who don&apos;t cut corners.
                </p>

                {/* Pricing */}
                <div className="flex flex-wrap items-end gap-6 mb-10">
                  <div>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">Bundle Price</p>
                    <span className="text-5xl font-black italic text-primary">
                      ₹{stackBundlePrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="pb-2">
                    <span className="text-2xl text-zinc-600 line-through font-bold italic">
                      ₹{stackTotalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="pb-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-2xl">
                    <span className="text-sm font-black text-green-400 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      SAVE ₹{stackSavings.toLocaleString("en-IN")} (25% OFF)
                    </span>
                  </div>
                </div>

                <motion.button
                  id="deploy-full-stack-btn"
                  onClick={handleDeployFullStack}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-8 py-5 bg-primary text-black font-black uppercase italic tracking-widest text-lg rounded-2xl shadow-[0_20px_50px_rgba(255,107,53,0.3)] hover:shadow-[0_25px_60px_rgba(255,107,53,0.4)] transition-all"
                >
                  {stackDeployed ? (
                    <>
                      <Check className="w-5 h-5" /> ADDED TO CART
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" /> DEPLOY FULL STACK
                    </>
                  )}
                </motion.button>
              </div>

              {/* Right: Product stack preview */}
              <div className="relative">
                <div className="flex flex-col gap-4">
                  {featuredProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx, ease: [0.4, 0, 0.2, 1] }}
                      className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-primary/30 transition-colors"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 border border-white/10">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black uppercase italic text-sm tracking-tight truncate text-white">
                          {product.name}
                        </p>
                        <p className="text-xs font-mono text-zinc-500 uppercase">{product.category}</p>
                      </div>
                      <div className="shrink-0">
                        <span className="text-sm font-black italic text-primary">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {/* Stack value indicator */}
                <div className="mt-4 text-right">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
                    {featuredProducts.length} assets · normally ₹{stackTotalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── CUSTOM BUNDLE BUILDER ─── */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full mb-4">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">OR BUILD YOUR OWN</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black tracking-tight leading-none"
          >
            BUILD YOUR <span className="text-primary">SWARM</span>
          </motion.h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Select any <span className="text-white font-bold">3 assets</span> to unlock a{" "}
            <span className="text-primary font-bold">20% Direct Discount</span>.{" "}
            The ultimate strategy for rapid digital construction.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product.id);
            const isDisabled = !isSelected && selectedIds.length >= 3;

            return (
              <motion.div
                key={product.id}
                layout
                className={`relative group rounded-3xl overflow-hidden border-2 transition-all duration-300 h-full flex flex-col ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-4 ring-primary/20 scale-[1.02]"
                    : "border-white/10 bg-zinc-900/50 hover:border-white/20"
                } ${isDisabled ? "opacity-40 grayscale" : "opacity-100"}`}
                onClick={() => !isDisabled && toggleProduct(product.id)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={`object-cover transition-transform duration-500 ${isSelected ? "scale-110" : "group-hover:scale-110"}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {isSelected && (
                    <div className="absolute top-4 right-4 bg-primary text-black p-2 rounded-full shadow-xl">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary tracking-widest uppercase">{product.category}</span>
                    <span className="text-lg font-bold">₹{product.price}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-1">{product.name}</h3>

                  <div className="mt-auto">
                    <Button
                      variant={isSelected ? "default" : "outline"}
                      className="w-full rounded-2xl py-6 font-bold uppercase tracking-widest text-xs"
                      disabled={isDisabled}
                    >
                      {isSelected ? "Selected ✓" : "Add to Bundle"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating Bundle HUD */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-[450px] z-50"
          >
            <div className="bg-zinc-900 border-4 border-black p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-black text-xl uppercase italic">YOUR BUNDLE</h4>
                <div className="flex -space-x-3">
                  {selectedProducts.map((p) => (
                    <div key={p.id} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden relative bg-zinc-800">
                      <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                    </div>
                  ))}
                  {[...Array(3 - selectedIds.length)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-black/40">
                      <Plus className="w-4 h-4 text-white/20" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Subtotal</span>
                  <span className="line-through">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Bundle Price</span>
                  <span className="text-primary italic">₹{bundlePrice}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-green-500 bg-green-500/10 p-2 rounded-lg">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> TOTAL SAVINGS</span>
                  <span>₹{savings}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setSelectedIds([])}
                  variant="outline"
                  className="flex-1 opacity-50 hover:opacity-100"
                >
                  Clear
                </Button>
                <Button
                  id="deploy-custom-bundle-btn"
                  onClick={handleAddBundle}
                  disabled={selectedIds.length < 3}
                  className="flex-2 bg-primary text-black font-bold h-14 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {selectedIds.length === 3 ? (
                    <span className="flex items-center gap-2 italic">DEPLOY BUNDLE <ShoppingBag className="w-5 h-5" /></span>
                  ) : (
                    `SELECT ${3 - selectedIds.length} MORE`
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
