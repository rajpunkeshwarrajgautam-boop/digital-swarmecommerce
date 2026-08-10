"use client";

import { motion } from "framer-motion";
import { Check, Shield, Mail, FileArchive, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const tiers = [
  {
    name: "Starter Kit",
    price: "₹1,499",
    suffix: "one-time",
    desc: "A downloadable ZIP centered on the Swarm paid prompt core, launch/stack audit text packs and design-system tokens.",
    features: [
      "swarm-paid-prompt-core.md",
      "Launch + stack audit text packs",
      "Design-system token CSS",
      "Portable ZIP with included readme",
      "Email support"
    ],
    buttonText: "View Starter",
    link: "/product/starter-kit",
    highlight: false
  },
  {
    name: "Professional Kit",
    price: "₹3,999",
    suffix: "one-time",
    desc: "The larger source-code kit with the same prompt core plus an adaptable React/Tailwind UI sample and bundle manifest.",
    features: [
      "Starter materials",
      "cyberpunk-mini-ui-kit.tsx sample",
      "Markdown prompt core",
      "ZIP fulfillment with manifest",
      "Email support"
    ],
    buttonText: "View Professional",
    link: "/product/nextjs-saas-kit",
    highlight: true
  },
  {
    name: "Custom Work",
    price: "Quote",
    suffix: "scoped first",
    desc: "For requirements that are not already covered by a listed downloadable product. Scope, deliverables, timeline and price are agreed before work begins.",
    features: [
      "Requirement review",
      "Written scope before purchase",
      "Deliverables agreed in advance",
      "Timeline agreed in advance",
      "Email-based project contact"
    ],
    buttonText: "Discuss Requirements",
    link: "/contact",
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-20 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pricing & scope</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none">
            Know what you <span className="text-primary">receive</span>.
          </motion.h1>
          <p className="text-white/45 text-sm font-sans leading-7 max-w-2xl mx-auto">
            Listed products use one-time pricing. Exact license rights and included files are stated on each product page; custom work is quoted only after the scope is defined.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {tiers.map((tier, i) => (
            <motion.div key={tier.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`relative flex flex-col p-9 rounded-2xl border transition-transform hover:-translate-y-1 ${tier.highlight ? "bg-white text-black border-white shadow-[0_20px_70px_rgba(216,179,106,.12)]" : "bg-white/[0.035] border-white/10 text-white"}`}>
              {tier.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-black px-4 py-1 text-[9px] font-black uppercase tracking-widest">Larger bundle</div>}
              <div className="mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">{tier.name}</h3>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">{tier.price}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${tier.highlight ? "text-black/40" : "text-white/35"}`}>{tier.suffix}</span>
                </div>
              </div>

              <p className={`text-sm font-sans mb-8 leading-6 ${tier.highlight ? "text-black/60" : "text-white/50"}`}>{tier.desc}</p>

              <div className="space-y-4 mb-10 flex-1">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? "text-black" : "text-primary"}`} />
                    <span className="text-[10px] font-black uppercase tracking-wider leading-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Link href={tier.link}>
                <Button className={`w-full py-6 text-sm font-black uppercase tracking-widest ${tier.highlight ? "bg-black text-white hover:bg-primary hover:text-black" : "bg-primary text-black hover:bg-white"}`}>
                  {tier.buttonText}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl border border-white/8 bg-white/[0.025] p-8">
          <Fact icon={FileArchive} title="Digital delivery" text="Paid products are issued through private download links after payment verification." />
          <Fact icon={CreditCard} title="Checkout" text="Cashfree handles the payment session; the server recalculates catalog pricing before creating an order." />
          <Fact icon={Mail} title="Support" text="Questions and custom-scope requests are handled by email rather than an invented 24/7 hotline." />
        </div>
      </div>
    </div>
  );
}

function Fact({ icon: Icon, title, text }: { icon: typeof Mail; title: string; text: string }) {
  return (
    <div className="p-5">
      <Icon className="h-5 w-5 text-primary mb-4" />
      <h2 className="text-sm font-black uppercase mb-2">{title}</h2>
      <p className="text-white/40 text-xs font-sans leading-6">{text}</p>
    </div>
  );
}
