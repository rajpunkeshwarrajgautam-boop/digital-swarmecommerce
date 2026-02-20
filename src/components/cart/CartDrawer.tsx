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

  // Holographic Variants
  const drawerVariants: Variants = {
    closed: { x: "100%", opacity: 0 },
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };

  const itemVariants: Variants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1 }
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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950/90 backdrop-blur-2xl border-l border-white/10 z-50 shadow-[0_0_50px_-10px_rgba(66,133,244,0.3)] flex flex-col"
          >
            {/* Holographic Noise Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
            
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                CART_TERMINAL <span className="text-muted-foreground text-sm font-mono">({items.reduce((a, b) => a + b.quantity, 0)})</span>
              </h2>
              <Button variant="ghost" size="icon" onClick={toggleCart} className="hover:bg-white/10 text-white">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                     <span className="text-2xl">PKG</span>
                  </div>
                  <p className="font-mono text-sm uppercase tracking-widest">No Payload Detected</p>
                  <Button variant="outline" className="mt-4 border-primary/50 text-primary hover:bg-primary hover:text-black" onClick={toggleCart}>
                    Initialize Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    variants={itemVariants}
                    key={item.id} 
                    className="group relative flex gap-4 p-4 border border-white/10 rounded-xl bg-black/40 hover:bg-white/5 hover:border-primary/30 transition-colors duration-300"
                  >
                    <div className="h-24 w-24 rounded-lg overflow-hidden bg-secondary shrink-0 relative border border-white/10 group-hover:border-primary/50 transition-colors">
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium line-clamp-2 text-white/90 group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="font-bold text-primary">$ {(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 hover:bg-white/10 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-xs font-mono">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 hover:bg-white/10 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 h-8 w-8"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="relative z-10 p-6 border-t border-white/10 bg-black/40 backdrop-blur-md">
                <div className="flex justify-between mb-6">
                  <span className="text-muted-foreground uppercase tracking-wider text-xs font-bold">Total Payload</span>
                  <span className="text-2xl font-bold text-primary font-mono">$ {total.toFixed(2)}</span>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="w-full">
                  <Button className="w-full h-14 text-lg font-bold tracking-widest uppercase bg-primary hover:bg-blue-400 text-white shadow-[0_0_20px_-5px_rgba(66,133,244,0.6)] hover:shadow-[0_0_30px_-5px_rgba(66,133,244,0.8)] transition-all">
                    Initiate Checkout
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
