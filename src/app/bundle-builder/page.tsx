"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Check, Plus, ShoppingBag, PackagePlus, Layers3 } from "lucide-react";
import Image from "next/image";
import { useSwarmSWR } from "@/hooks/useSwarmSWR";

export default function BundleBuilderPage() {
  const { data: productsData, isLoading: loading } = useSwarmSWR<Product[]>("/api/products");
  const { data: featuredData } = useSwarmSWR<Product[]>("/api/products/featured");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const products = productsData || [];
  const featuredProducts = featuredData || [];
  const { addBundle } = useCartStore();
  const [stackAdded, setStackAdded] = useState(false);

  const toggleProduct = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((entry) => entry !== id) : current.length < 3 ? [...current, id] : current);
  };

  const selectedProducts = products.filter((product) => selectedIds.includes(product.id));
  const totalPrice = selectedProducts.reduce((sum, product) => sum + product.price, 0);
  const stackTotalPrice = featuredProducts.reduce((sum, product) => sum + product.price, 0);

  const handleAddBundle = () => {
    if (selectedProducts.length === 3) {
      addBundle(selectedProducts, 0);
      setSelectedIds([]);
    }
  };

  const handleAddFeatured = () => {
    if (featuredProducts.length >= 2) {
      addBundle(featuredProducts, 0);
      setStackAdded(true);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-14 h-14 border-4 border-zinc-800 border-t-primary animate-spin rounded-full" /></div>;
  }

  return (
    <main className="min-h-screen bg-black pb-32 pt-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.35em] text-primary font-black mb-4">Multi-product cart builder</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">Build a product stack</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Combine several verified Digital Swarm products into one cart. Prices shown here are the same authoritative catalog prices the checkout server recalculates before creating a Cashfree order.
          </p>
        </div>

        {featuredProducts.length >= 2 && (
          <section className="mb-20 rounded-3xl border border-primary/25 bg-primary/[0.05] p-8 md:p-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase mb-5"><Layers3 className="w-4 h-4" /> Featured stack</div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-5">Add the featured products together</h2>
                <p className="text-zinc-400 mb-7">This is a convenience bundle, not a hidden discount. Checkout validates every SKU and recalculates the total from the approved catalog.</p>
                <div className="text-4xl font-black text-primary mb-7">₹{stackTotalPrice.toLocaleString("en-IN")}</div>
                <Button id="add-featured-stack-btn" onClick={handleAddFeatured} disabled={stackAdded} className="h-14 px-8 rounded-full font-black">
                  {stackAdded ? <><Check className="w-4 h-4 mr-2" /> Added to cart</> : <><PackagePlus className="w-4 h-4 mr-2" /> Add featured stack</>}
                </Button>
              </div>
              <div className="space-y-3">
                {featuredProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0"><Image src={product.image} alt={product.name} fill className="object-cover" sizes="56px" /></div>
                    <div className="min-w-0 flex-1"><p className="font-bold text-white truncate">{product.name}</p><p className="text-xs text-zinc-500">{product.category}</p></div>
                    <span className="font-black text-primary">₹{product.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <div className="text-center mb-10"><h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Choose any three</h2><p className="text-zinc-400">Select three products to add them to the cart together. No price reduction is implied.</p></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const isSelected = selectedIds.includes(product.id);
              const isDisabled = !isSelected && selectedIds.length >= 3;
              return (
                <motion.button key={product.id} type="button" layout onClick={() => !isDisabled && toggleProduct(product.id)} disabled={isDisabled} className={`text-left relative group rounded-3xl overflow-hidden border transition-all h-full flex flex-col ${isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/15" : "border-white/10 bg-zinc-900/50 hover:border-white/20"} ${isDisabled ? "opacity-35" : "opacity-100"}`}>
                  <div className="aspect-square relative overflow-hidden"><Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw" />{isSelected && <div className="absolute top-4 right-4 bg-primary text-black p-2 rounded-full"><Check className="w-5 h-5" /></div>}</div>
                  <div className="p-6 flex flex-col flex-1"><div className="flex justify-between gap-3 items-start mb-2"><span className="text-xs font-bold text-primary uppercase">{product.category}</span><span className="text-lg font-bold text-white">₹{product.price.toLocaleString("en-IN")}</span></div><h3 className="text-xl font-bold text-white line-clamp-2">{product.name}</h3><div className="mt-auto pt-5 text-xs font-black uppercase tracking-widest text-white/45">{isSelected ? "Selected" : "Select"}</div></div>
                </motion.button>
              );
            })}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-[440px] z-50">
            <div className="bg-zinc-950 border border-white/15 p-6 rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between mb-5"><h4 className="font-black text-white">Selected products</h4><span className="text-sm text-white/50">{selectedIds.length}/3</span></div>
              <div className="flex justify-between items-end mb-5"><div><div className="text-[9px] uppercase tracking-widest text-zinc-600">Catalog total</div><div className="text-3xl font-black text-primary">₹{totalPrice.toLocaleString("en-IN")}</div></div><div className="flex -space-x-2">{selectedProducts.map((product) => <div key={product.id} className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-zinc-950"><Image src={product.image} alt="" fill className="object-cover" sizes="36px" /></div>)}</div></div>
              <div className="flex gap-3"><Button onClick={() => setSelectedIds([])} variant="outline" className="flex-1">Clear</Button><Button id="add-custom-stack-btn" onClick={handleAddBundle} disabled={selectedIds.length !== 3} className="flex-[2] bg-primary text-black font-black">{selectedIds.length === 3 ? <span className="flex items-center gap-2">Add all three <ShoppingBag className="w-4 h-4" /></span> : <span className="flex items-center gap-2">Select {3 - selectedIds.length} more <Plus className="w-4 h-4" /></span>}</Button></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
