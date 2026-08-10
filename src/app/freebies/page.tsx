"use client";

import { Download, Gift, ArrowRight, Zap, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { trackLead } from "@/components/analytics/FBPixel";
import { trackEcommerceEvent } from "@/lib/web-analytics";

const freebies = [
  {
    id: "saas-checklist",
    name: "SaaS Launch Checklist",
    description: "A downloadable text checklist for planning and reviewing a SaaS launch.",
    icon: <Target className="w-8 h-8 text-primary" />,
    stats: "Free · .txt",
    type: "Checklist",
  },
  {
    id: "ai-prompt-library",
    name: "AI Prompt Library",
    description: "A downloadable text collection of reusable AI prompt patterns.",
    icon: <Sparkles className="w-8 h-8 text-accent" />,
    stats: "Free · .txt",
    type: "Prompt asset",
  },
  {
    id: "mini-ui-kit",
    name: "Cyberpunk Mini UI Kit",
    description: "A downloadable TSX sample containing reusable interface components.",
    icon: <Zap className="w-8 h-8 text-primary" />,
    stats: "Free · .tsx",
    type: "Code sample",
  },
  {
    id: "tech-stack-audit",
    name: "SaaS Tech Stack Audit",
    description: "A downloadable text reference for reviewing a SaaS technology stack.",
    icon: <Target className="w-8 h-8 text-blue-400" />,
    stats: "Free · .txt",
    type: "Guide",
  },
  {
    id: "design-system-tokens",
    name: "Digital Swarm Design Tokens",
    description: "A downloadable CSS token file for experimenting with Digital Swarm-style interface variables.",
    icon: <Sparkles className="w-8 h-8 text-amber-400" />,
    stats: "Free · .css",
    type: "CSS asset",
  },
];

export default function FreebiesPage() {
  const [listEmail, setListEmail] = useState("");
  const [listStatus, setListStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [listMessage, setListMessage] = useState("");

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!listEmail.trim()) return;
    setListStatus("loading");
    setListMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: listEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
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
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
            <Gift className="w-4 h-4" /> FREE DOWNLOADS
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl sm:text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.1]">
            Useful files. <span className="text-primary italic">No fake gate.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-muted-foreground leading-relaxed">
            Each button below maps to an asset that exists in Digital Swarm storage. The site generates a short-lived download link when you request it.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {freebies.map((freebie, idx) => (
            <motion.div key={freebie.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * idx }} className="group relative p-8 rounded-3xl bg-secondary/20 border border-border/50 hover:border-primary/50 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Gift className="w-24 h-24" /></div>
              <div className="mb-6 inline-flex p-4 rounded-2xl bg-background border border-border group-hover:scale-105 transition-transform duration-300">{freebie.icon}</div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between gap-4"><span className="text-xs font-bold uppercase tracking-widest text-primary">{freebie.type}</span><span className="text-xs text-muted-foreground">{freebie.stats}</span></div>
                <h3 className="text-2xl font-bold tracking-tight">{freebie.name}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{freebie.description}</p>
                <div className="pt-4">
                  <a href={`/api/freebies/${freebie.id}`} className="block w-full">
                    <Button variant="outline" className="w-full group/btn gap-2">Download Free <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" /></Button>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 sm:mt-32 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] bg-secondary/10 border border-border/50 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight italic">New-release email</h2>
            <p className="text-base sm:text-lg text-muted-foreground">Subscribe through the same newsletter endpoint used elsewhere on the site.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <input type="email" name="email" value={listEmail} onChange={(e) => setListEmail(e.target.value)} placeholder="Enter your email" required autoComplete="email" className="w-full sm:w-80 h-12 sm:h-14 rounded-full bg-background border border-border px-6 focus:outline-hidden focus:ring-2 focus:ring-primary/50 transition-all text-sm" />
              <Button type="submit" disabled={listStatus === "loading"} className="w-full sm:w-auto h-12 sm:h-14 px-8 rounded-full gap-2 text-sm">
                {listStatus === "loading" ? "Sending…" : "Subscribe"}<ArrowRight className="w-4 h-4" />
              </Button>
            </form>
            {listMessage ? <p className={`text-sm ${listStatus === "error" ? "text-red-400" : "text-primary"}`} role="status">{listMessage}</p> : null}
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center justify-center gap-2 group">
            Browse verified paid products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
