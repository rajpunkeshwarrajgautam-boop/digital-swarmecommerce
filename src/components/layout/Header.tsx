"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import { Logo } from "@/components/ui/Logo";
import { NavbarMenu } from "./NavbarMenu";
import { SearchBar } from "./SearchBar";

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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 h-12 flex items-center justify-between gap-4">
          
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-8 h-full">
            <Link href="/" className="shrink-0 hover:opacity-80 transition-opacity flex items-center">
              <Logo />
            </Link>
             
            <NavbarMenu />
          </div>
  
          {/* Right: Actions, Search & Auth */}
          <div className="flex items-center gap-4 h-full">
            <SearchBar />

            <div className="flex items-center gap-1">
              <Link href="/wishlist">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="relative rounded-full h-10 w-10 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all group"
                >
                  <Heart className="w-5 h-5" />
                  {mounted && totalWishlist > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                      {totalWishlist}
                    </span>
                  )}
                </Button>
              </Link>
  
              <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative rounded-full h-10 w-10 text-gray-500 hover:bg-cyan-50 hover:text-cyan-600 transition-all group" 
                  onClick={toggleCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-600 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart ({totalItems})</span>
              </Button>
            </div>

            <div className="h-6 w-px bg-black/5" />

            {!isLoaded ? (
              <div className="w-10 h-10 bg-gray-100 rounded-full animate-pulse" />
            ) : !user ? (
               <SignInButton mode="modal">
                 <button className="text-sm font-bold text-gray-900 border-2 border-transparent hover:border-black rounded-full px-5 py-2 transition-all">
                    Sign In
                 </button>
              </SignInButton>
            ) : (
              <div className="flex items-center gap-3">
                 <Link href="/dashboard" className="hidden xl:block">
                   <span className="text-xs font-black uppercase text-gray-400 hover:text-gray-900 transition-colors">Portal</span>
                 </Link>
                 <div className="flex items-center justify-center p-[2px] rounded-full border border-black/5 bg-white shadow-sm">
                    <UserButton afterSignOutUrl="/" />
                 </div>
              </div>
            )}

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center">
              <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-10 w-10 hover:bg-black/5 text-gray-700"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
              <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 right-6 left-6 bg-white glass border border-black/5 p-8 rounded-[2.5rem] shadow-2xl z-60"
            >
              <nav className="flex flex-col gap-6">
                <MobileLink href="/products" label="Store" onClick={() => setIsMenuOpen(false)} />
                <MobileLink href="/products?category=AI+Agents" label="AI Agents" onClick={() => setIsMenuOpen(false)} hot />
                <MobileLink href="/elite" label="Elite Tier" onClick={() => setIsMenuOpen(false)} />
                <MobileLink href="/bundle-builder" label="Bundles" onClick={() => setIsMenuOpen(false)} />
                <MobileLink href="/about" label="About Us" onClick={() => setIsMenuOpen(false)} />
                {user && (
                   <Link href="/dashboard" className="clay-btn text-center mt-4" onClick={() => setIsMenuOpen(false)}>
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

function MobileLink({ href, label, onClick, hot }: { href: string; label: string; onClick: () => void; hot?: boolean }) {
  return (
    <Link 
      href={href} 
      className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 hover:text-cyan-500 transition-all flex items-center justify-between" 
      onClick={onClick}
    >
      {label}
      {hot && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-black animate-pulse">HOT</span>}
    </Link>
  );
}

