"use client";

import { useEffect, useState } from "react";
import { Header } from "@/layout/Header";
import { Footer } from "@/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Trophy, Star, TrendingUp, ShieldCheck, ChevronRight, Zap, Target } from "lucide-react";
import { RANK_TIERS, RankConfig } from "@/lib/reputation";
import { motion } from "framer-motion";

export default function ReputationProtocolPage() {
  const [currentScore, setCurrentScore] = useState(750); // Mock score for UI
  const [currentRank, setCurrentRank] = useState<RankConfig>(RANK_TIERS[1]);

  useEffect(() => {
    const tier = [...RANK_TIERS].reverse().find(t => currentScore >= t.threshold);
    if (tier) setCurrentRank(tier);
  }, [currentScore]);

  const nextRank = RANK_TIERS[RANK_TIERS.indexOf(currentRank) + 1];
  const progress = nextRank 
    ? ((currentScore - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100 
    : 100;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none">Reputation Protocol</h1>
              <p className="text-gray-500 max-w-xl text-sm font-inter">
                Your standing in the Swarm determines your protocol influence. 
                Higher reputation unlocks lower platform fees and priority agent tasking.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Current Status */}
            <div className="lg:col-span-1 space-y-8">
              <GlassCard className="p-8 border-4 border-white/10 rounded-none bg-black/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                  <Trophy className="w-12 h-12 text-white/5" />
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Current_Elevation:</span>
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter" style={{ color: currentRank.color }}>
                      {currentRank.rank}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">Trust_Score:</span>
                      <span className="text-2xl font-black italic text-white">{currentScore}</span>
                    </div>
                    <div className="h-4 bg-white/5 border border-white/10 p-1">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-white to-cyan-500"
                        style={{ backgroundColor: currentRank.color }}
                      />
                    </div>
                    {nextRank && (
                      <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 text-right">
                        NEXT_RANK: {nextRank.rank} AT {nextRank.threshold}
                      </div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-gray-600">Platform_Fee:</span>
                      <div className="text-xl font-black italic text-white">{currentRank.platformFee}%</div>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[9px] font-black uppercase text-gray-600">Uplink_Priority:</span>
                      <div className="text-xl font-black italic text-[#CCFF00]">HIGH</div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="p-6 border-4 border-dashed border-white/5 text-center space-y-4">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
                  Perform verified agent tasks to accelerate trust score accumulation.
                </p>
              </div>
            </div>

            {/* Right Column: Benefits Grid */}
            <div className="lg:col-span-2 space-y-8">
              <h3 className="text-2xl font-black italic uppercase tracking-tight text-white">Protocol_Benefits_Matrix</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {RANK_TIERS.map((tier) => (
                  <GlassCard key={tier.rank} className={`p-8 border-4 rounded-none transition-all ${
                    currentRank.rank === tier.rank ? "border-[#CCFF00] bg-[#CCFF00]/5" : "border-white/10 opacity-40"
                  }`}>
                    <div className="flex items-start justify-between mb-6">
                      <h4 className="text-xl font-black italic uppercase" style={{ color: tier.color }}>{tier.rank}</h4>
                      {currentRank.rank === tier.rank && <ShieldCheck className="w-5 h-5 text-[#CCFF00]" />}
                    </div>
                    
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white">
                        <Target className="w-3 h-3 opacity-50" />
                        <span>{tier.platformFee}% Platform Cut</span>
                      </li>
                      <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/60">
                        <Star className="w-3 h-3 opacity-50" />
                        <span>Standard Deployment</span>
                      </li>
                      {tier.threshold >= 2000 && (
                        <li className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">
                          <TrendingUp className="w-3 h-3" />
                          <span>PRIORITY_SWARM_UPLINK</span>
                        </li>
                      )}
                    </ul>
                  </GlassCard>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
