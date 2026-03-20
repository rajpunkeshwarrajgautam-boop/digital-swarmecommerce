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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0a] border-l-4 border-[#ffc737] z-[100] shadow-[-20px_0_60px_rgba(0,0,0,0.8)] flex flex-col"
          >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-8 border-b-4 border-[#ffc737] bg-black">
              <h2 className="text-4xl font-black italic tracking-tighter flex items-center gap-2 text-[#ffc737] leading-none">
                PAYLOAD <span className="bg-[#ffc737] text-black text-lg font-black italic tracking-normal px-3 py-1 border-2 border-white shadow-[2px_2px_0_#000]">{items.reduce((a, b) => a + b.quantity, 0)}</span>
              </h2>
              <button onClick={toggleCart} className="p-2 border-2 border-[#ffc737] bg-black text-[#ffc737] hover:bg-[#ffc737] hover:text-black transition-colors shadow-[4px_4px_0_#000]">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="relative z-10 flex-1 overflow-y-auto p-8 space-y-6 bg-[#0a0a0a] custom-scrollbar">
              
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-6">
                  <div className="p-8 border-4 border-[#ffc737] bg-[#111] shadow-[8px_8px_0_#000] rotate-[-2deg]">
                     <span className="text-4xl font-black italic tracking-tighter text-[#ffc737] uppercase">Null</span>
                  </div>
                  <p className="font-black text-sm uppercase tracking-[0.2em] text-[#ffc737]/60">Manifest_Empty</p>
                  <button className="mt-4 px-6 py-4 border-4 border-[#ffc737] bg-black text-[#ffc737] hover:bg-[#ffc737] hover:text-black uppercase font-black italic tracking-widest shadow-[6px_6px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all" onClick={toggleCart}>
                    Sync Catalog -&gt;
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative flex gap-6 p-4 border-4 border-[#ffc737] bg-[#111] shadow-[6px_6px_0_#000] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#ffc737]"
                  >
                    <div className="h-24 w-24 overflow-hidden border-2 border-[#ffc737] shrink-0 relative transition-colors">
                      <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="flex flex-col items-start gap-1">
                        <h3 className="font-black italic uppercase tracking-tighter text-[#ffc737] leading-tight transition-colors">{item.name}</h3>
                        <p className="font-black italic text-black bg-[#ffc737] px-2 border-2 border-white inline-block mt-1">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-1 bg-black border-2 border-[#ffc737]">
                          <button 
                            className="h-8 w-8 hover:bg-[#ffc737] hover:text-black text-[#ffc737] font-black flex items-center justify-center transition-colors border-r-2 border-[#ffc737]"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-black italic text-[#ffc737]">{item.quantity}</span>
                          <button 
                            className="h-8 w-8 hover:bg-[#ffc737] hover:text-black text-[#ffc737] font-black flex items-center justify-center transition-colors border-l-2 border-[#ffc737]"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          className="text-[#ffc737] hover:text-white hover:bg-red-500 border-2 border-[#ffc737] h-8 w-8 transition-colors flex items-center justify-center"
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

            {/* Footer */}
            {items.length > 0 && (
              <div className="relative z-10 p-8 border-t-4 border-[#ffc737] bg-black">
                <div className="flex justify-between mb-8 items-end p-4 border-4 border-[#ffc737] border-dashed bg-[#ffc737]/5">
                  <span className="text-[#ffc737] uppercase tracking-[0.2em] text-xs font-black italic opacity-50">Total Allocation</span>
                  <span className="text-4xl font-black italic text-[#ffc737] leading-none drop-shadow-[2px_2px_0px_#000]">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="w-full block">
                  <button className="w-full py-6 text-2xl font-black italic uppercase tracking-tighter border-4 border-black bg-[#ffc737] text-black shadow-[8px_8px_0_rgba(255,199,55,0.3)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_#ffc737] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
                    Establish Checkout -&gt;
                  </button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
