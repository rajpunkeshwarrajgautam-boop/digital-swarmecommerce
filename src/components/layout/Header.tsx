"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Package, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
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
  
  // Handle hydration mismatch for counts
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlist = wishlistItems.length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-4 bg-background/50 backdrop-blur-md border-b border-border/20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
             <Button 
                variant="ghost" 
                size="icon" 
                className="bg-white border border-border rounded-full h-12 w-12 hover:border-primary transition-colors shadow-sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
               {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
             </Button>
          </div>

          {/* Center: Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link href="/">
              <Logo />
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/products" className="text-sm font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">Store</Link>
              <Link href="/bundle-builder" className="text-sm font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">Bundles</Link>
              <Link href="/freebies" className="text-sm font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">Freebies</Link>
              <Link href="/about" className="text-sm font-bold uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors">About</Link>
            </nav>
          </div>

          {/* Right: Actions & Auth */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!isLoaded ? (
              <div className="w-24 h-10 bg-gray-100 animate-pulse rounded-full hidden sm:block" />
            ) : !user ? (
              <SignInButton mode="modal">
                <Button className="hidden sm:flex font-bold border border-border bg-white text-foreground hover:bg-gray-100 hover:text-black transition-colors rounded-full px-6 shadow-sm">
                    Sign In
                </Button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" className="hidden sm:flex font-bold border-2 border-primary/20 bg-white text-primary hover:bg-primary hover:text-white transition-all rounded-full px-6 shadow-md shadow-primary/10">
                    Dashboard
                  </Button>
                </Link>
                <div className="bg-white p-1 rounded-full border border-border shadow-sm">
                    <UserButton>
                      <UserButton.MenuItems>
                        <UserButton.Link label="My Orders" labelIcon={<Package className="w-4 h-4" />} href="/dashboard" />
                        <UserButton.Link label="My Wishlist" labelIcon={<Heart className="w-4 h-4" />} href="/wishlist" />
                      </UserButton.MenuItems>
                    </UserButton>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Link href="/wishlist">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="relative bg-white border border-border rounded-full h-12 w-12 hover:border-red-500 transition-colors shadow-sm group"
                >
                  <Heart className="w-5 h-5 text-foreground group-hover:text-red-500 transition-colors" />
                  {mounted && totalWishlist > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 border border-black text-[10px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                      {totalWishlist}
                    </span>
                  )}
                </Button>
              </Link>

              <Button 
                  variant="outline" 
                  size="icon" 
                  className="relative bg-white border border-border rounded-full h-12 w-12 hover:border-primary transition-colors shadow-sm group" 
                  onClick={toggleCart}
              >
                <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary border border-black text-[10px] font-bold text-black shadow-[0_0_10px_var(--primary)]">
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
