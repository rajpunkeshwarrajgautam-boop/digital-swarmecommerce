"use client";

import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, Trash2, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpen, toggleCart, total, addItem } = useCartStore();
  const [isClient, setIsClient] = useState(false);

  // Featured Order Bump Product
  const orderBumpProduct = products.find(p => p.id === "web-bundle-ultimate");
  const hasOrderBump = items.some(item => item.id === "web-bundle-ultimate");

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
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-black/10 z-50 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
          >
            {/* Clean Drawer Container - Removed CPU-intensive SVG noise filter to prevent frame drop lag */}
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-black/10 bg-black/5">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2 bg-linear-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent drop-shadow-sm">
                CART <span className="text-gray-500 text-sm font-mono tracking-normal">({items.reduce((a, b) => a + b.quantity, 0)})</span>
              </h2>
              <Button variant="ghost" size="icon" onClick={toggleCart} className="hover:bg-black/10 text-black">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-black/10 shadow-inner">
                     <span className="text-2xl font-black bg-linear-to-br from-purple-500 to-pink-500 bg-clip-text text-transparent">PKG</span>
                  </div>
                  <p className="font-mono text-sm uppercase tracking-widest font-bold bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">No Payload Detected</p>
                  <Button variant="outline" className="mt-4 border-black/20 text-black hover:bg-black hover:text-white rounded-xl shadow-sm" onClick={toggleCart}>
                    Initialize Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div 
                    layout
                    variants={itemVariants}
                    key={item.id} 
                    className="group relative flex gap-4 p-4 border border-black/10 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-purple-300 transition-colors duration-300 shadow-sm"
                  >
                    <div className="h-24 w-24 rounded-lg overflow-hidden bg-white shrink-0 relative border border-black/10 group-hover:border-purple-300 transition-colors">
                      <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold line-clamp-2 bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-pink-500 group-hover:to-orange-500 transition-all">{item.name}</h3>
                        <p className="font-bold bg-linear-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1 bg-white rounded-full p-1 border border-black/10 shadow-sm">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 hover:bg-gray-100 rounded-full text-black"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-xs font-mono text-black font-bold">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 hover:bg-gray-100 rounded-full text-black"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 rounded-full"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
              
              {/* ORDER BUMP */}
              {items.length > 0 && !hasOrderBump && orderBumpProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-4 rounded-xl border border-dashed border-pink-400 bg-pink-50 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] uppercase font-black px-2 py-1 tracking-wider rounded-bl-lg">
                    One-Time Offer
                  </div>
                  <div className="flex gap-4 relative z-10 pt-2">
                    <div className="h-16 w-16 rounded-lg overflow-hidden shrink-0 border border-pink-200">
                      <Image src={orderBumpProduct.image} alt="Bundle" width={64} height={64} className="object-cover h-full w-full" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-sm text-pink-900 leading-tight">Add {orderBumpProduct.name}</h4>
                      <p className="text-xs text-pink-700 mt-1 mb-2 font-medium">Normally ₹1,500. Get it for just ₹200 today!</p>
                      <Button 
                        size="sm" 
                        onClick={() => addItem(orderBumpProduct)}
                        className="h-8 w-full bg-pink-100 hover:bg-pink-600 text-pink-800 hover:text-white transition-colors border shadow-none border-pink-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Add to Order +₹200
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="relative z-10 p-6 border-t border-black/10 bg-gray-50">
                <div className="flex justify-between mb-6">
                  <span className="text-gray-500 uppercase tracking-wider text-xs font-bold">Total Payload</span>
                  <span className="text-2xl font-black bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent font-mono drop-shadow-sm">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="w-full">
                  <Button className="w-full h-14 text-sm font-bold tracking-widest uppercase bg-linear-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-xl transition-all rounded-xl border-none">
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
