"use client";

import { motion } from 'framer-motion';
import { Trophy, Zap, Star, Shield } from 'lucide-react';

interface ProfileBadgeProps {
  rank: string;
}

export function ProfileBadge({ rank }: ProfileBadgeProps) {
  const getRankConfig = (rankName: string) => {
    switch (rankName) {
      case 'SWARM_PRIME':
        return { 
          icon: <Trophy className="w-6 h-6 text-[#FFD700]" />, 
          color: 'from-[#FFD700] via-[#FDB931] to-[#91701E]', 
          label: 'Elite_Prime_Node', 
          borderColor: 'border-[#FFD700]/50'
        };
      case 'ARCHITECT':
        return { 
          icon: <Zap className="w-6 h-6 text-[#00ECFF]" />, 
          color: 'from-[#00ECFF] via-[#00B8FF] to-[#0085FF]', 
          label: 'Swarm_Architect', 
          borderColor: 'border-[#00ECFF]/50'
        };
      case 'INFILTRATOR':
        return { 
          icon: <Shield className="w-6 h-6 text-[#A0FE00]" />, 
          color: 'from-[#A0FE00] via-[#7ED957] to-[#1E9146]', 
          label: 'Master_Infiltrator', 
          borderColor: 'border-[#A0FE00]/50'
        };
      default:
        return { 
          icon: <Star className="w-6 h-6 text-white/60" />, 
          color: 'from-white/10 via-white/5 to-transparent', 
          label: 'Authorized_Initiate', 
          borderColor: 'border-white/20'
        };
    }
  };

  const config = getRankConfig(rank);

  return (
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative p-[1px] rounded-2xl bg-gradient-to-br ${config.color} ${config.borderColor} shadow-[0_0_20px_rgba(0,0,0,0.5)] group overflow-hidden`}
    >
      <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-6 flex flex-col items-center gap-2 relative overflow-hidden">
        {/* Animated Background Aura */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-br ${config.color} blur-[40px]`}
        />

        <div className="relative z-10 p-3 bg-white/5 rounded-full border border-white/10 group-hover:scale-110 transition-transform duration-500">
           {config.icon}
        </div>
        
        <div className="relative z-10 text-center space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Global_Status</p>
          <p className="text-xl font-black uppercase italic tracking-tighter text-white">
            {rank.replace('_', ' ')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
