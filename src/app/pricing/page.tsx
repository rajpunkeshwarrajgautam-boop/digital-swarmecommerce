"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, CreditCard, FileArchive, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    index: "01",
    name: "Starter Kit",
    price: "₹1,499",
    suffix: "one-time",
    desc: "A downloadable ZIP centered on the Swarm paid prompt core, launch/stack audit text packs and design-system tokens.",
    features: ["swarm-paid-prompt-core.md", "Launch + stack audit text packs", "Design-system token CSS", "Portable ZIP with included readme", "Email support"],
    buttonText: "View Starter",
    link: "/product/starter-kit",
    tone: "paper",
  },
  {
    index: "02",
    name: "Professional Kit",
    price: "₹3,999",
    suffix: "one-time",
    desc: "The larger source-code kit with the same prompt core plus an adaptable React/Tailwind UI sample and bundle manifest.",
    features: ["Starter materials", "cyberpunk-mini-ui-kit.tsx sample", "Markdown prompt core", "ZIP fulfillment with manifest", "Email support"],
    buttonText: "Browse Available Products",
    link: "/products",
    tone: "purple",
  },
  {
    index: "03",
    name: "Custom Work",
    price: "Quote",
    suffix: "scoped first",
    desc: "For requirements not already covered by a listed downloadable product. Scope, deliverables, timeline and price are agreed before work begins.",
    features: ["Requirement review", "Written scope before purchase", "Deliverables agreed in advance", "Timeline agreed in advance", "Email-based project contact"],
    buttonText: "Discuss Requirements",
    link: "/contact",
    tone: "gold",
  },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export default function PricingPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#f1eee6] text-[#151515]">
      <section className="relative overflow-hidden border-b border-black/20 px-5 pb-20 pt-16 md:px-8 md:pb-28 lg:px-12">
        <div className="editorial-paper absolute inset-0 -z-20" />
        <div className="absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-[#d8b66d]/18 blur-[110px]" />
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease }}>
              <p className="editorial-kicker">PRICING / SCOPE FIRST</p>
              <h1 className="mt-7 max-w-6xl text-[clamp(4.5rem,9vw,10rem)] font-black uppercase leading-[.78] tracking-[-.08em]">
                Know what
                <span className="block text-[#725cff]">you receive.</span>
              </h1>
            </motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .12, ease }} className="border-t border-black/20 pt-6 lg:mb-2">
              <p className="text-base leading-7 text-black/58 md:text-lg">
                Listed products use one-time INR pricing. Exact license rights and included files live on each product page; custom work is quoted only after its scope is defined.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 bg-[#f1eee6] px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-5 lg:grid-cols-3">
            {tiers.map((tier, index) => (
              <motion.article
                key={tier.name}
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: .55, delay: index * .07, ease }}
                className={`flex min-h-[620px] flex-col border border-black/20 p-6 md:p-8 ${tier.tone === "purple" ? "bg-[#d9d0ff]" : tier.tone === "gold" ? "bg-[#d8b66d]" : "bg-[#f1eee6]"}`}
              >
                <div className="flex items-center justify-between border-b border-black/20 pb-5">
                  <span className="font-mono text-[9px] font-black tracking-[.2em] text-[#725cff]">{tier.index}</span>
                  <span className="font-mono text-[8px] font-black uppercase tracking-[.16em] text-black/40">{tier.suffix}</span>
                </div>

                <div className="pt-7">
                  <h2 className="text-3xl font-black uppercase tracking-[-.05em] md:text-4xl">{tier.name}</h2>
                  <div className="mt-5 text-5xl font-black tracking-[-.065em] md:text-6xl">{tier.price}</div>
                  <p className="mt-6 text-sm leading-6 text-black/55 md:text-base">{tier.desc}</p>
                </div>

                <div className="mt-8 border-t border-black/20">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={feature} className="grid grid-cols-[34px_1fr] items-start gap-3 border-b border-black/15 py-4">
                      <span className="font-mono text-[8px] font-black text-black/35">{String(featureIndex + 1).padStart(2, "0")}</span>
                      <span className="flex items-start gap-2 text-[11px] font-bold uppercase leading-5 tracking-[.07em]"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {feature}</span>
                    </div>
                  ))}
                </div>

                <Link href={tier.link} className="editorial-button editorial-button-dark mt-auto w-full justify-between pt-4">
                  {tier.buttonText} <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#151515] px-5 py-20 text-[#f1eee6] md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="editorial-kicker text-[#d8b66d]">PURCHASE FACTS</p>
              <h2 className="mt-6 text-[clamp(3.7rem,7vw,7.5rem)] font-black uppercase leading-[.82] tracking-[-.07em]">The transaction stays legible.</h2>
            </div>
            <div className="border border-white/15">
              <Fact icon={FileArchive} index="01" title="Digital delivery" text="Paid products are issued through private download links after payment verification." />
              <Fact icon={CreditCard} index="02" title="Checkout" text="Cashfree handles the payment session; the server recalculates approved catalog pricing before creating the order." />
              <Fact icon={Mail} index="03" title="Support" text="Questions and custom-scope requests are handled by email rather than an invented 24/7 hotline." />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#d9d0ff] px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="editorial-kicker">NOT SURE WHICH PRODUCT</p>
            <h2 className="mt-5 max-w-4xl text-[clamp(3.4rem,6vw,6.8rem)] font-black uppercase leading-[.83] tracking-[-.065em]">Start with the catalog, not a sales pitch.</h2>
          </div>
          <Link href="/products" className="editorial-button editorial-button-dark lg:mb-2">Compare products <ShieldCheck className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}

function Fact({ icon: Icon, index, title, text }: { icon: typeof Mail; index: string; title: string; text: string }) {
  return (
    <article className="grid gap-4 border-b border-white/15 p-6 last:border-b-0 sm:grid-cols-[50px_1fr_auto] sm:items-start md:p-7">
      <span className="font-mono text-[9px] font-black text-[#b6a7ff]">{index}</span>
      <div><h3 className="text-xl font-black uppercase tracking-[-.035em] md:text-2xl">{title}</h3><p className="mt-2 max-w-2xl text-xs leading-5 text-white/45 md:text-sm md:leading-6">{text}</p></div>
      <Icon className="h-5 w-5 text-[#d8b66d]" />
    </article>
  );
}
