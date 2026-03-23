"use client";

import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
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
            className="fixed inset-0 bg-gray-900/20 z-50 backdrop-blur-sm"
          />
          
          {/* Soft UI Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[100] shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col"
          >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-100 bg-white">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                Your Cart
                <span className="bg-pink-100 text-pink-600 text-sm font-bold px-2.5 py-0.5 rounded-full">{items.reduce((a, b) => a + b.quantity, 0)}</span>
              </h2>
              <button onClick={toggleCart} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 custom-scrollbar">
              
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Your cart is empty</h3>
                  <p className="text-sm font-medium text-gray-500 mb-4 max-w-[200px]">Looks like you haven't added any products to your cart yet.</p>
                  <button className="px-8 py-3 rounded-full bg-white border border-gray-200 text-gray-700 font-bold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all" onClick={toggleCart}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-50 shrink-0 relative border border-gray-50">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex flex-col items-start gap-1 w-full">
                        <h3 className="font-bold text-gray-900 leading-tight w-full flex justify-between gap-2 overflow-hidden">
                           <span className="truncate">{item.name}</span>
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </h3>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-1 py-1">
                          <button 
                            className="h-6 w-6 rounded-full hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all"
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-gray-700">{item.quantity}</span>
                          <button 
                            className="h-6 w-6 rounded-full hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 flex items-center justify-center transition-all"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button 
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 rounded-full transition-colors flex items-center justify-center"
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
              <div className="relative z-10 p-6 border-t border-gray-100 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between mb-6 flex-col gap-1">
                  <div className="flex justify-between text-gray-500 font-medium text-sm">
                     <span>Subtotal</span>
                     <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-900 font-extrabold text-2xl mt-2">
                     <span>Total</span>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <Link href="/checkout" onClick={toggleCart} className="w-full block">
                  <button className="w-full py-4 text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight className="w-5 h-5"/>
                  </button>
                </Link>
                <p className="text-center text-xs text-gray-400 font-medium mt-4">Taxes and shipping calculated at checkout</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
