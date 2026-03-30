import { Activity, DollarSign, Users, Target, ArrowUpRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { getAdminStats } from "@/app/actions/admin";

export default async function AdminDashboard() {
  const stats = await getAdminStats();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">System Telemetry</h1>
        <p className="text-gray-500 text-sm">Real-time aggregation of all revenue algorithms and traffic interceptors.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
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

        {/* Metric 2 */}
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

        {/* Metric 3 */}
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

        {/* Metric 4 */}
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

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Recent Pipeline Activity */}
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#CCFF00]">Recent Logic Syncs</h3>
          </div>
          <div className="divide-y divide-white/5">
            {stats.recentCarts?.length ? stats.recentCarts.map((cart, i) => (
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

        {/* Affiliate Payouts */}
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-widest text-sm text-[#CCFF00]">Network Affiliates</h3>
            <span className="text-[9px] bg-cyan-500/10 text-cyan-500 px-2 py-1 rounded font-black tracking-widest">REALTIME_FEED</span>
          </div>
          <div className="divide-y divide-white/5">
            {stats.recentAffiliates?.length ? stats.recentAffiliates.map((aff, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[8px] text-gray-600 uppercase tracking-widest font-black">Node_Identification</span>
                  <span className="font-mono text-xs text-gray-400 truncate w-32 tracking-tighter">{aff.id}</span>
                </div>
                <div className="font-black italic text-[#CCFF00] text-lg">
                  ₹{aff.total_earnings || 0}
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-600 text-[10px] font-black uppercase tracking-widest">Affiliate network dormant.</div>
            )}
          </div>
        </div>
      </div>

      {/* Brutalist Sales Chart (Milestone 3.3) */}
      <div className="bg-black/40 border border-white/10 p-8 rounded-2xl space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-[0.3em] text-xs text-white/40 italic">/// SALES_VELOCITY_MATRIX ///</h3>
            <span className="text-[10px] font-black text-[#CCFF00] tracking-widest uppercase">Protocol_Active</span>
         </div>
         <div className="flex items-end gap-2 h-48 border-b border-l border-white/5 p-4">
            {[60, 45, 90, 70, 100, 40, 85].map((val, i) => (
               <motion.div 
                 key={i}
                 initial={{ height: 0 }}
                 animate={{ height: `${val}%` }}
                 transition={{ delay: i * 0.1, duration: 1 }}
                 className="flex-1 bg-gradient-to-t from-[#CCFF00]/40 to-[#CCFF00] relative group"
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
    </div>
  );
}
