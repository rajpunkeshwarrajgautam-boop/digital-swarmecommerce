"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, ExternalLink, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="flex flex-col gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo className="text-white" />
            </Link>
            <p className="text-white/40 text-sm font-bold uppercase tracking-tight leading-relaxed">
              Premium Code Templates & UI Kits for Elite Developers. 
              Built by developers, for developers. 
              The ultimate architectural baseline.
            </p>
            <div className="flex items-center gap-5">
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary transition-all">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary transition-all">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Products Column */}
          <div className="flex flex-col gap-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">Global Products</h4>
            <div className="flex flex-col gap-4">
              <FooterLink href="/products?category=Boilerplates" label="Boilerplates" />
              <FooterLink href="/products?category=AI+Agents" label="AI Agents" />
              <FooterLink href="/products?category=UI+Kits" label="UI Kits" />
              <FooterLink href="/products?category=Dashboards" label="Dashboards" />
              <FooterLink href="/products?category=Mobile" label="Mobile Apps" />
            </div>
          </div>

          {/* Support Column */}
          <div className="flex flex-col gap-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">Support Protocols</h4>
            <div className="flex flex-col gap-4">
              <FooterLink href="/help" label="Help Center" />
              <FooterLink href="/contact" label="Contact Desk" />
              <FooterLink href="/refund" label="Refund Policy" />
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/licenses" label="Software Licenses" />
            </div>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary italic">Legal Matrix</h4>
            <div className="flex flex-col gap-4">
              <FooterLink href="/terms" label="Terms of Service" />
              <FooterLink href="/privacy" label="Privacy Protocol" />
              <FooterLink href="/cookie" label="Cookie Usage" />
            </div>
            
            {/* Payment Verification */}
            <div className="mt-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Verified Processor</span>
              </div>
              <div className="flex flex-wrap gap-4 opacity-20 filter grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4" alt="Razorpay" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 italic">
            © {currentYear} DIGITAL SWARM // ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center gap-8">
             <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/10 italic">Secure_Uplink: v3.2.0</span>
             <ExternalLink className="w-3 h-3 text-white/10" />
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
