import { Activity, CreditCard, DollarSign, Users, Target, ArrowUpRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
);

export default async function AdminDashboard() {
  // Aggregate Metrics in parallel
  const [
    { count: leadsCount },
    { count: affiliatesCount },
    { count: abandonedCartsCount },
    { data: recentCarts },
    { data: recentAffiliates }
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("affiliates").select("*", { count: "exact", head: true }),
    supabase.from("abandoned_carts").select("*", { count: "exact", head: true }),
    supabase.from("abandoned_carts").select("email, created_at, recovered").order("created_at", { ascending: false }).limit(5),
    supabase.from("affiliates").select("id, user_id, total_earnings").order("created_at", { ascending: false }).limit(5)
  ]);
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
            <span className="text-4xl font-black text-white italic tracking-tighter">₹0</span>
            <div className="flex items-center gap-1 text-[#CCFF00] text-xs font-bold">
              <ArrowUpRight className="w-3 h-3" /> +0.0%
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
            <span className="text-4xl font-black text-white italic tracking-tighter">₹0</span>
            <div className="text-gray-500 text-xs">From Swarm Elite</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-gray-400">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-xs uppercase tracking-widest">Captured Leads</h3>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-white italic tracking-tighter">{leadsCount || 0}</span>
            <div className="text-gray-500 text-xs">Total Database Records</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-black/40 border border-white/5 p-6 rounded-2xl relative overflow-hidden hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-gray-400">
            <Users className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-xs uppercase tracking-widest">Active Affiliates & Carts</h3>
          </div>
          <div className="space-y-1">
            <span className="text-4xl font-black text-white italic tracking-tighter">{affiliatesCount || 0}</span>
            <div className="text-[#CCFF00] text-xs font-bold mt-1 tracking-widest flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {abandonedCartsCount || 0} Abandonments Tracked
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        
        {/* Recent Pipeline Activity */}
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold uppercase tracking-widest text-sm">Recent Cart Activity</h3>
          </div>
          <div className="divide-y divide-white/5">
            {recentCarts?.length ? recentCarts.map((cart: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="font-mono text-sm text-gray-300">{cart.email || "Anonymous"}</div>
                <div className={`text-xs font-bold px-2 py-1 rounded ${cart.recovered ? 'bg-cyan-500/10 text-cyan-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {cart.recovered ? 'RECOVERED' : 'PENDING'}
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500 text-sm">No recent activity detected.</div>
            )}
          </div>
        </div>

        {/* Affiliate Payouts */}
        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold uppercase tracking-widest text-sm">Affiliate Ledgers</h3>
            <span className="text-xs bg-cyan-500/10 text-cyan-500 px-2 py-1 rounded font-bold">Live Data</span>
          </div>
          <div className="divide-y divide-white/5">
            {recentAffiliates?.length ? recentAffiliates.map((aff: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase">Affiliate ID</span>
                  <span className="font-mono text-sm text-gray-300 truncate w-32">{aff.id}</span>
                </div>
                <div className="font-black italic text-[#CCFF00]">
                  ₹{aff.total_earnings || 0}
                </div>
              </div>
            )) : (
              <div className="p-6 text-center text-gray-500 text-sm">No affiliate data available.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
