"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Heart, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { NavbarMenu } from "./NavbarMenu";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { useForgeStore } from "@/lib/forge-store";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { SystemBroadcast } from "./SystemBroadcast";
import { useAudio } from "@/hooks/useAudio";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { playClick } = useAudio();
  const [mounted, setMounted] = useState(false);
  
  const toggleConcierge = useForgeStore((state) => state.toggleConcierge);
  const systemStatus = useForgeStore((state) => state.systemStatus);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlist = wishlistItems.length;

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(handle);
    };
  }, []);

  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  if (isAuthPage) return null;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'glass-panel border-b border-white/10' 
            : 'bg-transparent'
        }`}
      >
        <SystemBroadcast />
        <div className={`container mx-auto px-6 flex items-center justify-between gap-8 h-12 transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
          
          {/* 1. LEFT: Logo & System Status */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="group" onClick={playClick}>
              <Logo className="text-2xl tracking-tighter transition-all group-hover:glow-text uppercase">
                DIGITAL SWARM
              </Logo>
            </Link>
            
            <div className="hidden xl:flex items-center gap-6">
              <CurrencySwitcher />
              
              {/* System Status Indicator (Pseudo-AI) */}
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <span className={`w-1.5 h-1.5 rounded-full ${systemStatus === 'idle' ? 'bg-accent' : 'bg-primary'} animate-pulse shadow-[0_0_8px_currentColor]`} />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">
                  Status: {systemStatus === 'idle' ? 'Online' : 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. CENTER: Main Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavbarMenu scrolled={scrolled} />
          </div>

          {/* 3. RIGHT: Forge Actions & Concierge */}
          <div className="flex items-center gap-4">
            
            {/* AI Concierge Trigger (The "Input") */}
            <motion.button 
              onClick={() => { playClick(); toggleConcierge(); }}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-accent/40 transition-all cursor-pointer group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4 text-accent transition-transform group-hover:rotate-12" />
              <span className="text-xs font-mono uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors">
                AI Assistant
              </span>
              <kbd className="hidden lg:block ml-2 px-1.5 py-0.5 bg-white/10 rounded text-[9px] text-white/30">/</kbd>
            </motion.button>

            <div className="flex items-center gap-2">
              {/* Wishlist */}
              <Link href="/wishlist">
                <button className="relative p-2 text-white/60 hover:text-primary transition-colors group">
                  <Heart className="w-5 h-5" />
                  {mounted && totalWishlist > 0 && (
                    <span className="absolute top-1 right-1 bg-primary text-black text-[9px] font-black min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
                      {totalWishlist}
                    </span>
                  )}
                </button>
              </Link>
              
              {/* Cart */}
              <Link href="/cart">
                <button className="relative p-2 text-white/60 hover:text-primary transition-colors group">
                  <ShoppingBag className="w-5 h-5" />
                  {mounted && totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 1.5 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 bg-accent text-black text-[9px] font-black min-w-[14px] h-[14px] rounded-full flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </button>
              </Link>

              <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />

              {/* User / Auth */}
              <div className="flex items-center gap-3">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-[11px] font-outfit font-black uppercase italic tracking-widest text-white/60 hover:text-primary transition-all">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 border border-white/10 hover:border-primary transition-all"
                      }
                    }}
                  />
                </SignedIn>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white/80 hover:text-primary transition-colors"
              >
                {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay (Forge Style) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-60 glass-panel lg:hidden flex flex-col p-8 pt-24"
          >
            <nav className="flex flex-col gap-6 mb-12">
              {['Shop', 'Analytics', 'Community', 'Guide'].map((item) => (
                <MobileNavLink 
                  key={item} 
                  href={`/${item.toLowerCase().replace(' ', '-')}`} 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </MobileNavLink>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-6">
              <ForgeButton className="w-full">
                Search Products
              </ForgeButton>
              
              <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">
                <span>Status: Optimal</span>
                <span>© DIGITAL SWARM 2026</span>
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
      className="min-h-[44px] py-4 text-3xl font-outfit font-black uppercase italic tracking-tighter text-white hover:text-primary transition-all flex items-center gap-4 group"
    >
      <span className="w-0 h-1 bg-primary transition-all group-hover:w-8" />
      {children}
    </Link>
  );
}
