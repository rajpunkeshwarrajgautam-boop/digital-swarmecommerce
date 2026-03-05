"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Check, Plus, ShoppingBag, Zap } from "lucide-react";
import Image from "next/image";

export default function BundleBuilderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addBundle } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

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

  const handleAddBundle = () => {
    if (selectedProducts.length === 3) {
      addBundle(selectedProducts, 20);
      setSelectedIds([]);
    }
  };

  if (loading) return <div className="p-20 text-center">Infiltrating Catalog...</div>;

  return (
    <div className="min-h-screen bg-black pb-32 pt-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-titan tracking-tight leading-none"
          >
            BUILD YOUR <span className="text-primary">SWARM</span>
          </motion.h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Select any <span className="text-white font-bold">3 assets</span> to unlock a <span className="text-primary font-bold">20% Direct Discount</span>. 
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
                      {isSelected ? "Selected" : "Add to Bundle"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Floating HUD */}
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
                <h4 className="font-titan text-xl">YOUR BUNDLE</h4>
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
