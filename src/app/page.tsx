"use client";

import { CheckCircle2, Shield, Zap, Terminal, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ForgeHero } from "@/components/home/ForgeHero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CommunityProtocol } from "@/components/home/CommunityProtocol";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgeButton } from "@/components/ui/ForgeButton";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative z-10 w-full bg-background overflow-hidden">
      <ForgeHero />

      <section className="py-20 border-y border-white/5 bg-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-5 h-5 text-accent" />
                <span className="text-xs font-mono uppercase tracking-widest text-white/40 italic">Shop with confidence</span>
              </div>
              <h2 className="text-4xl font-outfit font-black italic uppercase leading-none mb-4">
                Honest digital <br />
                <span className="text-primary italic">Delivery</span>
              </h2>
              <p className="text-white/30 text-sm font-inter">
                No inflated metrics — just what we control: checkout, private delivery links, clear licences, and listings that match the files you receive.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-[10px] font-mono uppercase tracking-widest">
                <Link href="/refund" className="text-primary hover:underline">
                  Refund policy
                </Link>
                <span className="text-white/15">/</span>
                <Link href="/faq" className="text-primary hover:underline">
                  FAQ
                </Link>
                <span className="text-white/15">/</span>
                <Link href="/freebies" className="text-primary hover:underline">
                  Free downloads
                </Link>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
              {[
                { label: "Digital access", value: "Post-payment", trend: "Private links" },
                { label: "Checkout", value: "Cashfree", trend: "Gateway hosted" },
                { label: "Clear scope", value: "Per SKU", trend: "See product page" },
                { label: "Support", value: "Email", trend: "support@digitalswarm.in" },
              ].map((stat, i) => (
                <GlassCard key={i} className="py-4 px-6 border-white/5 bg-white/5">
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest block mb-1">
                    {stat.label}
                  </span>
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-lg font-outfit font-black italic text-white uppercase leading-tight">
                      {stat.value}
                    </span>
                    <span className="text-[8px] font-mono font-bold text-accent uppercase text-right shrink-0">
                      {stat.trend}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div id="products" className="py-32">
        <div className="container mx-auto px-6 mb-16 text-center">
          <h2 className="text-5xl md:text-7xl font-outfit font-black italic uppercase tracking-tighter mb-4">
            Premium <span className="text-primary italic">Products</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto uppercase text-[11px] font-mono tracking-widest">
            Practical digital foundations with explicit deliverables, licences and requirements
          </p>
        </div>
        <FeaturedSection />
      </div>

      <section id="about" className="py-40 bg-[#07070a] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[150px] pointer-events-none" />

        <div className="container px-6 mx-auto relative z-10 w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="flex flex-col gap-10">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
                <span className="text-[10px] font-mono font-black tracking-[0.3em] text-accent uppercase italic">Product foundations</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-outfit font-black italic tracking-tighter uppercase leading-[0.8]">
                Build from <br />
                <span className="text-primary italic">Clear</span> <br />
                Deliverables.
              </h2>
              <p className="text-white/40 text-xl font-inter leading-relaxed max-w-xl">
                DIGITAL SWARM packages reusable software foundations, AI workflow assets and practical playbooks so buyers can evaluate exactly what they are purchasing before checkout.
              </p>

              <div className="flex gap-8 border-l border-white/10 pl-8">
                <div className="flex flex-col max-w-[200px]">
                  <span className="text-2xl font-outfit font-black text-white italic leading-none mb-2 uppercase">
                    Documented assets
                  </span>
                  <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest">
                    Paid SKUs describe the files, scope and licence on the product page.
                  </span>
                </div>
                <div className="flex flex-col max-w-[200px]">
                  <span className="text-2xl font-outfit font-black text-white italic leading-none mb-2 uppercase">
                    Private delivery
                  </span>
                  <span className="text-[10px] font-mono uppercase text-white/20 tracking-widest">
                    Eligible paid orders receive expiring access links instead of public asset URLs.
                  </span>
                </div>
              </div>

              <Link href="/about">
                <ForgeButton variant="outline" className="w-fit">
                  Learn more
                </ForgeButton>
              </Link>
            </div>

            <div className="relative">
              <GlassCard className="p-2 border-white/10 bg-white/5 aspect-4/5 rounded-4xl overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200"
                  alt="Abstract network architecture visualization"
                  fill
                  priority
                  className="object-cover grayscale opacity-60 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-transparent to-transparent opacity-80" />
                <div className="absolute top-8 left-8 p-4 glass-panel border border-white/10 rounded-xl">
                  <Terminal className="w-8 h-8 text-primary" />
                </div>
              </GlassCard>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 blur-[80px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <CommunityProtocol />

      <div className="py-20 border-t border-white/5 bg-white/5">
        <div className="container mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 invert">
          <div className="flex items-center gap-3 grayscale">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white">Cashfree Checkout</span>
          </div>
          <div className="flex items-center gap-3 grayscale">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white">Post-Payment Access</span>
          </div>
          <div className="flex items-center gap-3 grayscale">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white">Clear Product Scope</span>
          </div>
        </div>
      </div>
    </div>
  );
}
