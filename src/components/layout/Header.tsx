"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, Heart, Sparkles, ShieldCheck } from "lucide-react";
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

  const safePlayClick = () => {
    try {
      playClick();
    } catch (e) {
      console.warn("[HEADER] Audio skipped:", e);
    }
  };

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
            <Link href="/" className="group" onClick={safePlayClick}>
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
            <button
              type="button"
              onClick={() => { safePlayClick(); toggleConcierge(); }}
              aria-label="Toggle AI Assistant"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-accent/40 transition-transform duration-150 hover:scale-105 active:scale-[0.98] cursor-pointer group"
            >
              <Sparkles className="w-4 h-4 text-accent transition-transform group-hover:rotate-12" />
              <span className="text-xs font-mono uppercase tracking-tighter text-white/50 group-hover:text-white transition-colors">
                AI Assistant
              </span>
              <kbd className="hidden lg:block ml-2 px-1.5 py-0.5 bg-white/10 rounded text-[9px] text-white/30">/</kbd>
            </button>

            <div className="flex items-center gap-2">
              {/* Digital Vault (NFTs) */}
              <SignedIn>
                <Link href="/vault">
                  <button className="relative p-2 text-white/60 hover:glow-text transition-all group" title="Digital Vault">
                    <ShieldCheck className="w-5 h-5 group-hover:text-primary transition-colors" />
                  </button>
                </Link>
              </SignedIn>

              {/* Wishlist */}
              <Link href="/wishlist">
                <button 
                  aria-label={`View wishlist with ${totalWishlist} items`}
                  className="relative p-2 text-white/60 hover:text-primary transition-colors group"
                >
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
                <button 
                  aria-label={`View cart with ${totalItems} items`}
                  className="relative p-2 text-white/60 hover:text-primary transition-colors group"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {mounted && totalItems > 0 && (
                    <span className="absolute top-1 right-1 bg-accent text-black text-[9px] font-black min-w-[14px] h-[14px] rounded-full flex items-center justify-center transition-transform duration-200">
                      {totalItems}
                    </span>
                  )}
                </button>
              </Link>

              <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />

              {/* User / Auth */}
              <div className="flex items-center gap-3">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl={pathname}>
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
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
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
              <div className="py-6 border-y border-white/5">
                <SignedOut>
                  <SignInButton mode="modal" fallbackRedirectUrl={pathname}>
                    <button className="w-full py-4 text-sm font-black uppercase italic tracking-widest text-white/40 hover:text-primary transition-all border border-white/10 rounded-xl bg-white/2">
                      Portal Entrance // Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-4">
                      <UserButton 
                        appearance={{
                          elements: {
                            userButtonAvatarBox: "w-10 h-10 border border-primary shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                          }
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Active_Session</span>
                        <span className="text-xs font-black uppercase text-primary">Identity_Verified</span>
                      </div>
                    </div>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                      <button className="px-4 py-2 bg-white/10 rounded-lg text-[9px] font-mono uppercase tracking-widest hover:bg-primary hover:text-black transition-all">
                        Profile
                      </button>
                    </Link>
                  </div>
                </SignedIn>
              </div>

              <ForgeButton data-action="search" className="w-full" onClick={() => setIsMenuOpen(false)}>
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
