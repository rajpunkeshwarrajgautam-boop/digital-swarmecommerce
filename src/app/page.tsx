"use client";

import { Zap, Shield, Download } from "lucide-react";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ParallaxHero } from "@/components/home/ParallaxHero";
import { ProblemSolution } from "@/components/home/ProblemSolution";
import { FieldReports } from "@/components/home/FieldReports";
import { HowItWorks } from "@/components/home/HowItWorks";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { LeadMagnet } from "@/components/home/LeadMagnet";
import { EmailCapture } from "@/components/home/EmailCapture";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative z-10 w-full">
      {/* Hero Section */}
      <ParallaxHero />

      {/* Problem / Solution */}
      <ProblemSolution />

      {/* Featured Products */}
      <FeaturedSection />

      {/* Field Reports (Social Proof + Testimonials) */}
      <FieldReports />

      {/* Soft UI Features Grid */}
      <section className="py-24 bg-[#0a0c10] relative overflow-hidden border-t border-white/5">
        <div className="container px-6 mx-auto relative z-10 w-full max-w-7xl">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
              Engineering <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">Excellence</span>
            </h2>
            <p className="text-gray-400 text-lg font-medium">
              Built for speed. Audited for scale. Digital Swarm provides the architectural skeleton for the next generation of software.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Download className="h-8 w-8 text-cyan-400" />}
              title="Instant Delivery"
              description="Eliminate latency. Direct architectural sync is processed through secure protocols and delivered instantly."
              bgColor="bg-cyan-500/10"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-blue-500" />}
              title="Hardened Code"
              description="Every blueprint is stress-tested for production environments. We do not distribute insecure boilerplate."
              bgColor="bg-blue-500/10"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-indigo-400" />}
              title="Rapid Launch"
              description="Bypass documentation fatigue. Our frameworks include deployment-ready manifests for minute-one launches."
              bgColor="bg-indigo-500/10"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

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

function FeatureCard({ icon, title, description, bgColor }: { icon: React.ReactNode; title: string; description: string; bgColor?: string }) {
  const bg = bgColor || "bg-white/5";
  return (
    <div className="bg-[#0f1115] backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-cyan-500/30 transition-all group hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className={`${bg} mb-6 flex items-center justify-center p-4 rounded-2xl w-16 h-16 border border-white/5 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-400 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
