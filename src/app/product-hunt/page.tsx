"use client";

import { Star, ArrowRight, Download, ShieldCheck, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductHuntHub() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#3b82f633,transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-bold mb-8"
          >
            <Star className="w-4 h-4 fill-orange-500" /> WELCOME PRODUCT HUNT COMMUNITY
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight italic">
            STOP BUILDING <br /> <span className="text-primary tracking-tighter not-italic">START SHIPPING.</span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            You found us! As a &quot;Thank You&quot; for checking out Digital Swarm via Product Hunt, we&apos;ve unlocked an exclusive **40% DISCOUNT** across our entire catalog of production-ready code.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/products">
              <Button variant="cyberpunk" className="h-16 px-10 text-lg group">
                Claim 40% Off Now <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <div className="text-left">
              <div className="flex -space-x-3 mb-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                    User {i}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-black bg-primary text-black flex items-center justify-center text-[10px] font-bold">
                  +2k
                </div>
              </div>
              <p className="text-xs text-zinc-500 font-medium">Trusted by 2,100+ PH Hunters</p>
            </div>
          </div>
        </div>
      </section>

      {/* The "Why" Section */}
      <section className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold italic">Bypass the &quot;Hello World&quot;</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                    Don&apos;t waste 40 hours setting up Auth, DB, and UI. Every template comes with production-grade Clerk, Supabase, and Tailwind pre-configured.
                </p>
            </div>
            <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold italic">Clean, Scalable Code</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                    No spaghetti code. Built with TypeScript, Next.js 15, and the latest server components. Every repo is a blueprint for scaling.
                </p>
            </div>
            <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Download className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold italic">Commercial License</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                    Build for yourself or build for clients. Our simple license allows you to ship unlimited commercial projects with one purchase.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
            <div className="inline-block p-8 border border-white/5 rounded-[3rem] bg-zinc-900/50 backdrop-blur-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24">
                    <div>
                        <p className="text-4xl font-black text-primary">₹3.5M+</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Saved by Devs</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-white">4.2k</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Downloads</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-white">15+</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Premium Kits</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black text-emerald-400">24h</p>
                        <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Support Response</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-black mb-8 italic">READY TO SHIP?</h2>
            <p className="text-black/70 max-w-xl mx-auto mb-12 font-medium">
                Use code <span className="p-2 bg-black text-white font-mono rounded-lg">HUNTER40</span> at checkout to unlock your lifetime discount.
            </p>
            <div className="flex flex-col items-center gap-4">
                <Link href="/products">
                    <Button size="lg" className="bg-black text-white hover:bg-zinc-900 h-16 px-12 rounded-full font-black text-xl">
                        BROWSE THE CATALOG
                    </Button>
                </Link>
                <div className="flex items-center gap-6 mt-8">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-black" />
                        <span className="text-sm text-black font-bold">Secure Stripe Gateway</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-black" />
                        <span className="text-sm text-black font-bold">Instant Email Delivery</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}
