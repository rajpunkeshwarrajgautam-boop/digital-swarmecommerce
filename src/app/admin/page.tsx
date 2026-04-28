"use client";

import { useSwarmSWR } from "@/hooks/useSwarmSWR";
import { Activity, DollarSign, Users, Target, ArrowUpRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { AdminStats, RecentCart, RecentPending } from "@/app/actions/admin";
import { SEOTracker } from "@/components/admin/SEOTracker";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useSwarmSWR<AdminStats>('/api/admin/stats', { dedupingInterval: 30000 });

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Activity className="w-12 h-12 text-[#CCFF00] animate-pulse" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-white/40 italic">Syncing_Swarm_Telemetry...</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">System Telemetry</h1>
        <p className="text-gray-500 text-sm">Real-time aggregation of all revenue algorithms and traffic interceptors.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-black/40 border border-[#CCFF00]/20 p-6 rounded-2xl relative overflow-hidden group hover:border-[#CCFF00]/50 transition-colors">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#CCFF00]/5 blur-2xl rounded-full group-hover:bg-[#CCFF00]/10 transition-colors" />
          <div className="flex items-center gap-3 mb-4 text-gray-400">
            <DollarSign className="w-5 h-5 text-[#CCFF00]" />
            <h3 className="font-bold text-xs uppercase tracking-widest">Gross Volume (30d)</h3>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-white italic tracking-tighter">₹{stats.grossVolume}</span>
            <div className="flex items-center gap-1 text-[#CCFF00] text-xs font-bold">
              <TrendingUp className="w-3 h-3" /> Real-time Logistics
            </div>
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-gray-400">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-xs uppercase tracking-widest">Active MRR</h3>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-white italic tracking-tighter">₹{stats.mrr}</span>
            <div className="text-gray-500 text-xs text-[9px] uppercase tracking-widest font-black italic">Active MRR Node</div>
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-gray-400">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-xs uppercase tracking-widest">Captured Leads</h3>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-white italic tracking-tighter">{stats.leadsCount}</span>
            <div className="text-gray-500 text-xs text-[9px] uppercase tracking-widest font-black italic">Captured Subjects</div>
          </div>
        </div>

        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-gray-400">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-xs uppercase tracking-widest">Active Affiliates & Carts</h3>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-white italic tracking-tighter">{stats.affiliatesCount}</span>
            <div className="text-[#CCFF00] text-xs font-bold mt-1 tracking-widest flex items-center gap-1 text-[9px] uppercase italic">
              <ArrowUpRight className="w-3 h-3" /> Network Expansion Active
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-black/40 border border-[#CCFF00]/20 rounded-2xl overflow-hidden group hover:border-[#CCFF00]/40 transition-colors">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#CCFF00]/2">
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#CCFF00]">Pending Merchant Syncs</h3>
            <span className="text-[9px] bg-[#CCFF00]/10 text-[#CCFF00] px-2 py-1 rounded font-black tracking-widest border border-[#CCFF00]/20">
              {stats.pendingSyncCount} PROTOCOLS_WAITING
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {stats.recentPending?.length ? stats.recentPending.map((item: RecentPending, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group/item">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white font-black uppercase tracking-tighter">{item.name}</span>
                  <span className="text-[8px] text-gray-600 font-mono tracking-widest mt-0.5">SOURCE: {item.merchant_id}</span>
                </div>
                <button className="text-[9px] font-black text-black bg-[#CCFF00] px-3 py-1.5 rounded-sm hover:bg-white transition-colors uppercase italic tracking-widest">
                  Verify_Node
                </button>
              </div>
            )) : (
              <div className="p-12 text-center">
                <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] italic">No pending synchronizations in queue.</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-widest text-sm text-white/40">Recent Logic Syncs</h3>
          </div>
          <div className="divide-y divide-white/5">
            {stats.recentCarts?.length ? stats.recentCarts.map((cart: RecentCart, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="font-mono text-[10px] text-gray-300 tracking-wider">{cart.email || "ANONYMOUS_NODE"}</div>
                <div className={`text-[9px] font-black px-3 py-1 rounded-sm tracking-widest ${cart.recovered ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                  {cart.recovered ? 'SYNC_RECOVERED' : 'PENDING_SIGNAL'}
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">No active interceptions found.</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-black/40 border border-white/10 p-8 rounded-2xl space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-[0.3em] text-xs text-white/40 italic">{"/// SALES_VELOCITY_MATRIX ///"}</h3>
            <span className="text-[10px] font-black text-[#CCFF00] tracking-widest uppercase">Protocol_Active</span>
         </div>
         <div className="flex items-end gap-2 h-48 border-b border-l border-white/5 p-4">
            {[60, 45, 90, 70, 100, 40, 85].map((val, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${val}%` }}
                 transition={{ delay: i * 0.1, duration: 1 }}
                 className="flex-1 bg-linear-to-t from-[#CCFF00]/40 to-[#CCFF00] relative group"
               >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] font-black px-2 py-1 uppercase italic pointer-events-none">
                     {val}%_LIFT
                  </div>
               </motion.div>
            ))}
         </div>
         <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
         </div>
      </div>

      <SEOTracker />
    </div>
  );
}
