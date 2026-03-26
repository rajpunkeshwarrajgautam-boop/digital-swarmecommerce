"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Heart } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NavbarMenu } from "./NavbarMenu";
import { SearchBar } from "./SearchBar";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlist = wishlistItems.length;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setScrolled(window.scrollY > 20);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  if (isAuthPage) return null;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl border-b border-secondary/10 py-3 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-between gap-4">
          
          {/* 1. LEFT: Logo */}
          <div className="flex items-center shrink-0 min-w-fit">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo />
            </Link>
          </div>

          {/* 2. CENTER: Navigation (Desktop) - Integrated NavbarMenu */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavbarMenu scrolled={scrolled} />
          </div>

          {/* 3. RIGHT: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/wishlist">
                <button className="relative p-2 text-secondary hover:text-primary transition-colors group">
                  <Heart className="w-6 h-6" />
                  {mounted && totalWishlist > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                      {totalWishlist}
                    </span>
                  )}
                </button>
              </Link>
              
              <Link href="/cart">
                <button className="relative p-2 text-secondary hover:text-primary transition-colors group">
                  <ShoppingBag className="w-6 h-6" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm ring-1 ring-white/10">
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>

              <div className="h-6 w-px bg-secondary/10 mx-1 hidden sm:block" />

              <div className="flex items-center gap-1">
                <SignedOut>
                  <SignInButton mode="modal">
                     <button className="text-secondary font-black uppercase italic text-[10px] sm:text-xs tracking-widest hover:text-primary transition-colors px-2 sm:px-3 py-1.5 rounded-lg hover:bg-secondary/5 transition-all">Sign In</button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" className="hidden sm:block text-secondary font-black uppercase italic text-[10px] tracking-[0.2em] hover:text-primary transition-all mr-2">
                    Dashboard
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>

              {/* Mobile Trigger */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-secondary hover:text-primary transition-colors ml-1"
              >
                {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white lg:hidden flex flex-col p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-12">
              <Logo />
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="w-9 h-9 text-secondary" />
              </button>
            </div>

          <nav className="flex flex-col gap-8 mb-12">
            <MobileNavLink href="/products" onClick={() => setIsMenuOpen(false)}>Products</MobileNavLink>
            <MobileNavLink href="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/faq" onClick={() => setIsMenuOpen(false)}>FAQ</MobileNavLink>
            <MobileNavLink href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</MobileNavLink>
          </nav>

          <div className="mt-auto pt-8 border-t border-secondary/10 flex flex-col gap-6">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">Sign In</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4 p-4 bg-secondary/5 rounded-2xl">
                <UserButton />
                <span className="font-bold text-secondary">Dashboard</span>
              </div>
            </SignedIn>
            
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-secondary/40 tracking-tighter">
              <span>Digital Swarm © 2026</span>
              <span>All rights reserved.</span>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer />
    </>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="text-4xl font-black uppercase italic tracking-tighter text-secondary hover:text-primary transition-colors"
    >
      {children}
    </Link>
  );
}
