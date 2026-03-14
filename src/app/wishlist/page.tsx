"use client";

import { useWishlistStore } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, ArrowRight, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItemToCart = useCartStore((state) => state.addItem);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-24 min-h-[80vh]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase italic">My Wishlist</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Saved items for your next digital evolution.
            </p>
          </div>
          
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearWishlist}
              className="text-red-500 border-red-500/20 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 border-2 border-dashed border-border rounded-3xl bg-secondary/5"
            >
              <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-border">
                <PackageOpen className="w-10 h-10 text-muted-foreground opacity-50" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Discover elite AI agents and developer kits to build your next empire.
              </p>
              <Link href="/products">
                <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20">
                  Browse Products <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-card border-2 border-border p-6 rounded-3xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full cyber-shadow"
                >
                  <div className="relative aspect-video w-full mb-6 overflow-hidden rounded-2xl group-hover:shadow-2xl transition-all duration-500">
                    <Image
                      src={item.image}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={item.name}
                    />
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl z-10"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col grow">
                    <h3 className="text-2xl font-black mb-2 leading-tight group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-2xl font-black text-primary mb-8">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>

                    <div className="flex gap-4 mt-auto">
                      <Button 
                        onClick={() => addItemToCart({ ...item, quantity: 1, description: "", category: "", rating: 0, inStock: true, sales: 0 } as any)}
                        className="flex-1 uiverse-glow-btn h-12"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                      </Button>
                      <Link href={`/products/${item.id}`}>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-border bg-white hover:bg-gray-50 shadow-sm">
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Motivation Card */}
        {items.length > 0 && (
          <div className="mt-24 p-12 bg-zinc-950 border border-white/10 rounded-[3rem] text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-primary/10 to-transparent opacity-50" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase italic">Ready to evolve?</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
                Add your dream stack to the cart and launch your next project within minutes. High-quality code, instant delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button variant="outline" className="w-full sm:w-auto px-8 h-14 rounded-2xl border-white/10 text-white hover:bg-white/5">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/products">
                   <button className="uiverse-glow-btn px-12 h-14 shadow-2xl shadow-primary/20">
                     UPGRADE NOW
                   </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
