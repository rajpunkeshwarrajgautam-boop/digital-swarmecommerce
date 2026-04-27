"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Activity, Zap, Shield, Database, Users, TrendingUp, Globe, Cpu } from "lucide-react";
import { getGlobalPulse, SwarmPulse } from "@/app/actions/pulse";
import { motion, AnimatePresence } from "framer-motion";

export default function SwarmPulsePage() {
  const [pulse, setPulse] = useState<SwarmPulse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getGlobalPulse();
        setPulse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 overflow-hidden">
        
        {/* Background Atmospheric Effect */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#CCFF00]/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto space-y-16 relative z-10">
          
          <div className="text-center space-y-6">
            <h1 className="text-8xl font-black italic uppercase tracking-tighter text-white leading-none">The Swarm Pulse</h1>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-1 bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-widest italic">
                LIVE_NETWORK_UPLINK
              </div>
              <div className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">
                Protocol: Digital_Swarm_v8.2 // Status: SYNCHRONIZED
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Primary Health Meter */}
            <div className="lg:col-span-2">
              <GlassCard className="h-full p-12 border-4 border-white/10 rounded-none bg-black/40 relative overflow-hidden flex flex-col justify-center items-center text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.1)_0%,transparent_70%)]" />
                
                <div className="relative space-y-8">
                  <div className="text-[12px] font-black uppercase tracking-[0.4em] text-gray-500">System_Health_Index</div>
                  <div className="text-[160px] font-black italic leading-none text-white tracking-tighter flex items-center justify-center">
                    {pulse?.healthIndex || "99"}
                    <span className="text-4xl text-[#CCFF00] ml-2">%</span>
                  </div>
                  <div className="flex items-center gap-6 justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#CCFF00]" />
                      <span className="text-[9px] font-black uppercase text-white tracking-widest">STABLE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span className="text-[9px] font-black uppercase text-white tracking-widest">SCALING</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Metrics Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <MetricCard 
                label="Global_Velocity" 
                value={`${pulse?.globalVelocity || 0}/24h`} 
                icon={<TrendingUp className="w-5 h-5" />} 
                color="#CCFF00" 
              />
              <MetricCard 
                label="Network_Trust" 
                value={pulse?.networkTrust || 0} 
                icon={<Shield className="w-5 h-5" />} 
                color="#00D1FF" 
              />
              <MetricCard 
                label="Task_Throughput" 
                value={pulse?.taskThroughput || 0} 
                icon={<Cpu className="w-5 h-5" />} 
                color="#FF0055" 
              />
              <MetricCard 
                label="Ledger_Volume" 
                value={`₹${(pulse?.ledgerVolume || 0).toLocaleString()}`} 
                icon={<Database className="w-5 h-5" />} 
                color="#ffffff" 
              />
            </div>
          </div>

          {/* Network Visualization (Static for MVP) */}
          <GlassCard className="p-12 border-4 border-white/10 rounded-none bg-black/40 space-y-12">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic uppercase text-white tracking-tight">Active_Node_Matrix</h3>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{pulse?.activeNodes || 0} Entities Connected</p>
              </div>
              <div className="flex items-center gap-4 text-white/40 font-mono text-[9px] uppercase">
                <span>Latency: 14ms</span>
                <span>Uptime: 99.99%</span>
              </div>
            </div>

            <div className="h-64 border-2 border-white/5 bg-white/[0.02] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
              <div className="flex gap-4">
                {Array(12).fill(0).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ height: [40, 100, 60, 120, 80] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                    className="w-2 bg-[#CCFF00] opacity-20"
                  />
                ))}
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-black text-white/10 uppercase tracking-[2em] whitespace-nowrap">
                SCANNING_NETWORK_NODES...
              </div>
            </div>
          </GlassCard>

        </div>
      </main>
      <Footer />
    </>
  );
}

function MetricCard({ label, value, icon, color }: { label: string, value: string | number, icon: React.ReactNode, color: string }) {
  return (
    <GlassCard className="p-8 border-4 border-white/10 rounded-none bg-black/40 space-y-6 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity" style={{ color }}>
        {icon}
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">{label}</span>
        <div className="text-4xl font-black italic text-white tracking-tighter" style={{ color: color }}>
          {value}
        </div>
      </div>
      <div className="h-[2px] w-12" style={{ backgroundColor: color }} />
    </GlassCard>
  );
}
