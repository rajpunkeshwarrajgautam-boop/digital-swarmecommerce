"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, Sparkles, Target, Zap } from "lucide-react";
import { trackLead } from "@/components/analytics/FBPixel";
import { trackEcommerceEvent } from "@/lib/web-analytics";

const freebies = [
  { id: "saas-checklist", index: "01", name: "SaaS Launch Checklist", description: "A downloadable text checklist for planning and reviewing a SaaS launch.", format: ".txt", type: "Checklist", icon: Target },
  { id: "ai-prompt-library", index: "02", name: "AI Prompt Library", description: "A downloadable text collection of reusable AI prompt patterns.", format: ".txt", type: "Prompt asset", icon: Sparkles },
  { id: "mini-ui-kit", index: "03", name: "Cyberpunk Mini UI Kit", description: "A downloadable TSX sample containing reusable interface components.", format: ".tsx", type: "Code sample", icon: Zap },
  { id: "tech-stack-audit", index: "04", name: "SaaS Tech Stack Audit", description: "A downloadable text reference for reviewing a SaaS technology stack.", format: ".txt", type: "Guide", icon: Target },
  { id: "design-system-tokens", index: "05", name: "Digital Swarm Design Tokens", description: "A downloadable CSS token file for experimenting with Digital Swarm-style interface variables.", format: ".css", type: "CSS asset", icon: Sparkles },
];

const ease = [0.16, 1, 0.3, 1] as const;

export default function FreebiesPage() {
  const reduceMotion = useReducedMotion();
  const [listEmail, setListEmail] = useState("");
  const [listStatus, setListStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [listMessage, setListMessage] = useState("");

  async function handleNewsletter(event: React.FormEvent) {
    event.preventDefault();
    if (!listEmail.trim()) return;
    setListStatus("loading");
    setListMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: listEmail.trim() }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setListStatus("success");
        setListMessage("Subscription saved. Check your inbox if a welcome email is enabled.");
        trackLead("freebies_newsletter");
        trackEcommerceEvent("generate_lead", { source: "freebies", placement: "onsite" });
        setListEmail("");
      } else {
        setListStatus("error");
        setListMessage(data.error || "Could not subscribe. Try again.");
      }
    } catch {
      setListStatus("error");
      setListMessage("Network error. Retry in a moment.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f1eee6] text-[#151515]">
      <section className="relative overflow-hidden border-b border-black/20 px-5 pb-20 pt-16 md:px-8 md:pb-28 lg:px-12">
        <div className="editorial-paper absolute inset-0 -z-20" />
        <div className="absolute -right-28 top-0 -z-10 h-96 w-96 rounded-full bg-[#725cff]/12 blur-[110px]" />
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <motion.div initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease }}>
            <p className="editorial-kicker">FREE ASSETS / REAL FILES</p>
            <h1 className="mt-7 max-w-6xl text-[clamp(4.5rem,9vw,10rem)] font-black uppercase leading-[.78] tracking-[-.08em]">
              Try the system
              <span className="block text-[#725cff]">before you buy.</span>
            </h1>
          </motion.div>
          <motion.div initial={reduceMotion ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .12, ease }} className="border-t border-black/20 pt-6 lg:mb-2">
            <p className="text-base leading-7 text-black/58 md:text-lg">
              These files are intentionally free. Each download button calls the Digital Swarm freebie endpoint, which returns short-lived access to the requested stored asset.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-black/20 bg-[#d9d0ff] px-5 py-16 md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-black/20 pb-7 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-[9px] font-black uppercase tracking-[.2em] text-[#725cff]">DOWNLOADABLE SAMPLER</p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-.055em] md:text-6xl">Five practical files.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-black/50">No simulated counters or forced email gate. Open a file directly through its real free-download route.</p>
          </div>

          <div className="border-t border-black/20">
            {freebies.map((freebie, index) => {
              const Icon = freebie.icon;
              return (
                <motion.article
                  key={freebie.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: .5, delay: index * .05, ease }}
                  className="group grid gap-5 border-b border-black/20 py-7 md:grid-cols-[70px_1fr_140px_170px] md:items-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/20 bg-[#f1eee6]/55">
                    <Icon className="h-5 w-5 text-[#725cff]" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[8px] font-black tracking-[.18em] text-[#725cff]">{freebie.index}</span>
                      <span className="font-mono text-[8px] font-black uppercase tracking-[.16em] text-black/40">{freebie.type}</span>
                    </div>
                    <h3 className="mt-2 text-2xl font-black uppercase tracking-[-.04em] md:text-3xl">{freebie.name}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-black/52">{freebie.description}</p>
                  </div>
                  <div className="font-mono text-[10px] font-black uppercase tracking-[.18em] text-black/45">Free · {freebie.format}</div>
                  <a href={`/api/freebies/${freebie.id}`} className="editorial-button editorial-button-dark w-full justify-between">
                    Download <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                  </a>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#151515] px-5 py-20 text-[#f1eee6] md:px-8 md:py-24 lg:px-12">
        <div className="mx-auto grid max-w-[1600px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="editorial-kicker text-[#d8b66d]">RELEASE NOTES BY EMAIL</p>
            <h2 className="mt-6 text-[clamp(3.5rem,7vw,7.5rem)] font-black uppercase leading-[.82] tracking-[-.07em]">Hear when the catalog changes.</h2>
            <p className="mt-6 max-w-md text-sm leading-6 text-white/48 md:text-base">Subscribe through the same newsletter endpoint used elsewhere on the store. No fake success state is shown if the subscription cannot be saved.</p>
          </div>

          <form onSubmit={handleNewsletter} className="self-center border border-white/15 bg-white/[.035] p-5 md:p-8">
            <label htmlFor="freebie-email" className="font-mono text-[9px] font-black uppercase tracking-[.18em] text-[#b6a7ff]">Email address</label>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                id="freebie-email"
                type="email"
                name="email"
                value={listEmail}
                onChange={(event) => setListEmail(event.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="min-h-14 min-w-0 flex-1 border border-white/20 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#b6a7ff]"
              />
              <button type="submit" disabled={listStatus === "loading"} className="flex min-h-14 items-center justify-center gap-3 border border-[#d8b66d] bg-[#d8b66d] px-6 text-[10px] font-black uppercase tracking-[.17em] text-[#151515] transition hover:bg-[#f1eee6] disabled:opacity-50">
                {listStatus === "loading" ? "Sending…" : "Subscribe"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {listMessage ? <p className={`mt-4 text-sm ${listStatus === "error" ? "text-red-300" : "text-[#d8b66d]"}`} role="status">{listMessage}</p> : null}
          </form>
        </div>
      </section>

      <section className="bg-[#d8b66d] px-5 py-16 md:px-8 md:py-20 lg:px-12">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-7 lg:flex-row lg:items-end">
          <div>
            <p className="editorial-kicker">READY FOR THE FULL CATALOG</p>
            <h2 className="mt-5 max-w-4xl text-[clamp(3.4rem,6vw,6.8rem)] font-black uppercase leading-[.83] tracking-[-.065em]">Move from sample files to complete products.</h2>
          </div>
          <Link href="/products" className="editorial-button editorial-button-dark lg:mb-2">Browse paid products <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </div>
  );
}
