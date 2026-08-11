"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CurrencySwitcher } from "./CurrencySwitcher";
import { useCartStore } from "@/lib/store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useForgeStore } from "@/lib/forge-store";

const links = [
  { label: "Catalog", href: "/products" },
  { label: "How it works", href: "/#story" },
  { label: "Free assets", href: "/freebies" },
  { label: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const toggleConcierge = useForgeStore((state) => state.toggleConcierge);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlist = wishlistItems.length;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    const handleScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");
  if (isAuthPage) return null;

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 border-b border-black/15 text-[#151515] transition-all duration-300 ${scrolled ? "bg-[#f1eee6]/92 shadow-[0_8px_30px_rgba(0,0,0,.05)] backdrop-blur-xl" : "bg-[#f1eee6]"}`}>
        <div className={`mx-auto flex max-w-[1700px] items-center justify-between gap-5 px-5 transition-all duration-300 md:px-8 lg:px-12 ${scrolled ? "h-16" : "h-20"}`}>
          <div className="flex min-w-0 items-center gap-5 lg:gap-8">
            <Link href="/" className="shrink-0 text-[15px] font-black uppercase tracking-[-.04em] md:text-lg">
              DIGITAL <span className="text-[#725cff]">SWARM</span>
            </Link>
            <div className="hidden xl:block">
              <CurrencySwitcher />
            </div>
          </div>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            {links.map((link, index) => (
              <Link key={link.href} href={link.href} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-black/60 transition hover:text-black">
                <span className="font-mono text-[8px] text-[#725cff]/70">{String(index + 1).padStart(2, "0")}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={toggleConcierge}
              aria-label="Open product finder"
              className="hidden h-10 items-center gap-2 border border-black/15 px-3 text-[9px] font-black uppercase tracking-[.16em] transition hover:bg-[#151515] hover:text-[#f1eee6] sm:flex"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline">Find a product</span>
            </button>

            <Link href="/wishlist" className="relative flex h-10 w-10 items-center justify-center border border-transparent transition hover:border-black/15" aria-label={`View wishlist with ${totalWishlist} items`}>
              <Heart className="h-4 w-4" />
              {mounted && totalWishlist > 0 && <CountBadge value={totalWishlist} />}
            </Link>

            <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center border border-transparent transition hover:border-black/15" aria-label={`View cart with ${totalItems} items`}>
              <ShoppingBag className="h-4 w-4" />
              {mounted && totalItems > 0 && <CountBadge value={totalItems} />}
            </Link>

            <div className="hidden h-6 w-px bg-black/15 sm:block" />

            <SignedOut>
              <SignInButton mode="modal" fallbackRedirectUrl={pathname}>
                <button className="hidden h-10 border border-black/20 px-4 text-[9px] font-black uppercase tracking-[.16em] transition hover:bg-[#725cff] hover:text-white sm:block">Sign in</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="hidden items-center sm:flex"><UserButton /></div>
            </SignedIn>

            <button onClick={() => setIsMenuOpen((open) => !open)} className="ml-1 flex h-10 w-10 items-center justify-center border border-black/15 lg:hidden" aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#d9d0ff] px-6 pb-8 pt-24 text-[#151515] lg:hidden"
          >
            <div className="mb-10 flex items-center justify-between border-b border-black/20 pb-5">
              <span className="font-mono text-[9px] font-black uppercase tracking-[.2em]">DIGITAL SWARM / MENU</span>
              <button onClick={() => setIsMenuOpen(false)} className="flex h-10 w-10 items-center justify-center border border-black/20" aria-label="Close navigation"><X className="h-5 w-5" /></button>
            </div>

            <nav className="flex flex-col">
              {links.map((link, index) => (
                <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="grid grid-cols-[48px_1fr_auto] items-center border-b border-black/20 py-5">
                  <span className="font-mono text-[9px] font-black text-[#725cff]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-4xl font-black uppercase tracking-[-.055em]">{link.label}</span>
                  <span className="text-xl">↗</span>
                </Link>
              ))}
            </nav>

            <div className="mt-auto grid gap-3 pt-10">
              <Link href="/search" onClick={() => setIsMenuOpen(false)} className="editorial-button editorial-button-dark w-full justify-between">Product finder <Search className="h-4 w-4" /></Link>
              <SignedOut>
                <SignInButton mode="modal" fallbackRedirectUrl={pathname}>
                  <button className="editorial-button w-full justify-between">Sign in <span>↗</span></button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center justify-between border border-black/20 p-4"><span className="text-[10px] font-black uppercase tracking-[.14em]">Customer account</span><UserButton /></div>
              </SignedIn>
              <div className="pt-3"><CurrencySwitcher /></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer />
    </>
  );
}

function CountBadge({ value }: { value: number }) {
  return <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#725cff] px-1 text-[8px] font-black text-white">{value}</span>;
}
