"use client";

import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpen, toggleCart, total } = useCartStore();
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
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#020202] border-l border-white/5 z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col"
          >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/5 bg-black">
              <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2 text-white">
                PAYLOAD <span className="text-primary text-sm font-black italic tracking-normal">(0{items.reduce((a, b) => a + b.quantity, 0)})</span>
              </h2>
              <Button variant="ghost" size="icon" onClick={toggleCart} className="hover:bg-white/5 text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="relative z-10 flex-1 overflow-y-auto p-8 space-y-6">
              <div className="absolute inset-0 z-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
              
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/20 gap-6">
                  <div className="w-20 h-20 border border-white/5 flex items-center justify-center">
                     <span className="text-xl font-black italic tracking-tighter text-white/10 uppercase">Null</span>
                  </div>
                  <p className="font-black text-[10px] uppercase tracking-[0.5em] text-white/30">Manifest_Empty</p>
                  <Button variant="outline" className="mt-4 border-white/10 text-white/50 hover:text-white hover:border-white rounded-none uppercase tracking-widest text-[10px] font-black italic" onClick={toggleCart}>
                    Sync_Catalog
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative flex gap-6 p-4 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <div className="h-24 w-24 overflow-hidden bg-black shrink-0 relative border border-white/5 group-hover:border-primary transition-colors">
                      <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-black italic uppercase tracking-tighter text-sm leading-tight text-white group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="font-black italic text-primary text-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-1 bg-black border border-white/10 p-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 hover:bg-white/10 text-white/50 hover:text-white"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-10 text-center text-xs font-black italic text-white">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 hover:bg-white/10 text-white/50 hover:text-white"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-white/20 hover:text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-none transition-all"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="relative z-10 p-8 border-t border-white/5 bg-black">
                <div className="flex justify-between mb-8 items-end">
                  <span className="text-white/30 uppercase tracking-[0.3em] text-[10px] font-black italic">Total_Allocation</span>
                  <span className="text-3xl font-black italic text-primary leading-none">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="w-full">
                  <Button className="w-full h-16 text-xs font-black tracking-[0.4em] uppercase bg-primary hover:bg-white text-black transition-all rounded-none border-none italic">
                    Establish Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
