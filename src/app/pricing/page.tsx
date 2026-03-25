"use client";

import { Check, Zap, Shield, Crown, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Starter",
    price: "0",
    description: "Essential protocols for solo developers and quick prototypes.",
    features: [
      "Access to Free Boilerplates",
      "Community Discord Access",
      "Standard Documentation",
      "Public License"
    ],
    cta: "Explore Freebies",
    href: "/freebies",
    popular: false,
    color: "secondary"
  },
  {
    name: "Pro",
    price: "2,999",
    description: "The gold standard for production-grade SaaS and AI agents.",
    features: [
      "Access to All Premium Templates",
      "Priority Email Support",
      "Commercial License",
      "Lifetime Updates",
      "Advanced Deployment Guides",
      "Private Repo Access"
    ],
    cta: "Get Full Access",
    href: "/products",
    popular: true,
    color: "primary"
  },
  {
    name: "Elite",
    price: "Custom",
    description: "Enterprise-grade architecture and dedicated engineering support.",
    features: [
      "Custom Implementation",
      "1-on-1 Architecture Review",
      "Enterprise White-labeling",
      "Dedicated Slack Channel",
      "Security Audits",
      "SLA Guarantees"
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    color: "secondary"
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background relative pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto max-w-4xl"
        >
          <span className="inline-block bg-primary/10 text-primary border border-primary/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Architectural Pricing
          </span>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.85]">
            Invest in <span className="text-primary underline decoration-4 underline-offset-8">Velocity</span>
          </h1>
          <p className="text-xl text-muted-foreground font-bold tracking-wide max-w-2xl mx-auto">
            Stop rebuilding the same primitives. Choose a protocol that scales your engineering empire from day one.
          </p>
        </motion.div>
      </section>

      {/* Pricing Grid */}
      <section className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative flex flex-col p-8 rounded-[2.5rem] border-2 transition-all duration-500 ${
                tier.popular 
                  ? "bg-secondary text-white border-primary shadow-[0_40px_80px_rgba(255,107,53,0.15)] scale-105 z-20" 
                  : "bg-white text-secondary border-secondary/5 hover:border-secondary/20 shadow-sm"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-tighter">
                  Most Popular Protocol
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{tier.name}</h3>
                <p className={`text-sm font-bold ${tier.popular ? "text-white/60" : "text-muted-foreground"}`}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-10 flex items-baseline gap-1">
                <span className="text-sm font-black italic">₹</span>
                <span className="text-5xl font-black italic tracking-tighter">{tier.price}</span>
                {tier.price !== "Custom" && <span className="text-sm font-bold opacity-50">/once</span>}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${tier.popular ? "text-primary" : "text-primary"}`} />
                    <span className="text-sm font-bold tracking-wide leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={tier.href} className="w-full">
                <Button 
                  className={`w-full h-14 rounded-2xl font-black uppercase italic tracking-widest text-xs transition-all ${
                    tier.popular 
                      ? "bg-primary text-black hover:bg-white hover:text-black border-2 border-primary" 
                      : "bg-secondary text-white hover:bg-primary hover:text-black border-2 border-transparent"
                  }`}
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="mt-24 container mx-auto px-6 text-center max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-y border-secondary/5">
          <div className="space-y-2">
            <Zap className="w-8 h-8 text-primary mx-auto" />
            <h4 className="font-black italic uppercase text-xs tracking-widest">Instant Delivery</h4>
            <p className="text-[10px] font-bold text-muted-foreground">Digital files available immediately after verify.</p>
          </div>
          <div className="space-y-2">
            <Shield className="w-8 h-8 text-[#a855f7] mx-auto" />
            <h4 className="font-black italic uppercase text-xs tracking-widest">Secure Payments</h4>
            <p className="text-[10px] font-bold text-muted-foreground">Encryption protected via Stripe & Razorpay.</p>
          </div>
          <div className="space-y-2">
            <Star className="w-8 h-8 text-blue-500 mx-auto" />
            <h4 className="font-black italic uppercase text-xs tracking-widest">4.9/5 Rating</h4>
            <p className="text-[10px] font-bold text-muted-foreground">Trusted by 2,000+ elite engineers globally.</p>
          </div>
          <div className="space-y-2">
            <Crown className="w-8 h-8 text-amber-500 mx-auto" />
            <h4 className="font-black italic uppercase text-xs tracking-widest">Value Guarantee</h4>
            <p className="text-[10px] font-bold text-muted-foreground">Save 40-80 hours of development per kit.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
