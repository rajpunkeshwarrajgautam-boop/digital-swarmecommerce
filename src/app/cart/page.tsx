"use client";

import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, getCartCount } = useCartStore();
  
  const total = getCartTotal();
  const count = getCartCount();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-secondary/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-secondary/20" />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Your cart is empty</h1>
        <p className="text-secondary/50 mb-8 max-w-md">Looks like you haven't added any premium code templates yet. Start building your empire today.</p>
        <Link href="/products">
          <Button className="px-8 py-6 text-lg font-black uppercase tracking-widest">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-12">Your Cart <span className="text-primary/20 text-3xl font-medium not-italic ml-4">({count} items)</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Cart Items List (60%) */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div 
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="group flex flex-col sm:flex-row items-center gap-6 p-6 bg-white border border-secondary/5 rounded-3xl hover:border-secondary/10 transition-all hover:shadow-2xl hover:shadow-secondary/5"
                >
                  <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-secondary/5 border border-secondary/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.productId}`} className="text-xl font-black uppercase italic tracking-tight text-secondary hover:text-primary transition-colors block mb-1">
                      {item.name}
                    </Link>
                    <p className="text-xs font-black uppercase tracking-widest text-secondary/30">{item.category}</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center bg-secondary/5 rounded-xl border border-secondary/5">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 text-secondary/40 hover:text-secondary transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-black italic">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 text-secondary/40 hover:text-secondary transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-red-500/40 hover:text-red-500 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-black italic tracking-tighter text-secondary">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>
                    <div className="text-[10px] font-black uppercase text-secondary/30 tracking-widest">
                      ₹{item.price.toLocaleString("en-IN")} / unit
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary (40%) */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="p-8 bg-secondary text-white rounded-[2.5rem] shadow-2xl shadow-secondary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShoppingBag className="w-32 h-32" />
              </div>
              
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-8 relative z-10">Order Summary</h2>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center text-white/60 text-sm font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-white/60 text-sm font-bold uppercase tracking-widest">
                  <span>Discount</span>
                  <span className="text-primary">- ₹0</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xl font-black italic uppercase tracking-tighter">Total</span>
                  <span className="text-4xl font-black italic tracking-tighter text-primary">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <Link href="/checkout">
                  <Button className="w-full py-8 text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group">
                    Checkout Now <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/products" className="block text-center text-xs font-black uppercase text-white/40 hover:text-white transition-colors tracking-widest">
                  Continue Shopping
                </Link>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap gap-4 opacity-30 justify-center">
                <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="h-4 invert" />
                <span className="text-[8px] font-black uppercase tracking-widest">Secure UPI / Cards / NetBanking</span>
              </div>
            </div>
            
            <div className="mt-6 p-6 border border-secondary/5 rounded-3xl flex items-center gap-4 bg-white/50 backdrop-blur-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary/40">Guaranteed</p>
                <p className="text-xs font-bold text-secondary italic uppercase tracking-tight">Instant Digital Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
