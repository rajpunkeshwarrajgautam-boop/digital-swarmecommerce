"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Code2, Download, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";

const facts = [
  { index: "01", label: "Catalog", value: "Digital products", note: "AI workflows, playbooks, software kits and implementation assets.", icon: Code2 },
  { index: "02", label: "Paid delivery", value: "Private links", note: "Eligible paid orders receive time-limited access after verification.", icon: Download },
  { index: "03", label: "Checkout", value: "Cashfree", note: "Catalog pricing is recalculated by the server before an order is created.", icon: ShieldCheck },
  { index: "04", label: "Support", value: "Email", note: "Customer and project questions route through support@digitalswarm.in.", icon: Mail },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function AboutPage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#f1eee6] text-[#151515]">
      <section className="relative overflow-hidden border-b border-black/20 px-5 pb-20 pt-16 md:px-8 md:pb-28 lg:px-12">
        <div className="editorial-paper absolute inset-0 -z-20" />
        <div className="absolute -right-24 top-10 -z-10 h-96 w-96 rounded-full bg-[#725cff]/12 blur-[110px]" />
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
            <motion.div initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease }}>
              <p className="editorial-kicker">ABOUT / DIGITAL SWARM</p>
              <h1 className="mt-7 max-w-6xl text-[clamp(4.5rem,9vw,10rem)] font-black uppercase leading-[.78] tracking-[-.08em]">
                Practical digital
                <span className="block text-[#725cff]">building blocks.</span>
              </h1>
            </motion.div>
            <motion.div initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .12, ease }} className="border-t border-black/20 pt-6 lg:mb-2">
              <p className="text-base leading-7 text-black/58 md:text-lg">
                Digital Swarm packages reusable AI workflows, playbooks, source-code foundations and implementation assets so buyers can understand what they are getting before checkout.
              </p>
              <Link href="/products" className="editorial-button editorial-button-dark mt-7">Browse catalog <ArrowRight className="h-4 w-4" /></Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 bg-[#d9d0ff] px-5 py-20 md:px-8 md:py-28 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="editorial-kicker">HOW THE STORE WORKS</p>
              <h2 className="mt-6 text-[clamp(3.5rem,7vw,7.5rem)] font-black uppercase leading-[.82] tracking-[-.07em]">
                A clear path from listing
                <span className="block">to paid access.</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-6 text-black/55 md:text-base">
                The storefront is designed around product scope, checkout integrity and controlled delivery rather than invented activity counters or urgency.
              </p>
            </div>

            <div className="grid border border-black/20 md:grid-cols-2">
              {facts.map((fact, index) => {
                const Icon = fact.icon;
                return (
                  <motion.article
                    key={fact.label}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: .5, delay: index * .06, ease }}
                    className="min-h-[260px] border-b border-black/20 bg-[#f1eee6]/55 p-6 last:border-b-0 md:border-r md:odd:border-r md:[&:nth-child(2n)]:border-r-0 md:[&:nth-last-child(-n+2)]:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-black tracking-[.2em] text-[#725cff]">{fact.index}</span>
                      <Icon className="h-5 w-5 text-black/45" />
                    </div>
                    <div className="mt-16">
                      <span className="font-mono text-[8px] font-black uppercase tracking-[.18em] text-black/40">{fact.label}</span>
                      <h3 className="mt-2 text-2xl font-black uppercase tracking-[-.045em] md:text-3xl">{fact.value}</h3>
                      <p className="mt-3 text-sm leading-6 text-black/52">{fact.note}</p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#151515] px-5 py-20 text-[#f1eee6] md:px-8 md:py-28 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="editorial-kicker text-[#d8b66d]">OPERATING PRINCIPLES</p>
              <h2 className="mt-6 text-[clamp(3.7rem,7vw,7.8rem)] font-black uppercase leading-[.82] tracking-[-.07em]">Useful before impressive.</h2>
            </div>
            <div className="border-t border-white/15">
              <Principle index="01" title="No invented social proof" body="Digital Swarm does not need fabricated customer totals, stock pressure, uptime percentages or geographic claims to sell a useful deliverable." />
              <Principle index="02" title="Exact scope over hype" body="A sellable listing should identify the files, format, requirements and license that the buyer receives. If a product cannot be fulfilled as described, it should not be sold." />
              <Principle index="03" title="Server-authoritative commerce" body="The browser is not trusted as the source of truth for the catalog price. Checkout validates approved products and recalculates the order amount on the server." />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#d8b66d] px-5 py-20 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <p className="editorial-kicker">NEXT STEP</p>
            <h2 className="mt-5 max-w-4xl text-[clamp(3.5rem,7vw,7.5rem)] font-black uppercase leading-[.82] tracking-[-.07em]">Inspect a product for yourself.</h2>
          </div>
          <div className="flex flex-wrap gap-3 lg:pb-2">
            <Link href="/products" className="editorial-button editorial-button-dark">Open catalog <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/freebies" className="editorial-button">Try free assets</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Principle({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <article className="grid gap-4 border-b border-white/15 py-7 sm:grid-cols-[55px_1fr]">
      <span className="font-mono text-[9px] font-black text-[#b6a7ff]">{index}</span>
      <div>
        <h3 className="text-2xl font-black uppercase tracking-[-.04em] md:text-3xl">{title}</h3>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/48 md:text-base">{body}</p>
      </div>
    </article>
  );
}
