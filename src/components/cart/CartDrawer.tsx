"use client";

import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { GlassCard } from "@/components/ui/GlassCard";

export function CartDrawer() {
  const { items, addItem, removeItem, updateQuantity, isOpen, toggleCart, getCartTotal } = useCartStore();
  const total = getCartTotal();
  const [isClient, setIsClient] = useState(false);

  const drawerVariants: Variants = {
    closed: { x: "100%", opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 40
      } 
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xl"
          />
          
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0f] border-l border-white/5 z-100 shadow-[-40px_0_80px_rgba(0,0,0,0.9)] flex flex-col"
          >
            {/* Decorative Tech Noise Backdrop */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/5 bg-white/1">
              <div className="flex flex-col">
                <h2 className="text-2xl font-outfit font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                  Swarm <span className="text-primary italic">Container</span>
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">{items.reduce((a, b) => a + b.quantity, 0)} Assets Secured</span>
                </div>
              </div>
              <button onClick={toggleCart} className="p-3 border border-white/5 bg-white/5 text-white/40 hover:text-white hover:border-primary/40 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="relative z-10 flex-1 overflow-y-auto p-8 space-y-6 bg-transparent custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
                  <div className="w-24 h-24 rounded-full border border-white/5 flex items-center justify-center relative">
                    <ShoppingBag className="w-10 h-10 text-white/10" />
                    <div className="absolute inset-0 border border-primary/20 rounded-full animate-ping" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-outfit font-black text-white/60 uppercase tracking-tight italic">Registry Empty</h3>
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest max-w-[200px] leading-relaxed">No protocols initialized. Acquire assets to scale production.</p>
                  </div>
                  <ForgeButton onClick={toggleCart} className="w-full max-w-[200px]">
                     View Arsenal
                  </ForgeButton>
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.productId} 
                    className="group relative flex gap-6"
                  >
                    <div className="h-24 w-24 overflow-hidden bg-black shrink-0 relative border border-white/10 group-hover:border-primary/40 transition-colors">
                      <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover opacity-60 group-hover:opacity-100 transition-all group-hover:scale-110" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-outfit font-bold text-white uppercase tracking-tight text-sm group-hover:text-primary transition-colors leading-tight truncate">
                            {item.name}
                          </h3>
                          <button 
                            className="text-white/10 hover:text-accent transition-colors shrink-0"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs font-mono text-primary font-black italic">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                          <button 
                            className="h-8 w-8 hover:bg-white/5 text-white/40 hover:text-primary flex items-center justify-center transition-all bg-transparent"
                            onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-mono font-black text-white">{item.quantity}</span>
                          <button 
                            className="h-8 w-8 hover:bg-white/5 text-white/40 hover:text-primary flex items-center justify-center transition-all bg-transparent"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Sub-AOV Maximization Component */}
            {items.length > 0 && !items.some(i => i.productId === "master-react-boilerplate") && (
              <div className="relative z-10 px-8 py-6 mb-2">
                <GlassCard className="p-4 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all group overflow-hidden">
                  <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 -mr-6 -mt-6 rotate-45 group-hover:scale-150 transition-transform" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 bg-black border border-primary/40 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-mono font-black text-white uppercase tracking-tight leading-none mb-1">Scale Production</h4>
                      <p className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Master React v.2 // -50% Off</p>
                    </div>
                    <button 
                      onClick={() => {
                          import("@/lib/data").then(module => {
                              const upsell = module.products.find(p => p.id === "master-react-boilerplate");
                              if (upsell) addItem(upsell);
                          });
                      }}
                      className="text-[10px] font-mono font-black text-primary border-b border-primary/30 hover:border-primary transition-all pb-0.5"
                    >
                      + INSTALL
                    </button>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="relative z-10 p-8 pt-0 border-t border-white/5 bg-transparent">
                <div className="py-6 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/20">Aggregate Total</span>
                    <span className="text-sm font-mono text-white/40">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-outfit font-black text-white uppercase italic tracking-tight">Final Settlement</span>
                    <span className="text-3xl font-outfit font-black text-primary drop-shadow-[0_0_15px_rgba(255,107,53,0.3)] italic">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <Link href="/checkout" onClick={toggleCart} className="w-full block">
                  <ForgeButton className="w-full py-5 text-lg shadow-[0_10px_40px_rgba(255,107,53,0.2)]">
                    Link Protocols <ArrowRight className="w-5 h-5 ml-4 inline-block"/>
                  </ForgeButton>
                </Link>

                <div className="mt-8 flex items-center justify-center gap-4 text-white/10">
                   <div className="h-px flex-1 bg-white/5" />
                   <ShieldCheck className="w-4 h-4" />
                   <div className="h-px flex-1 bg-white/5" />
                </div>
                <p className="text-center text-[9px] font-mono uppercase tracking-[0.4em] text-white/10 mt-6">
                  Forge-Level Encryption Active // v3.12
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
