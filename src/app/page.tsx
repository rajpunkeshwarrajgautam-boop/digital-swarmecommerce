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
      <section className="relative h-[120vh] flex items-center justify-center overflow-hidden bg-background perspective-1000">
        <ParallaxHero />
      </section>

      {/* Problem / Solution */}
      <ProblemSolution />

      {/* Featured Products */}
      <FeaturedSection />

      {/* Social Proof */}
      <SocialProof />

      {/* Trust Signals: Testimonials */}
      <Testimonials />

      {/* Features Grid — jargon-free */}
      <section className="py-24 bg-secondary/30 border-t border-border/50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Download className="h-8 w-8 text-primary" />}
              title="Instant Download"
              description="Buy once, access immediately. Every purchase delivers a fast, secure download link to your inbox in seconds."
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-accent" />}
              title="30-Day Money-Back Guarantee"
              description="Secure SSL checkout via Razorpay. If a file is corrupted or broken, we fix it or refund you — no questions asked."
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Set Up in 5 Minutes"
              description="Every product ships with a clear setup guide. Go from download to working in your project within minutes."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* FAQ */}
      <HomeFAQ />

      {/* Freebie Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="relative p-12 rounded-[2.5rem] bg-zinc-950 border border-white/10 flex flex-col items-center text-center overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl bg-primary w-64 h-64 rounded-full" />
             <div className="relative z-10 space-y-6">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">Limited Offer</span>
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tight">NOT READY TO BUY?</h2>
                <p className="text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
                  Grab our <span className="text-white italic font-bold">&quot;Ultimate SaaS Launch Checklist&quot;</span> and a selection of premium UI components for ₹0.
                </p>
                <div className="pt-4">
                  <Link href="/freebies">
                    <Button variant="cyberpunk" size="lg" className="h-16 px-10 text-lg">
                      Explore Free Resources <Zap className="w-4 h-4 ml-2 fill-current" />
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

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <CardContainer className="inter-var w-full">
      <div className="neon-border-wrapper w-full h-full">
        <div className="neon-border-content p-8">
          <CardBody className="bg-transparent relative group/card w-full h-auto">
            <CardItem translateZ="50" className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary">
              {icon}
            </CardItem>
            <CardItem
              as="h3"
              translateZ="60"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              {title}
            </CardItem>
            <CardItem
              as="p"
              translateZ="40"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              {description}
            </CardItem>
          </CardBody>
        </div>
      </div>
    </CardContainer>
  );
}
