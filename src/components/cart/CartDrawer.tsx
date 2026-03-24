"use client";

import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function CartDrawer() {
  const { items, addItem, removeItem, updateQuantity, isOpen, toggleCart, total } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  const drawerVariants: Variants = {
    closed: { x: "100%", opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30
      } 
    }
  };

  useEffect(() => {
    setTimeout(() => setIsClient(true), 0);
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
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-md"
          />
          
          {/* Soft UI Drawer -> Cyber Dark UI Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0c10] border-l border-white/10 z-[100] shadow-[-20px_0_40px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0a0c10]">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white uppercase italic tracking-tighter">
                Swarm Container
                <span className="bg-primary/20 text-primary border border-primary/30 text-sm font-black px-2.5 py-0.5 rounded-full">{items.reduce((a, b) => a + b.quantity, 0)}</span>
              </h2>
              <button onClick={toggleCart} className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4 bg-transparent custom-scrollbar">
              
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-2 shadow-[inset_0_0_20px_rgba(255,107,53,0.02)]">
                    <ShoppingBag className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-300 uppercase tracking-tighter italic">Swarm Cache Empty</h3>
                  <p className="text-sm font-medium text-gray-500 mb-4 max-w-[200px]">No templates initialized. Acquire assets to scale your production.</p>
                  <button className="px-8 py-3 rounded-full bg-primary text-white font-black uppercase italic tracking-widest shadow-[0_0_15px_rgba(255,107,53,0.2)] hover:shadow-[0_0_25px_rgba(255,107,53,0.4)] hover:-translate-y-0.5 transition-all" onClick={toggleCart}>
                    View Arsenal
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl shadow-sm hover:border-primary/30 hover:shadow-[0_0_20px_rgba(255,107,53,0.1)] transition-all backdrop-blur-md"
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-[#0a0c10] shrink-0 relative border border-white/10">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex flex-col items-start gap-1 w-full">
                        <h3 className="font-bold text-white leading-tight w-full flex justify-between gap-2 overflow-hidden">
                           <span className="truncate group-hover:text-primary transition-colors uppercase tracking-tight">{item.name}</span>
                           <span className="text-primary font-black shrink-0 italic">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </h3>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-full px-1 py-1">
                          <button 
                            className="h-6 w-6 rounded-full hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-gray-300">{item.quantity}</span>
                          <button 
                            className="h-6 w-6 rounded-full hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button 
                          className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 h-8 w-8 rounded-full transition-all flex items-center justify-center"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 1-Click Upsell Modal (AOV Maximization) */}
            {items.length > 0 && !items.some(i => i.id === "master-react-boilerplate") && (
              <div className="relative z-10 p-4 border-t border-primary/20 bg-primary/5 shadow-[inset_0_5px_15px_rgba(255,107,53,0.05)]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0a0c10] border border-primary/30 rounded-lg flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,107,53,0.2)]">
                    <span className="text-xl animate-pulse">⚡</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-white leading-none mb-1 uppercase tracking-tight">Add Master React Boilerplate</h4>
                    <p className="text-xs text-gray-400">Save 50% on this protocol bypass.</p>
                  </div>
                  <button 
                    onClick={() => {
                        import("@/lib/data").then(module => {
                            const upsell = module.products.find(p => p.id === "master-react-boilerplate");
                            if (upsell) {
                                addItem(upsell);
                            }
                        });
                    }}
                    className="shrink-0 bg-transparent border border-primary/50 text-primary text-xs font-black px-3 py-1.5 rounded-full hover:bg-primary/20 hover:text-white transition-all shadow-[0_0_10px_rgba(255,107,53,0.1)] hover:shadow-[0_0_20px_rgba(255,107,53,0.3)] italic tracking-widest"
                  >
                    + ₹2,999
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            {items.length > 0 && (
              <div className="relative z-10 p-6 border-t border-white/10 bg-[#0a0c10] shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between mb-6 flex-col gap-1">
                  <div className="flex justify-between text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                     <span>Deployment Total</span>
                     <span className="font-black">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-white font-black text-3xl mt-2 uppercase italic tracking-tighter">
                     <span>Total</span>
                     <span className="text-primary drop-shadow-[0_0_15px_rgba(255,107,53,0.5)]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="w-full block">
                  <button className="w-full py-4 text-lg font-black rounded-2xl bg-gradient-to-r from-primary to-[#FF8C61] text-white shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_30px_rgba(255,107,53,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 uppercase italic tracking-widest">
                    Initialize Checkout <ArrowRight className="w-5 h-5"/>
                  </button>
                </Link>
                <p className="text-center text-[10px] text-gray-500 font-black uppercase mt-4 tracking-tighter">End-to-End Encryption active // Swarm v3.0</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
