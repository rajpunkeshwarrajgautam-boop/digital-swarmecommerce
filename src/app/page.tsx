"use client";

import { Zap, Shield, Download } from "lucide-react";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ParallaxHero } from "@/components/home/ParallaxHero";
import { ProblemSolution } from "@/components/home/ProblemSolution";
import { SocialProof } from "@/components/home/SocialProof";
import { Testimonials } from "@/components/home/Testimonials";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { LeadMagnet } from "@/components/home/LeadMagnet";
import { EmailCapture } from "@/components/home/EmailCapture";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen -mt-16 relative z-10">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden bg-background border-b border-white/5">
        <ParallaxHero />
      </section>

      {/* Problem / Solution */}
      <div className="py-16 md:py-32">
        <ProblemSolution />
      </div>

      {/* Featured Products */}
      <div className="py-16 md:py-32">
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
            <h2 className="text-5xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
              <span className="ono-text-split"><span>System</span></span><br/>
              <span className="text-primary ono-text-split"><span>Integrity</span></span>
            </h2>
            <p className="text-white/50 text-xl font-bold uppercase tracking-tighter italic max-w-xl silk-reveal-mask">
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

      {/* Lead Magnet Section */}
      <LeadMagnet />

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
