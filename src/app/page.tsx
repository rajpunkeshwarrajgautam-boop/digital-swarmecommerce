"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Code2,
  FileText,
  Layers3,
  LockKeyhole,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { FeaturedSection } from "@/components/home/FeaturedSection";

const ease = [0.16, 1, 0.3, 1] as const;

const benefits = [
  {
    index: "01",
    title: "Explicit deliverables",
    body: "Every sellable listing states the files, format, dependencies and license before checkout.",
    icon: FileText,
  },
  {
    index: "02",
    title: "Server-checked pricing",
    body: "The checkout route recalculates the approved catalog price instead of trusting values from the browser.",
    icon: ShieldCheck,
  },
  {
    index: "03",
    title: "Private paid delivery",
    body: "Eligible paid orders receive time-limited private access rather than a public download URL.",
    icon: LockKeyhole,
  },
  {
    index: "04",
    title: "Reusable foundations",
    body: "Use the assets as starting systems, references, prompts, workflows or implementation accelerators.",
    icon: Layers3,
  },
];

const storyFrames = [
  { label: "DISCOVER", title: "Find the right starting point", note: "Browse by outcome, format and use case." },
  { label: "INSPECT", title: "See exactly what is included", note: "Scope, requirements and licensing are visible before purchase." },
  { label: "CHECKOUT", title: "Pay through the gateway", note: "The server validates the catalog and order amount." },
  { label: "RECEIVE", title: "Get private digital access", note: "Paid delivery is tied to the verified order." },
];

export default function Home() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="editorial-swarm overflow-hidden bg-[#f1eee6] text-[#151515]">
      <section className="relative min-h-[100svh] overflow-hidden border-b border-black/15 px-5 pb-12 pt-24 md:px-8 md:pb-16 md:pt-28 lg:px-12 lg:pt-32">
        <div className="editorial-paper absolute inset-0 -z-20" />
        <div className="absolute -right-[12vw] top-[14vh] -z-10 h-[42vw] w-[42vw] rounded-full bg-[#7764ff]/12 blur-[100px]" />
        <div className="absolute -left-[8vw] bottom-[4vh] -z-10 h-[30vw] w-[30vw] rounded-full bg-[#d4aa52]/14 blur-[100px]" />

        <div className="mx-auto flex min-h-[calc(100svh-9rem)] max-w-[1600px] flex-col justify-between">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[.72fr_1.55fr_.73fr] lg:items-start">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease }}
              className="lg:pt-5"
            >
              <p className="editorial-kicker">01 / INPUT</p>
              <h1 className="editorial-side-word mt-6">FROM</h1>
              <p className="mt-5 max-w-[19rem] text-sm leading-6 text-black/55">
                Raw ideas, repetitive work and half-built systems are the input. Digital Swarm turns that starting point into something you can inspect and use.
              </p>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.08, ease }}
              className="relative flex min-h-[56vh] items-center justify-center"
            >
              <SignalMachine reduceMotion={Boolean(reduceMotion)} />
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease }}
              className="text-left lg:pt-5 lg:text-right"
            >
              <p className="editorial-kicker lg:justify-end">03 / OUTPUT</p>
              <h2 className="editorial-side-word mt-6 lg:text-right">TO</h2>
              <p className="mt-5 max-w-[19rem] text-sm leading-6 text-black/55 lg:ml-auto">
                A clearer path to a workflow, playbook, code foundation or digital system—with the scope stated before you buy.
              </p>
            </motion.div>
          </div>

          <div className="mt-10 grid gap-7 border-t border-black/15 pt-7 lg:grid-cols-[1.4fr_.8fr] lg:items-end">
            <div>
              <p className="editorial-kicker">DIGITAL SWARM / VERIFIED CATALOG</p>
              <h2 className="mt-4 max-w-5xl text-[clamp(3.3rem,8vw,8.8rem)] font-black uppercase leading-[.82] tracking-[-.075em]">
                From raw signal
                <span className="block text-[#725cff]">to shippable system.</span>
              </h2>
            </div>
            <div className="lg:pb-2">
              <p className="max-w-xl text-base leading-7 text-black/60 md:text-lg">
                AI workflow assets, software kits and practical playbooks designed around explicit deliverables, INR checkout and private post-payment access.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/products" className="editorial-button editorial-button-dark">
                  Browse products <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/search" className="editorial-button">
                  Product finder <Search className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <a href="#story" className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-black uppercase tracking-[.22em] text-black/45 md:flex">
          Scroll through the system <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </a>
      </section>

      <section id="story" className="relative border-b border-black/15 bg-[#171717] px-5 py-24 text-[#f1eee6] md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <p className="editorial-kicker text-[#b6a7ff]">THE DIGITAL SWARM METHOD</p>
              <h2 className="mt-7 text-[clamp(3.5rem,7vw,8rem)] font-black uppercase leading-[.84] tracking-[-.07em]">
                One path.
                <span className="block text-[#d8b66d]">Four clear steps.</span>
              </h2>
              <p className="mt-7 max-w-md text-base leading-7 text-white/55">
                The experience is designed to make the product, price and delivery path legible instead of hiding them behind vague marketing language.
              </p>
            </div>

            <div className="space-y-5">
              {storyFrames.map((frame, index) => (
                <motion.article
                  key={frame.label}
                  initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.65, delay: index * 0.06, ease }}
                  className="group grid min-h-[260px] overflow-hidden border border-white/15 bg-[#202020] md:grid-cols-[.9fr_1.1fr]"
                >
                  <div className="relative flex items-center justify-center overflow-hidden border-b border-white/10 p-8 md:border-b-0 md:border-r">
                    <StoryGraphic index={index} />
                  </div>
                  <div className="flex flex-col justify-between p-7 md:p-10">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-[10px] font-black tracking-[.25em] text-[#b6a7ff]">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-mono text-[9px] font-bold uppercase tracking-[.22em] text-white/25">{frame.label}</span>
                    </div>
                    <div>
                      <h3 className="max-w-xl text-3xl font-black uppercase leading-[.95] tracking-[-.045em] text-[#f1eee6] md:text-5xl">{frame.title}</h3>
                      <p className="mt-5 max-w-lg text-sm leading-6 text-white/45 md:text-base">{frame.note}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/15 bg-[#f1eee6] px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
            <div>
              <p className="editorial-kicker">WHAT YOU GET</p>
              <h2 className="editorial-spaced-title mt-8">WHEN YOU BUILD WITH THE SWARM</h2>
            </div>

            <div className="border-t border-black/20">
              {benefits.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.index}
                    initial={reduceMotion ? false : { opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: index * 0.05, ease }}
                    className="grid gap-6 border-b border-black/20 py-8 sm:grid-cols-[80px_1fr_auto] sm:items-start"
                  >
                    <span className="font-mono text-sm font-black text-[#725cff]">{item.index}</span>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-[-.035em] md:text-3xl">{item.title}</h3>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55 md:text-base">{item.body}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/20 bg-white/35">
                      <Icon className="h-5 w-5" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-black/15 bg-[#d9d0ff] px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="editorial-noise absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-[1600px]">
          <div className="flex flex-col justify-between gap-8 border-b border-black/20 pb-10 lg:flex-row lg:items-end">
            <div>
              <p className="editorial-kicker">THE CATALOG</p>
              <h2 className="mt-5 text-[clamp(3.8rem,8vw,9rem)] font-black uppercase leading-[.8] tracking-[-.075em]">
                Available in
                <span className="block">multiple system types.</span>
              </h2>
            </div>
            <p className="max-w-md pb-2 text-sm leading-6 text-black/55 md:text-base">
              Choose the format that fits the work: software foundations, AI agents, playbooks, prompts and focused digital assets.
            </p>
          </div>

          <div className="editorial-product-zone pt-12">
            <FeaturedSection />
          </div>
        </div>
      </section>

      <section className="grid border-b border-black/15 bg-[#f1eee6] lg:grid-cols-2">
        <motion.article
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative min-h-[70vh] overflow-hidden border-b border-black/15 p-6 md:p-10 lg:border-b-0 lg:border-r lg:p-14"
        >
          <div className="flex h-full flex-col justify-between gap-16">
            <div>
              <p className="editorial-kicker">USE IT AS</p>
              <h2 className="mt-5 text-[clamp(3.7rem,7vw,7.5rem)] font-black uppercase leading-[.82] tracking-[-.07em]">A starting point.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-black/55">Begin with a documented foundation instead of a blank page, then adapt it to your own stack, process or market.</p>
            </div>
            <BlueprintMotion />
          </div>
        </motion.article>

        <motion.article
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="relative min-h-[70vh] overflow-hidden bg-[#d8b66d] p-6 md:p-10 lg:p-14"
        >
          <div className="flex h-full flex-col justify-between gap-16">
            <div>
              <p className="editorial-kicker">OR USE IT AS</p>
              <h2 className="mt-5 text-[clamp(3.7rem,7vw,7.5rem)] font-black uppercase leading-[.82] tracking-[-.07em]">An operating layer.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-black/60">Drop a workflow, agent or playbook into an existing process and use it as a repeatable layer for specific work.</p>
            </div>
            <OrbitMotion />
          </div>
        </motion.article>
      </section>

      <section className="relative overflow-hidden bg-[#151515] px-5 py-24 text-[#f1eee6] md:px-8 md:py-32 lg:px-12">
        <div className="absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#725cff]/20 blur-[110px]" />
        <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="editorial-kicker text-[#b6a7ff]">YOUR DIGITAL SWARM VAULT</p>
            <h2 className="mt-6 text-[clamp(4rem,8vw,8.5rem)] font-black uppercase leading-[.8] tracking-[-.075em]">
              Keep paid assets
              <span className="block text-[#d8b66d]">attached to your account.</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/50 md:text-lg">
              Sign in to view eligible licensed assets tied to your customer account and revisit what you have purchased.
            </p>
            <Link href="/dashboard/assets" className="editorial-button mt-8 border-white/25 text-white hover:bg-white hover:text-black">
              Open asset vault <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <VaultStack />
        </div>
      </section>
    </div>
  );
}

function SignalMachine({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative aspect-square w-full max-w-[680px]">
      <div className="absolute inset-[4%] rounded-full border border-black/15" />
      <div className="absolute inset-[15%] rounded-full border border-dashed border-black/20 signal-orbit" />
      <div className="absolute inset-[27%] rounded-full border border-black/10 bg-white/35 shadow-[0_25px_80px_rgba(26,20,50,.08)] backdrop-blur-sm" />

      {!reduceMotion && (
        <>
          {[0, 1, 2, 3, 4, 5].map((dot) => (
            <span key={dot} className="signal-particle" style={{ animationDelay: `${dot * -0.72}s` }} />
          ))}
        </>
      )}

      <div className="absolute left-[3%] top-1/2 -translate-y-1/2">
        <SignalNode icon={Sparkles} label="IDEA" />
      </div>
      <div className="absolute right-[3%] top-1/2 -translate-y-1/2">
        <SignalNode icon={Code2} label="SHIP" />
      </div>
      <div className="absolute left-1/2 top-[4%] -translate-x-1/2">
        <SignalNode icon={Workflow} label="FLOW" />
      </div>

      <div className="absolute left-1/2 top-1/2 flex h-[32%] w-[32%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[28%] border border-black/20 bg-[#171717] shadow-[0_35px_90px_rgba(0,0,0,.28)]">
        <div className="absolute inset-[9%] rounded-[24%] border border-[#d8b66d]/45" />
        <div className="text-center text-[#f1eee6]">
          <span className="block font-mono text-[9px] font-black tracking-[.25em] text-[#b6a7ff]">02 / TRANSFORM</span>
          <span className="mt-3 block text-2xl font-black uppercase tracking-[-.06em] md:text-4xl">SWARM</span>
        </div>
      </div>

      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 rounded-full border border-black/15 bg-[#f1eee6]/80 px-4 py-2 font-mono text-[9px] font-black uppercase tracking-[.22em] backdrop-blur-sm">
        Signal → system → delivery
      </div>
    </div>
  );
}

function SignalNode({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/15 bg-[#f1eee6] shadow-[0_12px_30px_rgba(0,0,0,.08)] md:h-20 md:w-20">
      <div className="text-center">
        <Icon className="mx-auto h-4 w-4 text-[#725cff] md:h-5 md:w-5" />
        <span className="mt-1 block font-mono text-[7px] font-black tracking-[.18em] md:text-[8px]">{label}</span>
      </div>
    </div>
  );
}

function StoryGraphic({ index }: { index: number }) {
  const shapes = [
    <div key="a" className="relative h-40 w-40">
      <div className="absolute inset-0 rotate-6 border border-[#b6a7ff]/60 bg-[#725cff]/20" />
      <div className="absolute inset-4 -rotate-6 border border-[#d8b66d]/70 bg-[#d8b66d]/10" />
      <Search className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-[#f1eee6]" />
    </div>,
    <div key="b" className="relative h-44 w-36">
      {[0, 1, 2].map((i) => <div key={i} className="absolute left-0 right-0 h-28 border border-white/20 bg-white/[.035]" style={{ top: `${i * 24}px`, transform: `translateX(${i * 12}px) rotate(${i * 2 - 2}deg)` }} />)}
      <FileText className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-[#d8b66d]" />
    </div>,
    <div key="c" className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/15">
      <div className="absolute inset-5 rounded-full border border-dashed border-[#b6a7ff]/50 signal-orbit" />
      <ShieldCheck className="h-12 w-12 text-[#b6a7ff]" />
    </div>,
    <div key="d" className="relative flex h-40 w-52 items-center justify-center">
      <div className="absolute left-0 h-24 w-24 rotate-[-8deg] border border-white/20 bg-[#725cff]/20" />
      <div className="absolute right-0 h-24 w-24 rotate-[8deg] border border-white/20 bg-[#d8b66d]/20" />
      <LockKeyhole className="relative z-10 h-11 w-11 text-[#f1eee6]" />
    </div>,
  ];
  return shapes[index] ?? shapes[0];
}

function BlueprintMotion() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl border border-black/20 bg-[#e5dfd2] p-5 shadow-[10px_10px_0_#151515]">
      <div className="grid h-full grid-cols-4 grid-rows-3 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`border border-black/15 ${i === 5 || i === 6 ? "bg-[#725cff]" : i === 1 || i === 10 ? "bg-[#d8b66d]" : "bg-white/25"}`} />
        ))}
      </div>
      <div className="absolute left-6 top-6 rounded-full bg-[#151515] px-3 py-1 font-mono text-[8px] font-black uppercase tracking-[.2em] text-[#f1eee6]">Foundation map</div>
      <span className="blueprint-cursor absolute h-7 w-7 rounded-full border-2 border-[#725cff]" />
    </div>
  );
}

function OrbitMotion() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute inset-[7%] rounded-full border border-black/25" />
      <div className="absolute inset-[19%] rounded-full border border-dashed border-black/30 signal-orbit" />
      <div className="absolute inset-[34%] flex items-center justify-center rounded-full bg-[#151515] text-[#f1eee6] shadow-[0_30px_80px_rgba(0,0,0,.18)]">
        <Workflow className="h-10 w-10" />
      </div>
      {["INPUT", "AGENT", "OUTPUT"].map((label, i) => (
        <div key={label} className="orbit-chip absolute rounded-full border border-black/25 bg-[#f1eee6] px-3 py-2 font-mono text-[8px] font-black tracking-[.18em]" style={{ animationDelay: `${i * -2.1}s` }}>{label}</div>
      ))}
    </div>
  );
}

function VaultStack() {
  const cards = [
    { label: "LICENSE", title: "Customer access", x: "4%", y: "12%", rotate: "-5deg" },
    { label: "ASSET", title: "Private download", x: "22%", y: "28%", rotate: "3deg" },
    { label: "ORDER", title: "Verified purchase", x: "38%", y: "44%", rotate: "-2deg" },
  ];
  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[620px]">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 30, rotate: card.rotate }}
          whileInView={{ opacity: 1, y: 0, rotate: card.rotate }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: i * 0.12, ease }}
          className="absolute h-52 w-[62%] border border-white/20 bg-[#202020] p-6 shadow-[0_30px_80px_rgba(0,0,0,.25)]"
          style={{ left: card.x, top: card.y }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] font-black tracking-[.2em] text-[#b6a7ff]">{card.label}</span>
            <Check className="h-4 w-4 text-[#d8b66d]" />
          </div>
          <p className="mt-14 max-w-[12rem] text-2xl font-black uppercase leading-none tracking-[-.04em]">{card.title}</p>
        </motion.div>
      ))}
    </div>
  );
}
