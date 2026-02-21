"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items, toggleCart } = useCartStore();
  
  // Handle hydration mismatch for cart count
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const init = async () => setMounted(true);
    init();
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-4 pointer-events-none">
        <div className="container mx-auto flex items-center justify-between pointer-events-auto">
          {/* Left: Menu */}
          <div className="flex items-center gap-2">
             <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white border-2 border-black rounded-full h-12 w-12 hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
               {isMenuOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
             </Button>
          </div>

          {/* Center: Logo */}
          <Link href="/">
            <div className="font-titan text-3xl bg-primary px-6 py-2 border-2 border-black -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:rotate-0 hover:scale-105 transition-all text-black">
                DS
            </div>
          </Link>

          {/* Right: Cart & Auth */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="font-bold border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="bg-white p-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <UserButton />
              </div>
            </SignedIn>
            
            <Button 
                variant="ghost" 
                size="icon" 
                className="relative bg-white border-2 border-black rounded-full h-12 w-12 hover:scale-110 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                onClick={toggleCart}
            >
              <ShoppingCart className="w-6 h-6 text-black" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent border-2 border-black text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-4 bg-white border-4 border-black p-6 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] pointer-events-auto"
            >
              <nav className="flex flex-col gap-4 min-w-[200px]">
                <Link href="/products" className="text-2xl font-titan hover:text-primary hover:translate-x-2 transition-all" onClick={() => setIsMenuOpen(false)}>Shop All</Link>
                <Link href="/bundle-builder" className="text-2xl font-titan text-primary hover:translate-x-2 transition-all flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  Bundle Builder
                  <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
                </Link>
                <Link href="/products" className="text-2xl font-titan hover:text-primary hover:translate-x-2 transition-all" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
                <Link href="/about" className="text-2xl font-titan hover:text-primary hover:translate-x-2 transition-all" onClick={() => setIsMenuOpen(false)}>About Us</Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <CartDrawer />
    </>
  );
}
