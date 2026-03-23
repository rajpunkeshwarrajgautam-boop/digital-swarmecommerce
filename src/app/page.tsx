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
    <div className="flex flex-col min-h-screen relative z-10 w-full">
      {/* Hero Section */}
      <ParallaxHero />

      {/* Problem / Solution */}
      <ProblemSolution />

      {/* Featured Products */}
      <FeaturedSection />

      {/* Social Proof */}
      <SocialProof />

      {/* Trust Signals: Testimonials */}
      <Testimonials />

      {/* Soft UI Features Grid */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container px-6 mx-auto relative z-10 w-full max-w-7xl">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
              Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Excellence</span>
            </h2>
            <p className="text-gray-500 text-lg font-medium">
              Built for speed. Audited for scale. Digital Swarm provides the architectural skeleton for the next generation of software.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Download className="h-8 w-8 text-blue-500" />}
              title="Instant Delivery"
              description="Eliminate latency. Direct architectural sync is processed through secure protocols and delivered instantly."
              bgColor="bg-blue-50"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-pink-500" />}
              title="Hardened Code"
              description="Every blueprint is stress-tested for production environments. We do not distribute insecure boilerplate."
              bgColor="bg-pink-50"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-amber-500" />}
              title="Rapid Launch"
              description="Bypass documentation fatigue. Our frameworks include deployment-ready manifests for minute-one launches."
              bgColor="bg-amber-50"
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
  const bg = bgColor || "bg-gray-50";
  return (
    <div className="clay-card p-8 group">
      <div className={`mb-6 flex items-center justify-center p-4 rounded-2xl w-16 h-16 ${bg} group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{description}</p>
    </div>
  );
}
