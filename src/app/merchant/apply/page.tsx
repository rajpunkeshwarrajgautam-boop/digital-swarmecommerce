"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { ShieldCheck, Cpu, Globe, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

export default function MerchantApply() {
  const [nodeName, setNodeName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sessionReceiptId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

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
      const data = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
      if (!res.ok) {
        setSubmitError(data.error || "Application failed. Try again or email ops@digitalswarm.in.");
        return;
      }
      setIsComplete(true);
    } catch {
      setSubmitError("Network error. Check your connection or email ops@digitalswarm.in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-black pt-32 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full text-center"
          >
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-[#CCFF00] blur-3xl opacity-20 animate-pulse" />
              <CheckCircle2 className="w-24 h-24 text-[#CCFF00] relative z-10 mx-auto" />
            </div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-4">Application_Sent</h1>
            <p className="text-gray-400 font-inter mb-12">
              Your application is stored in our systems. We will reach out at{" "}
              <span className="text-white font-bold">{contactEmail}</span> within 24–48 hours.
            </p>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left font-mono relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[#CCFF00] animate-[scan_2s_linear_infinite]" />
              <div className="flex justify-between text-[10px] text-gray-500 mb-4 uppercase tracking-[0.2em]">
                <span>Receipt_ID: {sessionReceiptId}</span>
                <span>Status: PENDING_REVIEW</span>
              </div>
              <p className="text-[#CCFF00] text-xs font-black uppercase tracking-widest italic">
                {"/// SWARM_PARTNER_PROTOCOL_V1.0 ///"}
              </p>
            </div>
            <ForgeButton variant="ghost" className="mt-12" onClick={() => (window.location.href = "/")}>
              Return_to_Hub
            </ForgeButton>
          </motion.div>
        </main>
        <Footer />
        <style jsx global>{`
          @keyframes scan {
            from {
              transform: translateY(-100%);
            }
            to {
              transform: translateY(500%);
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#CCFF00]/5 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3" />

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="px-3 py-1 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-full text-[10px] font-black text-[#CCFF00] uppercase tracking-widest italic">
                Swarm_Expansion_Active
              </div>
            </div>
            <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none mb-6">Join the Swarm</h1>
            <p className="text-gray-500 max-w-lg mx-auto font-inter">
              Deploy your architectural assets on the network. Become a verified Swarm Merchant.
            </p>
          </div>

          <GlassCard className="p-8 md:p-12 relative overflow-hidden">
            {isSubmitting && (
              <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center flex-col gap-6">
                <Loader2 className="w-12 h-12 text-[#CCFF00] animate-spin" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-[#CCFF00] italic">
                  Submitting_Application…
                </span>
              </div>
            )}

            {submitError && (
              <div className="mb-8 p-4 border border-red-500/40 bg-red-500/10 text-red-200 text-sm font-inter rounded-xl">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup
                  label="Node Brand Identity"
                  icon={<Globe className="w-4 h-4" />}
                  placeholder="e.g. ZERO_PRIME_CORE"
                  value={nodeName}
                  onChange={setNodeName}
                  id="merchant-node-name"
                />
                <InputGroup
                  label="Primary Specialization"
                  icon={<Cpu className="w-4 h-4" />}
                  placeholder="e.g. Neural Templates"
                  value={specialization}
                  onChange={setSpecialization}
                  id="merchant-specialization"
                />
              </div>

              <InputGroup
                label="Portfolio URL / Reputation Proof"
                icon={<ShieldCheck className="w-4 h-4" />}
                placeholder="https://github.com/your-swarms"
                value={portfolioUrl}
                onChange={setPortfolioUrl}
                id="merchant-portfolio"
              />

              <div className="space-y-3">
                <label
                  htmlFor="merchant-contact-email"
                  className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]/60 italic ml-1 flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" /> Contact email
                </label>
                <input
                  id="merchant-contact-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#CCFF00]/50 focus:outline-none transition-all font-inter"
                  placeholder="you@company.com"
                />
              </div>

              <div className="space-y-4">
                <label
                  htmlFor="merchant-description"
                  className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]/60 italic ml-1"
                >
                  Proposed Asset Distribution
                </label>
                <textarea
                  id="merchant-description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#CCFF00]/50 focus:outline-none transition-all h-32 font-inter"
                  placeholder="Describe the high-fidelity assets you intend to deploy on the network..."
                />
              </div>

              <div className="pt-6 flex items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Protocol Verification</span>
                  <p className="text-[10px] text-gray-400 italic">By applying, you agree to the Swarm Multi-Node Standard.</p>
                </div>
                <ForgeButton variant="primary" className="h-14 px-10 group" type="submit" disabled={isSubmitting}>
                  Initiate_Uplink <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </ForgeButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  );
}

function InputGroup({
  label,
  placeholder,
  icon,
  id,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  id: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]/60 italic ml-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <input
        id={id}
        type="text"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#CCFF00]/50 focus:outline-none transition-all font-inter"
        placeholder={placeholder}
      />
    </div>
  );
}
