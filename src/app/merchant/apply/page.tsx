"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { ShieldCheck, Cpu, Globe, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

interface ApplicationReceipt {
  id: string;
  status: string;
  created_at: string;
}

export default function MerchantApply() {
  const [nodeName, setNodeName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/merchant/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeName: nodeName.trim(),
          specialization: specialization.trim(),
          portfolioUrl: portfolioUrl.trim(),
          description: description.trim(),
          contactEmail: contactEmail.trim().toLowerCase(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; application?: ApplicationReceipt };
      if (!res.ok || !data.application) {
        setSubmitError(data.error || "Application failed. Try again or email support@digitalswarm.in.");
        return;
      }
      setReceipt(data.application);
    } catch {
      setSubmitError("Network error. Check your connection or email support@digitalswarm.in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <main className="min-h-screen bg-black pt-32 pb-24 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl w-full text-center">
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-8" />
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-4">Application Saved</h1>
          <p className="text-gray-400 font-inter mb-10 leading-relaxed">
            Your merchant application is stored for manual review. Any follow-up will be sent to <span className="text-white font-bold">{contactEmail}</span>. No fixed review-time promise is made here.
          </p>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left font-mono">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3 text-[10px] text-gray-500 uppercase tracking-[0.15em]">
              <span>Application ID: {receipt.id}</span>
              <span>Status: {receipt.status}</span>
            </div>
            <p className="mt-4 text-xs text-white/40">Recorded: {new Date(receipt.created_at).toLocaleString()}</p>
          </div>
          <ForgeButton variant="ghost" className="mt-10" onClick={() => (window.location.href = "/merchant")}>
            Return to merchant workspace
          </ForgeButton>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-black text-primary uppercase tracking-widest mb-4">
            Merchant applications open
          </div>
          <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none mb-6">Apply to Sell</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-inter leading-relaxed">
            Submit your identity, portfolio, specialization, and intended product scope. Approval is manual; an application does not automatically publish products or guarantee acceptance.
          </p>
        </div>

        <GlassCard className="p-8 md:p-12 relative overflow-hidden">
          {isSubmitting && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center flex-col gap-6">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary">Saving application…</span>
            </div>
          )}

          {submitError && <div className="mb-8 p-4 border border-red-500/40 bg-red-500/10 text-red-200 text-sm rounded-xl">{submitError}</div>}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputGroup label="Business / creator name" icon={<Globe className="w-4 h-4" />} placeholder="Your studio or brand" value={nodeName} onChange={setNodeName} id="merchant-node-name" />
              <InputGroup label="Primary specialization" icon={<Cpu className="w-4 h-4" />} placeholder="e.g. AI agents, design assets" value={specialization} onChange={setSpecialization} id="merchant-specialization" />
            </div>

            <InputGroup label="Portfolio URL" icon={<ShieldCheck className="w-4 h-4" />} placeholder="https://your-portfolio.example" value={portfolioUrl} onChange={setPortfolioUrl} id="merchant-portfolio" />

            <div className="space-y-3">
              <label htmlFor="merchant-contact-email" className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-1 flex items-center gap-2"><Globe className="w-4 h-4" /> Contact email</label>
              <input id="merchant-contact-email" type="email" required autoComplete="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-primary/50 focus:outline-none transition-all font-inter" placeholder="you@company.com" />
            </div>

            <div className="space-y-4">
              <label htmlFor="merchant-description" className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-1">What do you want to sell?</label>
              <textarea id="merchant-description" required value={description} onChange={(e) => setDescription(e.target.value)} maxLength={5000} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-primary/50 focus:outline-none transition-all h-36 font-inter" placeholder="Describe the actual deliverables, intended customer, licensing, and how fulfillment would work." />
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <p className="text-[10px] text-gray-500 max-w-md leading-relaxed">Products require separate asset and fulfillment verification before publication. Questions: support@digitalswarm.in.</p>
              <ForgeButton variant="primary" className="h-14 px-10 group" type="submit" disabled={isSubmitting}>
                Submit application <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </ForgeButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </main>
  );
}

function InputGroup({ label, placeholder, icon, id, value, onChange }: { label: string; placeholder: string; icon: React.ReactNode; id: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-primary/70 ml-1 flex items-center gap-2">{icon} {label}</label>
      <input id={id} type="text" required maxLength={id === "merchant-portfolio" ? 500 : 160} value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-primary/50 focus:outline-none transition-all font-inter" placeholder={placeholder} />
    </div>
  );
}
