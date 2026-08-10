"use client";

import Link from "next/link";
import { Mail, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function Footer() {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  const currentYear = new Date().getFullYear();

  if (isAuthPage) return null;

  return (
    <footer className="bg-secondary pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-12 mb-20">
          <div className="flex flex-col gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo className="text-white" />
            </Link>
            <p className="text-white/35 text-[11px] font-mono uppercase tracking-widest leading-loose max-w-xs">
              Digital products with explicit deliverables, private paid downloads and gateway-backed checkout.
            </p>
            <a
              href="mailto:support@digitalswarm.in"
              className="flex w-fit items-center gap-2 text-xs font-bold text-white/55 transition-colors hover:text-primary"
            >
              <Mail className="h-4 w-4" /> support@digitalswarm.in
            </a>
          </div>

          <div className="flex flex-col gap-8">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.35em] text-primary">Collections</h4>
            <div className="flex flex-col gap-4">
              <FooterLink href="/products?category=SaaS" label="SaaS" />
              <FooterLink href="/products?category=AI%20Agent" label="AI Agents" />
              <FooterLink href="/products?category=Playbooks" label="Playbooks" />
              <FooterLink href="/products?category=Design%20Assets" label="Design Assets" />
              <FooterLink href="/products?category=Source%20Code" label="Source Code" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.35em] text-primary">Customer care</h4>
            <div className="flex flex-col gap-4">
              <FooterLink href="/help" label="Help Center" />
              <FooterLink href="/faq" label="FAQ" />
              <FooterLink href="/contact" label="Contact" />
              <FooterLink href="/pricing" label="Pricing" />
              <FooterLink href="/refund" label="Refund Policy" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.35em] text-primary">Partners</h4>
            <div className="flex flex-col gap-4">
              <FooterLink href="/affiliate" label="Affiliate Program" />
              <FooterLink href="/merchant/apply" label="Become a Merchant" />
              <FooterLink href="/merchant" label="Merchant Portal" />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.35em] text-primary">Legal</h4>
            <div className="flex flex-col gap-4">
              <FooterLink href="/terms" label="Terms of Service" />
              <FooterLink href="/privacy" label="Privacy Policy" />
              <FooterLink href="/cookie" label="Cookie Policy" />
            </div>

            <div className="mt-3 border-t border-white/5 pt-7">
              <div className="mb-4 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-white/30">Payment gateway</span>
              </div>
              <div className="relative h-6 w-32 grayscale brightness-200 contrast-200 opacity-35">
                <Image
                  src="https://www.cashfree.com/content/dam/cashfree/logo/cashfree-logo-black.svg"
                  alt="Cashfree Payments"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-white/5 pt-10 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-white/20">
            © {currentYear} Digital Swarm
          </p>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/20">
            Cashfree checkout · private paid delivery · email support
          </p>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm font-bold text-white/40 transition-colors hover:text-white"
    >
      {label}
      <span className="h-px w-0 bg-primary transition-all group-hover:w-4" />
    </Link>
  );
}
