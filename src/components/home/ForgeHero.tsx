"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { useForgeStore } from "@/lib/forge-store";
import { useMemoryStore } from "@/lib/memory/MemoryStore";
import { getABVariant, trackABImpression, type ABVariant } from "@/lib/abTest";
import { trackHomepageHeroCta, trackHomepageHeroImpression } from "@/lib/web-analytics";
import { SwarmCore3D } from "@/components/home/SwarmCore3D";

export const HOMEPAGE_HERO_AB_KEY = "homepage_hero";

export const ForgeHero = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const toggleConcierge = useForgeStore((state) => state.toggleConcierge);
  const addInterest = useMemoryStore((state) => state.addInterest);
  const [heroVariant, setHeroVariant] = useState<ABVariant>("A");
  const [personalization, setPersonalization] = useState<{ market?: string; intent?: string }>({});

  useLayoutEffect(() => {
    const variant = getABVariant(HOMEPAGE_HERO_AB_KEY);
    setHeroVariant(variant);
    trackABImpression(HOMEPAGE_HERO_AB_KEY, variant);
    trackHomepageHeroImpression(HOMEPAGE_HERO_AB_KEY, variant);
  }, []);

  useEffect(() => {
    const cookies = document.cookie.split("; ").reduce((acc: Record<string, string>, current) => {
      const index = current.indexOf("=");
      if (index > 0) acc[current.slice(0, index)] = decodeURIComponent(current.slice(index + 1));
      return acc;
    }, {});
    setPersonalization({ market: cookies.market_hint, intent: cookies.intent_ref });
  }, []);

  useEffect(() => {
    addInterest("HOME_PROTOCOL");
  }, [addInterest]);

  const isIndia = personalization.market === "IN";
  const isB = heroVariant === "B";
  const headline = isB ? "Build faster. Launch sharper." : "Digital assets for people who ship.";
  const subcopy = isIndia
    ? "AI workflow assets, playbooks and software kits with explicit deliverables, INR pricing, clear licensing and private post-payment delivery."
    : "AI workflow assets, playbooks and software kits with explicit deliverables, INR pricing, clear licensing and private post-payment delivery.";

  return (
    <section className="hero-section relative isolate overflow-hidden border-b border-white/6 bg-[#050509] py-16 md:py-24 lg:py-28">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_10%,rgba(224,191,117,.10),transparent_28%),radial-gradient(circle_at_78%_32%,rgba(131,99,255,.12),transparent_27%),linear-gradient(180deg,#050509_0%,#09090f_70%,#050509_100%)]" />
      <div className="elite-grid absolute inset-0 -z-10 opacity-45" />
      <div className="absolute left-1/2 top-[-20%] -z-10 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-primary/5 blur-[130px]" />

      <div className="container mx-auto grid min-h-[72svh] max-w-[1500px] grid-cols-1 items-center gap-10 px-5 md:px-8 lg:grid-cols-[1.02fr_.98fr] lg:gap-4">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-3xl"
        >
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-2 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary/90">
              {personalization.intent ? `Curated for ${personalization.intent}` : "Digital Swarm / Verified Catalog"}
            </span>
          </div>

          <h1 className="max-w-[980px] text-[clamp(3.4rem,7.6vw,8.4rem)] font-black uppercase italic leading-[0.83] tracking-[-0.065em] text-[#F6F1E8]">
            {headline.split(" ").slice(0, 2).join(" ")} <br />
            <span className="metal-text">{headline.split(" ").slice(2).join(" ")}</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-white/55 md:text-lg md:leading-8">
            {subcopy}
          </p>

          <div className="hero-cta-group mt-9 flex flex-wrap items-center gap-4">
            <ForgeButton
              size="lg"
              onClick={() => {
                trackHomepageHeroCta(HOMEPAGE_HERO_AB_KEY, heroVariant, "primary_catalog", "Explore products");
                router.push("/products");
              }}
            >
              Explore products <ArrowUpRight className="h-4 w-4" />
            </ForgeButton>
            <ForgeButton
              variant="outline"
              size="lg"
              onClick={() => {
                trackHomepageHeroCta(HOMEPAGE_HERO_AB_KEY, heroVariant, "secondary_product_finder", "Product finder");
                toggleConcierge();
              }}
            >
              <Search className="h-4 w-4" /> Product finder
            </ForgeButton>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
            {["Cashfree checkout", "Private digital delivery", "Clear license terms"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-primary" /> {item}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30">
            <Link href="/freebies" className="transition-colors hover:text-primary">Try free assets</Link>
            <span className="h-3 w-px bg-white/15" />
            <Link href="/refund" className="transition-colors hover:text-primary">Refund policy</Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:-mr-8"
        >
          <SwarmCore3D />
          <div className="pointer-events-none absolute inset-x-[12%] bottom-[7%] flex justify-between font-mono text-[8px] uppercase tracking-[0.25em] text-white/20">
            <span>AI workflows</span><span>Commerce core</span><span>Private delivery</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
