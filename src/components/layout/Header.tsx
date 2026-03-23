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
  const [scrolled, setScrolled] = useState(false);
  const { items, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { user, isLoaded } = useUser();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalItems = items ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const totalWishlist = wishlistItems ? wishlistItems.length : 0;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${scrolled ? 'glass py-3' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between gap-4">
          <div className="flex items-center lg:hidden">
             <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 hover:bg-black/5 text-gray-700 transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
             >
               {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
             </Button>
          </div>
  
          {/* Center: Logo & Nav */}
          <div className="flex items-center gap-10">
            <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity">
              <Logo />
            </Link>
             
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/products" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Store</Link>
              <Link href="/bundle-builder" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Bundles</Link>
              <Link href="/freebies" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Freebies</Link>
              <Link href="/about" className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">About</Link>
            </nav>
          </div>
  
          {/* Right: Actions & Auth */}
          <div className="flex items-center gap-3">
            {!isLoaded ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            ) : !user ? (
               <SignInButton mode="modal">
                <Button className="hidden sm:flex font-bold rounded-full px-6 bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-sm">
                    Sign In
                </Button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="hidden sm:block cursor-pointer">
                  <Button variant="outline" className="font-bold rounded-full px-6 border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
                    Portal
                  </Button>
                </Link>
                <div className="flex items-center justify-center p-[3px] rounded-full border border-gray-200 bg-white">
                    <UserButton />
                </div>
              </div>
            )}
             
            <div className="flex items-center gap-2">
              <Link href="/wishlist">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative rounded-full h-10 w-10 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all group"
                >
                  <Heart className="w-5 h-5" />
                  {mounted && totalWishlist > 0 && (
                    <span className="absolute 0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white transform translate-x-1 -translate-y-1">
                      {totalWishlist}
                    </span>
                  )}
                </Button>
              </Link>
  
              <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative rounded-full h-10 w-10 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all group" 
                  onClick={toggleCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute 0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-white transform translate-x-1 -translate-y-1">
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
              className="absolute top-20 left-4 bg-white/90 glass border border-gray-200 p-6 rounded-3xl shadow-xl pointer-events-auto"
            >
              <nav className="flex flex-col gap-5 min-w-[220px]">
                <Link href="/products" className="text-lg font-semibold text-gray-600 hover:text-gray-900 transition-all" onClick={() => setIsMenuOpen(false)}>All Products</Link>
                <Link href="/wishlist" className="text-lg font-semibold text-gray-600 hover:text-red-500 transition-all flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                  My Wishlist
                  {mounted && totalWishlist > 0 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">{totalWishlist}</span>}
                </Link>
                <Link href="/products?category=AI+Agents" className="text-lg font-semibold text-gray-600 hover:text-[#f26496] transition-all flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                  AI Agents
                  <span className="text-[9px] bg-pink-100 text-[#f26496] px-2 py-0.5 rounded-full font-bold">HOT</span>
                </Link>
                <Link href="/bundle-builder" className="text-lg font-semibold text-gray-600 hover:text-gray-900 transition-all flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                  Bundle Builder
                </Link>
                <Link href="/freebies" className="text-lg font-semibold text-gray-600 hover:text-blue-600 transition-all flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                  Free Resources
                </Link>
                <Link href="/about" className="text-lg font-semibold text-gray-600 hover:text-gray-900 transition-all" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                {user && (
                   <Link href="/dashboard" className="mt-4 clay-btn text-center" onClick={() => setIsMenuOpen(false)}>
                      Access Dashboard
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
