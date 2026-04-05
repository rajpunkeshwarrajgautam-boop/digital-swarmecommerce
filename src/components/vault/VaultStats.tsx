"use client";

import { motion } from 'framer-motion';
import { Box, Globe, Trophy } from 'lucide-react';

interface VaultStatsProps {
  stats: {
    total: number;
    nodes: number;
    rank: string;
  }
}

export function VaultStats({ stats }: VaultStatsProps) {
  const metaCards = [
    { label: 'Tokenized_Possessions', value: stats.total, icon: <Box className="w-5 h-5 text-primary" />, suffix: 'DSTs' },
    { label: 'Network_Affiliation', value: stats.nodes, icon: <Globe className="w-5 h-5 text-accent" />, suffix: 'Nodes' },
    { label: 'Swarm_Standing', value: stats.rank, icon: <Trophy className="w-5 h-5 text-[#FFD700]" />, suffix: '' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metaCards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative glass-panel rounded-2xl p-6 border border-white/10 overflow-hidden group"
        >
          {/* Decorative Pulse */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                {card.icon}
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-mono font-black uppercase tracking-widest text-white/30 italic">
                Active_Protocol
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">{card.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black italic uppercase tracking-tighter text-white transition-colors group-hover:text-primary">
                  {card.value}
                </span>
                {card.suffix && <span className="text-[10px] font-mono font-black text-white/40 italic">{card.suffix}</span>}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
