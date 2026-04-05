"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { ForgeButton } from '@/components/ui/ForgeButton';
import { ShieldCheck, Cpu, Globe, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

export default function MerchantApply() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  // Stable ID for the session
  const [sessionReceiptId] = useState(() => Math.random().toString(36).substring(7).toUpperCase());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API processing with a "Scanning" delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsSubmitting(false);
    setIsComplete(true);
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
              Your Node Identity has been broadcast to the Swarm Council. Verification protocols have been initiated. Expect an uplink within 24-48 cycles.
            </p>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-left font-mono relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-[#CCFF00] animate-[scan_2s_linear_infinite]" />
                <div className="flex justify-between text-[10px] text-gray-500 mb-4 uppercase tracking-[0.2em]">
                    <span>Receipt_ID: {sessionReceiptId}</span>
                    <span>Status: PENDING_REVIEW</span>
                </div>
                <p className="text-[#CCFF00] text-xs font-black uppercase tracking-widest italic">{"/// SWARM_PARTNER_PROTOCOL_V1.0 ///"}</p>
            </div>
            <ForgeButton variant="ghost" className="mt-12" onClick={() => window.location.href = '/'}>
              Return_to_Hub
            </ForgeButton>
          </motion.div>
        </main>
        <Footer />
        <style jsx global>{`
          @keyframes scan {
            from { transform: translateY(-100%); }
            to { transform: translateY(500%); }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6 relative overflow-hidden">
        {/* Background Ambience */}
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
              Deploy your architectural assets on the world&apos;s most advanced distributed network. Become a verified Swarm Merchant.
            </p>
          </div>

          <GlassCard className="p-8 md:p-12 relative overflow-hidden">
            {isSubmitting && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center flex-col gap-6">
                    <Loader2 className="w-12 h-12 text-[#CCFF00] animate-spin" />
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-[#CCFF00] italic">Analyzing_Node_Credentials...</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup label="Node Brand Identity" icon={<Globe className="w-4 h-4" />} placeholder="e.g. ZERO_PRIME_CORE" />
                <InputGroup label="Primary Specialization" icon={<Cpu className="w-4 h-4" />} placeholder="e.g. Neural Templates" />
              </div>

              <InputGroup label="Portfolio URL / Reputation Proof" icon={<ShieldCheck className="w-4 h-4" />} placeholder="https://github.com/your-swarms" />

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]/60 italic ml-1">Proposed Asset Distribution</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#CCFF00]/50 focus:outline-none transition-all h-32 font-inter"
                  placeholder="Describe the high-fidelity assets you intend to deploy on the network..."
                  required
                />
              </div>

              <div className="pt-6 flex items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Protocol Verification</span>
                    <p className="text-[10px] text-gray-400 italic">By applying, you agree to the Swarm Multi-Node Standard.</p>
                </div>
                <ForgeButton variant="primary" className="h-14 px-10 group" type="submit">
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

function InputGroup({ label, placeholder, icon }: { label: string, placeholder: string, icon: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]/60 italic ml-1 flex items-center gap-2">
        {icon} {label}
      </label>
      <input 
        type="text" 
        className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#CCFF00]/50 focus:outline-none transition-all font-inter"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
