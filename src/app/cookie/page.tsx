"use client";

import { motion } from "framer-motion";
import { Cookie, Eye, ShieldCheck, Lock } from "lucide-react";

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="border-l-4 border-primary pl-8 py-4">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Cookie_Usage</h1>
            <p className="text-white/40 text-xl font-bold uppercase tracking-tight">Operational tracking and session integrity protocols.</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-white/60 font-bold uppercase tracking-tight text-sm">
            <section className="p-8 border border-white/10 bg-zinc-950">
              <h2 className="text-primary text-xl font-black italic mb-4 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6" /> 1. Functional Integrity
              </h2>
              <p>We use essential cookies to maintain your authentication state via Clerk and manage your Digital Swarm cart persistence. These are required for the platform to operate.</p>
            </section>

            <section className="p-8 border border-white/10 bg-zinc-950">
              <h2 className="text-primary text-xl font-black italic mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6" /> 2. Intelligence Gathering
              </h2>
              <p>Subtle tracking (Google Analytics/Meta Pixel) is used to monitor site performance and traffic flow. This data is strictly used to optimize the user experience.</p>
            </section>

            <section className="p-8 border border-white/10 bg-zinc-950">
              <h2 className="text-primary text-xl font-black italic mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6" /> 3. Data Protection
              </h2>
              <p>Your data is never sold. We prioritize privacy-first engineering across all Digital Swarm infrastructures.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
