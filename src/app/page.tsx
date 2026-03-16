"use client";

import { Zap, Shield, Download } from "lucide-react";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ParallaxHero } from "@/components/home/ParallaxHero";
import { ProblemSolution } from "@/components/home/ProblemSolution";
import { SocialProof } from "@/components/home/SocialProof";
import { Testimonials } from "@/components/home/Testimonials";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { EmailCapture } from "@/components/home/EmailCapture";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden bg-background border-b border-border/20">
        <ParallaxHero />
      </section>

      {/* Problem / Solution */}
      <div className="py-16 md:py-32">
        <ProblemSolution />
      </div>

      {/* Featured Products */}
      <div className="py-16 md:py-32 bg-secondary/10">
        <FeaturedSection />
      </div>

      {/* Social Proof */}
      <div className="py-16 md:py-32">
        <SocialProof />
      </div>

      {/* Trust Signals: Testimonials */}
      <div className="py-16 md:py-32">
        <Testimonials />
      </div>

      {/* Benefits Grid — PlanetOno Brutalist Style */}
      <section className="py-40 bg-background text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-swarm-pattern opacity-10" />
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-left mb-24 max-w-4xl">
            <h2 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8 italic">
              System<br/>
              <span className="text-primary">Integrity</span>
            </h2>
            <p className="text-white/50 text-xl font-bold uppercase tracking-tighter italic max-w-xl">
              Engineered for speed. Audited for scale. Digital Swarm provides the architectural skeleton for the next generation of software.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-white/10">
            <FeatureCard
              icon={<Download className="h-12 w-12 text-primary" />}
              title="Instant Pulse"
              description="Eliminate latency. Direct architectural sync is processed through secure protocols and delivered instantly."
            />
            <FeatureCard
              icon={<Shield className="h-12 w-12 text-primary" />}
              title="Hardened Code"
              description="Every blueprint is stress-tested for production environments. We do not distribute insecure boilerplate."
            />
            <FeatureCard
              icon={<Zap className="h-12 w-12 text-primary" />}
              title="Rapid Sync"
              description="Bypass documentation fatigue. Our frameworks include deployment-ready manifests for minute-one launches."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <div className="py-16 md:py-32 bg-background">
        <HowItWorks />
      </div>

      {/* FAQ */}
      <HomeFAQ />

      {/* Freebie Banner */}
      <section className="py-40 relative overflow-hidden bg-background">
        <div className="container px-6 mx-auto">
          <div className="relative p-16 bg-zinc-950 border-4 border-white flex flex-col items-start text-left overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-20 blur-3xl bg-primary w-96 h-96 rounded-none translate-x-1/2 -translate-y-1/2" />
             <div className="relative z-10 space-y-10 max-w-3xl">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic border-b-2 border-primary pb-2">Active Transmission</span>
                <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.8] mb-6">
                  Zero Cost<br/>
                  <span className="text-white">Mainframe</span>
                </h2>
                <p className="text-2xl text-white/50 font-bold uppercase italic tracking-tighter leading-tight">
                  Access the <span className="text-white">&quot;SaaS Launch Manifest&quot;</span> and architectural blueprints for ₹0. Immediate sync available.
                </p>
                <div className="pt-8">
                  <Link href="/freebies">
                    <Button className="h-20 px-12 bg-white text-black font-black uppercase tracking-widest rounded-none text-xl hover:bg-primary transition-all duration-300 shadow-[12px_12px_0px_#000]">
                      Sync Free Resources <Zap className="w-6 h-6 ml-4" />
                    </Button>
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Email Capture + Final CTA */}
      <EmailCapture />
    </div>
  );
}

// FeatureCard component for the Benefits Grid

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-12 border-r border-b border-white/10 group hover:bg-white/5 transition-all duration-300">
      <div className="mb-8 p-4 bg-zinc-950 border border-white/10 w-fit">
        {icon}
      </div>
      <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 leading-none">{title}</h3>
      <p className="text-white/40 font-bold uppercase italic tracking-tighter text-sm max-w-xs">{description}</p>
    </div>
  );
}
