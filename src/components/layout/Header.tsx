"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Logo } from "@/components/ui/Logo";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  
  // Handle hydration mismatch for counts
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlist = wishlistItems.length;

  if (pathname === "/") return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-[#020202] border-b border-white/5">
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center">
             <Button 
                variant="ghost" 
                size="icon" 
                className="bg-zinc-950 border border-white/10 rounded-none h-12 w-12 hover:border-primary transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
               {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
             </Button>
          </div>
  
          {/* Center: Logo & Nav */}
          <div className="flex items-center gap-12 overflow-hidden">
            <Link href="/" className="shrink-0 brightness-0 invert opacity-90 hover:opacity-100 transition-opacity">
              <Logo />
            </Link>
             
            <nav className="hidden lg:flex items-center gap-10">
              <Link href="/products" className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-primary transition-all duration-300">Store</Link>
              <Link href="/bundle-builder" className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-primary transition-all duration-300">Bundles</Link>
              <Link href="/freebies" className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-primary transition-all duration-300">Freebies</Link>
              <Link href="/about" className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-primary transition-all duration-300">About</Link>
            </nav>
          </div>
  
          {/* Right: Actions & Auth */}
          <div className="flex items-center gap-4">
            {!isLoaded ? (
              <div className="w-12 h-12 bg-white/5 animate-pulse" />
            ) : !user ? (
               <SignInButton mode="modal">
                <Button className="hidden sm:flex font-black uppercase tracking-widest border border-white/10 bg-white text-black hover:bg-primary transition-all duration-300 rounded-none px-8">
                    Sign In
                </Button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="hidden sm:block cursor-pointer">
                  <Button variant="outline" className="font-black uppercase tracking-widest border border-primary/20 bg-zinc-900 text-primary hover:bg-primary hover:text-black transition-all duration-300 rounded-none px-8 relative z-[60]">
                    Portal
                  </Button>
                </Link>
                <div className="bg-zinc-950 p-1 border border-white/10">
                    <UserButton />
                </div>
              </div>
            )}
             
            <div className="flex items-center gap-3">
              <Link href="/wishlist">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="relative bg-zinc-950 border border-white/10 rounded-none h-12 w-12 hover:border-red-500 transition-all duration-300 group"
                >
                  <Heart className="w-5 h-5 text-white/50 group-hover:text-red-500 transition-colors" />
                  {mounted && totalWishlist > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-red-500 text-[10px] font-black text-white">
                      {totalWishlist}
                    </span>
                  )}
                </Button>
              </Link>
  
              <Button 
                  variant="outline" 
                  size="icon" 
                  className="relative bg-zinc-950 border border-white/10 rounded-none h-12 w-12 hover:border-primary transition-all duration-300 group" 
                  onClick={toggleCart}
              >
                <ShoppingCart className="w-5 h-5 text-white/50 group-hover:text-primary transition-colors" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center bg-primary text-[10px] font-black text-black">
                    {totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
              <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-4 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] pointer-events-auto"
            >
              <nav className="flex flex-col gap-6 min-w-[220px]">
                <Link href="/products" className="text-xl font-space text-white/70 hover:text-white hover:translate-x-2 transition-all" onClick={() => setIsMenuOpen(false)}>All Products</Link>
                <Link href="/wishlist" className="text-xl font-space text-white/70 hover:text-red-500 hover:translate-x-2 transition-all flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                  My Wishlist
                  {mounted && totalWishlist > 0 && <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold border border-red-500/20">{totalWishlist}</span>}
                </Link>
                <Link href="/products?category=Web+Development" className="text-xl font-space text-white/70 hover:text-white hover:translate-x-2 transition-all" onClick={() => setIsMenuOpen(false)}>Web Dev Kits</Link>
                <Link href="/products?category=AI+Agents" className="text-xl font-space text-white/70 hover:text-primary hover:translate-x-2 transition-all flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                  AI Agents (GOD TIER)
                  <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold">HOT</span>
                </Link>
                <Link href="/bundle-builder" className="text-xl font-space text-white/70 hover:text-white hover:translate-x-2 transition-all flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                  Bundle Builder
                  <span className="text-[9px] bg-white/10 text-white border border-white/20 px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>
                </Link>
                <Link href="/freebies" className="text-xl font-space text-white/70 hover:text-primary hover:translate-x-2 transition-all flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                  Free Resources
                  <span className="text-[9px] bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 rounded-full font-bold">FREE</span>
                </Link>
                <Link href="/about" className="text-xl font-space text-white/70 hover:text-white hover:translate-x-2 transition-all" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                <Link href="/contact" className="text-xl font-space text-white/70 hover:text-white hover:translate-x-2 transition-all" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                <Link href="/affiliate" className="text-xl font-space text-white/70 hover:text-primary hover:translate-x-2 transition-all" onClick={() => setIsMenuOpen(false)}>Partner Program</Link>
                <Link href="/faq" className="text-xl font-space text-white/70 hover:text-white hover:translate-x-2 transition-all" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                {user && (
                   <Link href="/dashboard" className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-xl text-primary font-bold text-center" onClick={() => setIsMenuOpen(false)}>
                      ACCESS DASHBOARD
                   </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      <CartDrawer />
    </>
  );
}
