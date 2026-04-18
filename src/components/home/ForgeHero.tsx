"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { Cpu, Zap, Shield, Sparkles } from "lucide-react";
import { useForgeStore } from "@/lib/forge-store";
import { useMemoryStore } from "@/lib/memory/MemoryStore";
import { getABVariant, trackABImpression, type ABVariant } from "@/lib/abTest";
import { trackHomepageHeroCta, trackHomepageHeroImpression } from "@/lib/web-analytics";

/** Persisted key for homepage hero copy / CTA experiment (see ExitIntentABRouter pattern). */
export const HOMEPAGE_HERO_AB_KEY = "homepage_hero";

export const ForgeHero = () => {
  const router = useRouter();
  const toggleConcierge = useForgeStore((state) => state.toggleConcierge);
  const addInterest = useMemoryStore((state) => state.addInterest);

  /** Default A for SSR + first client frame; real assignment applied in useLayoutEffect before paint. */
  const [heroVariant, setHeroVariant] = useState<ABVariant>("A");

  useLayoutEffect(() => {
    const v = getABVariant(HOMEPAGE_HERO_AB_KEY);
    setHeroVariant(v);
    trackABImpression(HOMEPAGE_HERO_AB_KEY, v);
    trackHomepageHeroImpression(HOMEPAGE_HERO_AB_KEY, v);
  }, []);

  /** Empty on SSR + first paint; cookies applied after mount to avoid hydration text mismatch (#418). */
  const [personalization, setPersonalization] = useState<{ market?: string; intent?: string }>({});

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc: Record<string, string>, curr) => {
      const [key, value] = curr.split("=");
      acc[key] = value;
      return acc;
    }, {});
    setPersonalization({
      market: cookies.market_hint,
      intent: cookies.intent_ref,
    });
  }, []);

  useEffect(() => {
    // Trace Entry Intent
    addInterest('HOME_PROTOCOL');
  }, [addInterest]);

  const isLocalMarket = personalization.market === 'IN';
  const hasIntent = !!personalization.intent;

  const isB = heroVariant === "B";

  return (
    <section className="relative min-h-svh w-full flex items-center justify-center overflow-hidden bg-[#0a0a0f] py-40">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[100px] rounded-full" />
        
        {/* Technical Grid/Lines Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* Launch Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">
            {hasIntent
              ? `Welcome Node ${personalization.intent}`
              : isB
                ? "Secure checkout · Instant delivery"
                : "Premium Assets Now Live"}
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-outfit font-black italic tracking-tighter leading-[0.8] uppercase mb-8"
        >
          {isB ? (
            <>
              {isLocalMarket ? "Go live" : "Ship"} <br />
              <span className="text-white/20">Premium</span> <br />
              <span className="text-primary glow-text">Digital products</span>
            </>
          ) : (
            <>
              {isLocalMarket ? "Launch" : "Build"} <br />
              <span className="text-white/20">Elite Digital</span> <br />
              <span className="text-primary glow-text">Experiences</span>
            </>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl text-lg md:text-xl text-white/40 font-inter mb-12"
        >
          {isB
            ? isLocalMarket
              ? "Curated assets and stacks built for Indian teams—instant download, modular upgrades, checkout you can trust."
              : "Curated digital assets and implementation patterns for teams optimizing for speed, quality, and conversion."
            : isLocalMarket
              ? "Zero-friction deployment for India's high-performance developer stacks—hardened, modular, and AI-native architecture."
              : "Global architectural patterns for the next era of software: modular, AI-native stacks for elite engineers."}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-24"
        >
          <ForgeButton
            variant="primary"
            onClick={() => {
              const label = isB ? "Browse catalog" : "Shop the Store";
              trackHomepageHeroCta(HOMEPAGE_HERO_AB_KEY, heroVariant, "primary_catalog", label);
              router.push("/products");
            }}
          >
            {isB ? "Browse catalog" : "Shop the Store"}
          </ForgeButton>
          <ForgeButton
            variant="outline"
            onClick={() => {
              trackHomepageHeroCta(HOMEPAGE_HERO_AB_KEY, heroVariant, "secondary_concierge", "AI Assistant");
              toggleConcierge();
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assistant
          </ForgeButton>
          <Link
            href="/freebies"
            onClick={() =>
              trackHomepageHeroCta(HOMEPAGE_HERO_AB_KEY, heroVariant, "tertiary_freebies", "Free downloads")
            }
            className="text-[11px] font-mono font-black uppercase tracking-[0.25em] text-white/40 hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Free downloads →
          </Link>
        </motion.div>

        {/* Quick Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <InsightCard
            icon={<Cpu className="w-5 h-5 text-accent" />}
            label="Delivery"
            value="Instant"
            delay={0.8}
          />
          <InsightCard
            icon={<Zap className="w-5 h-5 text-primary" />}
            label="Checkout"
            value="Secure"
            delay={0.9}
          />
          <InsightCard
            icon={<Shield className="w-5 h-5 text-green-400" />}
            label="Listings"
            value="Honest"
            delay={1.0}
          />
        </div>
        <p className="mt-8 max-w-xl mx-auto text-center text-[10px] font-mono uppercase tracking-widest text-white/25">
          We do not display fabricated customer counts — read each product page for exact deliverables.
        </p>
      </div>
    </section>
  );
};

const InsightCard = ({ icon, label, value, delay }: { icon: React.ReactNode, label: string, value: string, delay: number }) => (
  <GlassCard delay={delay} className="flex flex-col items-center gap-2 text-center py-8">
    <div className="p-3 bg-white/5 rounded-full mb-2">
      {icon}
    </div>
    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">{label}</span>
    <span className="text-2xl font-outfit font-black italic text-white uppercase">{value}</span>
  </GlassCard>
);
