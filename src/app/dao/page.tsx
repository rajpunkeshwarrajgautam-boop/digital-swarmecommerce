"use client";

import { useState } from "react";
import { Shield, Activity, Zap, TrendingUp, Target, BarChart3, Globe, Sparkles, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwarmSWR } from "@/hooks/useSwarmSWR";

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'PASSED' | 'REJECTED';
  yes_votes: number;
  no_votes: number;
  end_date: string;
}

interface SwarmPulse {
  total_transfers: number;
  total_votes: number;
  treasury_velocity: number;
  sync_level: number;
}

interface DaoSummary {
  proposals: Proposal[];
  /** API returns camelCase */
  treasuryBalance?: number;
  treasury_balance?: number;
}

export default function GovernanceNexus() {
  const { data: daoData, revalidate: revalidateDao } = useSwarmSWR<DaoSummary>('/api/dao');
  const { data: pulseData } = useSwarmSWR<{ pulse: SwarmPulse }>('/api/dao/pulse');
  
  const [activeTab, setActiveTab] = useState<'proposals' | 'treasury' | 'pulse'>('proposals');
  const [isCasting, setIsCasting] = useState(false);
 
  const proposals = daoData?.proposals || [];
  const treasuryBalance = daoData?.treasuryBalance ?? daoData?.treasury_balance ?? 0;
  const pulse: SwarmPulse = pulseData?.pulse || { total_transfers: 0, total_votes: 0, treasury_velocity: 0, sync_level: 50 };
 
  const castVote = async (proposalId: string, vote: 'YES' | 'NO') => {
    setIsCasting(true);
    try {
      const res = await fetch('/api/dao/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, vote })
      });
      if (res.ok) revalidateDao();
    } catch (err) {
      console.error('[GOVERNANCE_FAULT] Vote sequence failed:', err);
    } finally {
      setIsCasting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-40 pb-32">
      {/* Background Decor */}
      <div className="absolute inset-x-0 top-0 h-[800px] bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 p-40 opacity-5 grayscale pointer-events-none">
         <Shield className="w-96 h-96" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <header className="mb-24">
          <div className="flex items-center gap-4 mb-10 overflow-hidden">
             <div className="h-px flex-1 bg-white/5" />
             <div className="flex items-center gap-3 px-4 py-1.5 bg-primary/10 border border-primary/20">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-primary italic">governance_nexus.v2</span>
             </div>
             <div className="h-px flex-1 bg-white/5" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-8">
               <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-7xl md:text-8xl font-outfit font-black italic uppercase tracking-tighter leading-[0.8]"
               >
                  Swarm <br />
                  <span className="text-white/10 italic">Governance</span>
               </motion.h1>
               <p className="text-[11px] font-mono text-white/30 uppercase tracking-[0.4em] max-w-xl italic leading-relaxed">
                  Community-led capital allocation and protocol evolution. One holder, one voice.
               </p>
            </div>

            <div className="p-8 bg-white/2 border border-white/5 relative group min-w-[300px]">
               <div className="absolute top-0 right-0 p-1 opacity-10">
                  <Activity className="w-12 h-12 text-primary" />
               </div>
               <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest italic">Nabla Stability Fund</span>
                  <span className="text-5xl font-outfit font-black italic text-white">
                     {treasuryBalance.toLocaleString()} 
                     <span className="text-sm text-primary ml-2 uppercase">DST</span>
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                     <span className="text-[9px] font-mono text-primary uppercase tracking-widest italic">Live Treasury Uplink Active</span>
                  </div>
               </div>
            </div>
          </div>
        </header>

        {/* Global Navigation */}
        <nav className="flex gap-1 border-b border-white/5 mb-16">
           {([
             { id: "proposals" as const, label: "Protocol Decisions", icon: Target },
             { id: "treasury" as const, label: "Treasury Flow", icon: BarChart3 },
             { id: "pulse" as const, label: "Swarm Pulse", icon: Globe },
           ] as const).map((tab) => (
              <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-3 px-8 py-5 text-[10px] font-mono uppercase tracking-[0.3em] transition-all relative ${
                    activeTab === tab.id ? 'text-primary' : 'text-white/20 hover:text-white/40'
                 }`}
              >
                 <tab.icon className="w-3.5 h-3.5" />
                 {tab.label}
                 {activeTab === tab.id && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 inset-x-0 h-0.5 bg-primary" />
                 )}
              </button>
           ))}
        </nav>

        {/* Main Interface Content */}
        <AnimatePresence mode="wait">
           {activeTab === 'proposals' && (
              <motion.div 
                 key="proposals"
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: 20 }}
                 className="grid grid-cols-1 gap-8"
              >
                 {proposals.length === 0 ? (
                    <div className="p-20 text-center border-2 border-dashed border-white/5">
                       <span className="text-[10px] font-mono text-white/10 uppercase tracking-widest italic">No active proposals detected in sector.</span>
                    </div>
                 ) : (
                    proposals.map((prop: Proposal) => (
                       <ProposalCard key={prop.id} proposal={prop} onVote={castVote} isCasting={isCasting} />
                    ))
                 )}
              </motion.div>
           )}

           {activeTab === 'pulse' && (
              <motion.div 
                 key="pulse"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                 <PulseMetric 
                    label="Transaction Velocity" 
                    value={pulse.total_transfers.toLocaleString()} 
                    icon={Activity} 
                    trend={`+${pulse.total_votes} Operations`}
                 />
                 <PulseMetric 
                    label="Community Sync" 
                    value={`${pulse.sync_level}%`} 
                    icon={Target} 
                    trend="Consensus Level"
                    color="text-accent"
                 />
                 <PulseMetric 
                    label="Treasury Growth" 
                    value={`${pulse.treasury_velocity.toLocaleString()} DST`} 
                    icon={TrendingUp} 
                    trend="24h Yield"
                    color="text-primary"
                 />
                 <PulseMetric 
                    label="Swarm Power" 
                    value="Optimal" 
                    icon={Zap} 
                    trend="System Status"
                    color="text-white"
                 />
                 
                 <div className="col-span-1 md:col-span-2 lg:col-span-4 p-12 bg-white/2 border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
                       <div className="space-y-6 max-w-xl">
                          <div className="flex items-center gap-3">
                             <Sparkles className="w-5 h-5 text-primary" />
                             <h3 className="text-2xl font-outfit font-black italic uppercase tracking-tighter">Autonomous Synthesis Active</h3>
                          </div>
                          <p className="text-[11px] font-mono text-white/40 uppercase tracking-[0.2em] leading-relaxed italic">
                             The Swarm Analytics Engine is now power-ranking artifacts across the globally distributed nodes. High-fidelity &quot;Match Density&quot; is being calculated in the background.
                          </p>
                       </div>
                       <div className="flex gap-4">
                          {[0, 1, 2, 3, 4, 5, 6].map(i => (
                             <motion.div 
                                key={i}
                                animate={{ height: [20, 50, 30, 60, 40] }}
                                transition={{ repeat: Infinity, duration: 1 + i*0.2, ease: "linear" }}
                                className="w-1.5 bg-primary/20 rounded-full"
                             />
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
           )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function ProposalCard({ proposal, onVote, isCasting }: { proposal: Proposal; onVote: (id: string, vote: 'YES' | 'NO') => void; isCasting: boolean }) {
  const totalVotes = proposal.yes_votes + proposal.no_votes;
  const yesPercent = totalVotes > 0 ? (proposal.yes_votes / totalVotes) * 100 : 0;
  const noPercent = totalVotes > 0 ? (proposal.no_votes / totalVotes) * 100 : 0;

  return (
    <div className="bg-white/2 border border-white/5 p-12 flex flex-col lg:flex-row gap-16 group hover:border-white/10 transition-all">
       <div className="flex-1 space-y-8">
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-primary/10 border border-primary/20 text-[9px] font-mono font-black text-primary uppercase tracking-widest italic">
                   {proposal.status}
                </div>
                <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.3em]">Ends: {new Date(proposal.end_date).toLocaleDateString()}</span>
             </div>
             <h3 className="text-3xl font-outfit font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors italic">
                {proposal.title}
             </h3>
             <p className="text-[11px] font-mono text-white/40 uppercase tracking-widest leading-relaxed italic max-w-2xl">
                {proposal.description}
             </p>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-end text-[10px] font-mono uppercase tracking-widest">
                <span className="text-primary italic">Resolution Sync</span>
                <span className="text-white/20 italic">{totalVotes.toLocaleString()} Weight Measured</span>
             </div>
             <div className="h-1.5 w-full bg-white/5 overflow-hidden flex">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${yesPercent}%` }}
                   className="h-full bg-primary" 
                />
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${noPercent}%` }}
                   className="h-full bg-white/10" 
                />
             </div>
             <div className="flex justify-between items-center text-[11px] font-mono font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 text-primary italic">
                   <span>YES</span>
                   <span>{yesPercent.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2 text-white/20 italic">
                   <span>{noPercent.toFixed(1)}%</span>
                   <span>NO</span>
                </div>
             </div>
          </div>
       </div>

       <div className="flex lg:flex-col gap-4 min-w-[200px]">
          <button 
             onClick={() => onVote(proposal.id, 'YES')}
             disabled={isCasting}
             className="flex-1 px-8 py-5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-[10px] font-mono font-black text-primary uppercase tracking-widest disabled:opacity-50 italic transition-all"
          >
             {isCasting ? 'Processing...' : 'Endorse'}
          </button>
          <button 
             onClick={() => onVote(proposal.id, 'NO')}
             disabled={isCasting}
             className="flex-1 px-8 py-5 bg-white/2 border border-white/5 hover:bg-white/5 text-[10px] font-mono font-black text-white/40 uppercase tracking-widest disabled:opacity-50 italic transition-all"
          >
             Relinquish
          </button>
       </div>
    </div>
  );
}

interface PulseMetricProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  color?: string;
}

function PulseMetric({ label, value, icon: Icon, trend, color = 'text-primary' }: PulseMetricProps) {
   return (
      <div className="bg-white/2 border border-white/5 p-8 space-y-6 group hover:border-white/10 transition-all">
         <div className="flex items-center justify-between">
            <div className={`p-3 bg-white/5 transition-colors group-hover:bg-white/10 ${color}`}>
               <Icon className="w-4 h-4" />
            </div>
            <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest italic">{trend}</span>
         </div>
         <div className="space-y-1">
            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest italic">{label}</span>
            <div className="text-4xl font-outfit font-black italic uppercase tracking-tighter text-white">
               {value}
            </div>
         </div>
      </div>
   );
}
