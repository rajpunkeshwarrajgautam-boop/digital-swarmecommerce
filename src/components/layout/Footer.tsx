"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, ExternalLink, ShieldCheck } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="flex flex-col gap-10">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-4">
                <Logo className="text-white" />
                <div className="px-2 py-1 bg-primary/10 border border-primary/20 text-[8px] font-mono text-primary font-black uppercase tracking-widest italic">
                  v3.12_STABLE
                </div>
              </div>
            </Link>
            <p className="text-white/30 text-[11px] font-mono uppercase tracking-widest leading-loose italic max-w-xs">
              Autonomous Code Forge. Premium Architectural Protocols for Elite Product Development. Secured by the Swarm Network.
            </p>
            <div className="flex items-center gap-5">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="w-12 h-12 border border-white/5 bg-white/2 flex items-center justify-center text-white/20 hover:text-primary hover:border-primary/40 transition-all group">
                   <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </div>

          {/* Products Column */}
          <div className="flex flex-col gap-10">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-primary italic">SYSTEM_PRODUCTS</h4>
            <div className="flex flex-col gap-5">
              <FooterLink href="/products?category=SaaS" label="SaaS Kits" />
              <FooterLink href="/products?category=AI" label="AI Protocols" />
              <FooterLink href="/products?category=Modern" label="Modern Stacks" />
              <FooterLink href="/products?category=Enterprise" label="Enterprise" />
            </div>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-10">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-primary italic">SUPPORT_LAYER</h4>
            <div className="flex flex-col gap-5">
              <FooterLink href="/help" label="Help_Desktop" />
              <FooterLink href="/contact" label="Comm_Interface" />
              <FooterLink href="/refund" label="Asset_Reversal" />
              <FooterLink href="/about" label="Forge_History" />
            </div>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-10">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.5em] text-primary italic">LEGAL_MATRIX</h4>
            <div className="flex flex-col gap-5">
              <FooterLink href="/terms" label="Service_Protocol" />
              <FooterLink href="/privacy" label="Privacy_Matrix" />
              <FooterLink href="/cookie" label="Data_Hydration" />
            </div>
            
            {/* Payment Verification */}
            <div className="mt-6 pt-10 border-t border-white/5">
              <div className="flex items-center gap-4 mb-6">
                <ShieldCheck className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-white/20">L4_ENCRYPT_ACTIVE</span>
              </div>
              <div className="relative h-6 w-32 grayscale brightness-200 contrast-200 opacity-20 hover:opacity-100 transition-opacity">
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

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-white/10 italic">
              © {currentYear} THE_FORGE_PROTOCOL // SWARM_INFRASTRUCTURE
            </p>
            <p className="text-[8px] font-mono text-white/5 uppercase tracking-[0.5em]">
              STATUS_HEALTHY // NODES_ACTIVE: 12,042 // LATENCY: 24ms
            </p>
          </div>
          <div className="flex items-center gap-12">
             <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest italic">System_Time</span>
                <span className="text-[11px] font-mono text-white/30 font-black">{new Date().toLocaleTimeString()}</span>
             </div>
             <div className="w-12 h-12 border border-white/5 bg-white/2 flex items-center justify-center group cursor-help">
                <ExternalLink className="w-4 h-4 text-white/10 group-hover:text-primary transition-colors" />
             </div>
          </div>
        </div>
      </div>

      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
    </footer>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="text-sm font-bold uppercase tracking-tight text-white/40 hover:text-white transition-all flex items-center group gap-2"
    >
      {label}
      <div className="w-0 h-px bg-primary group-hover:w-4 transition-all" />
    </Link>
  );
}
