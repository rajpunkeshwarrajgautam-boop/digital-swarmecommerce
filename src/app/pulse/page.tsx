"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, Database, TrendingUp, Cpu, Activity } from "lucide-react";
import { getGlobalPulse, SwarmPulse } from "@/app/actions/pulse";
import { motion } from "framer-motion";

export default function SwarmPulsePage() {
  const [pulse, setPulse] = useState<SwarmPulse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setPulse(await getGlobalPulse());
      } catch (error) {
        console.error('[pulse] unable to load database activity', error);
        setPulse(null);
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="text-center space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
            <Activity className="h-4 w-4" /> Database-backed activity
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">Swarm Pulse</h1>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-white/45">
            These values come from recorded commissions, completed agent tasks and registered swarm nodes. When there is no activity, the dashboard shows zero rather than simulated traffic.
          </p>
        </div>

        {!loading && !pulse && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/45">
            Live activity data is temporarily unavailable.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <GlassCard className="h-full p-10 border-white/10 bg-black/40 relative overflow-hidden flex flex-col justify-center items-center text-center rounded-2xl">
              <div className="relative space-y-5">
                <div className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">Recorded activity index</div>
                <div className="text-[120px] md:text-[150px] font-black leading-none text-white tracking-tighter flex items-center justify-center">
                  {pulse?.healthIndex ?? 0}
                  <span className="text-3xl text-primary ml-2">/100</span>
                </div>
                <p className="text-xs text-white/30">Derived from recorded transactions, trust scores and completed tasks.</p>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard label="Transactions / 24h" value={pulse?.globalVelocity ?? 0} icon={<TrendingUp className="w-5 h-5" />} />
            <MetricCard label="Average node trust" value={pulse?.networkTrust ?? 0} icon={<Shield className="w-5 h-5" />} />
            <MetricCard label="Completed tasks" value={pulse?.taskThroughput ?? 0} icon={<Cpu className="w-5 h-5" />} />
            <MetricCard label="Recorded volume" value={`₹${(pulse?.ledgerVolume ?? 0).toLocaleString()}`} icon={<Database className="w-5 h-5" />} />
          </div>
        </div>

        <GlassCard className="p-10 border-white/10 bg-black/40 rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">Registered nodes</h2>
              <p className="mt-2 text-xs text-white/35">Count returned by the current swarm_nodes table.</p>
            </div>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black text-primary">
              {pulse?.activeNodes ?? 0}
            </motion.div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <GlassCard className="p-7 border-white/10 rounded-2xl bg-black/40 space-y-5 relative group overflow-hidden">
      <div className="text-primary">{icon}</div>
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
        <div className="mt-2 text-4xl font-black text-white tracking-tighter">{value}</div>
      </div>
    </GlassCard>
  );
}
