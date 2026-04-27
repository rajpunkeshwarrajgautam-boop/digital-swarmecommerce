"use client";

import { useEffect, useState } from "react";
import { Header } from "@/layout/Header";
import { Footer } from "@/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { TrendingUp, Users, DollarSign, Target, Zap, ArrowRight } from "lucide-react";
import { getAffiliatePayouts, CommissionRecord } from "@/app/actions/payouts";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AffiliateEarningsPage() {
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAffiliatePayouts();
        setRecords(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalEarnings = records.reduce((acc, r) => acc + Number(r.affiliate_share), 0);
  const conversionRate = records.length > 0 ? (records.length / 100) * 100 : 0; // Mock rate based on 100 clicks

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Referral Pulse</h1>
              <p className="text-gray-500 max-w-md text-sm font-inter">
                Monitor your network velocity and track referral commissions. Every successful protocol sync adds to your share.
              </p>
            </div>
            <Link href="/affiliate">
              <ForgeButton variant="ghost" className="h-14 px-8 border border-white/10 hover:bg-white/5 text-[10px] uppercase tracking-widest font-black">
                Back_to_Node
              </ForgeButton>
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard label="Total_Referral_Earnings" value={`₹${totalEarnings.toLocaleString()}`} icon={<DollarSign className="text-[#CCFF00]" />} />
            <MetricCard label="Total_Conversions" value={records.length.toString()} icon={<Zap className="text-purple-400" />} />
            <MetricCard label="Conversion_Rate" value={`${conversionRate.toFixed(1)}%`} icon={<Target className="text-cyan-400" />} />
            <MetricCard label="Network_Syncs" value="1,204" icon={<Users className="text-blue-400" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Earnings Ledger */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-black uppercase tracking-widest text-sm text-white/40 italic">{"/// EARNINGS_LEDGER ///"}</h3>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="p-20 text-center font-mono text-[10px] text-white/20 animate-pulse tracking-[0.4em]">SYNCING_NETWORK_DATA...</div>
                ) : records.length === 0 ? (
                  <GlassCard className="p-12 text-center border-dashed border-white/10">
                    <p className="text-white/40 font-inter text-sm mb-6">No referral commissions detected on this node yet.</p>
                    <Link href="/affiliate">
                      <ForgeButton variant="primary" className="h-12 px-8">Generate_Affiliate_Link</ForgeButton>
                    </Link>
                  </GlassCard>
                ) : (
                  records.map((record) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={record.id}
                    >
                      <GlassCard className="p-6 flex items-center justify-between group hover:border-[#CCFF00]/30 transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-[#CCFF00]/10 flex items-center justify-center border border-[#CCFF00]/20">
                            <TrendingUp className="text-[#CCFF00] w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="text-lg font-black italic uppercase text-white tracking-tight">Sync_Reward</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Order_#{record.order_id.slice(0, 8)}</span>
                              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{new Date(record.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black italic text-[#CCFF00] tracking-tighter">+₹{record.affiliate_share}</div>
                          <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">STATUS: {record.status}</div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Referral Strategy Sidebar */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="font-black uppercase tracking-widest text-sm text-white/40 italic">{"/// STRATEGY_ENGINE ///"}</h3>
              </div>

              <GlassCard className="p-6 space-y-8 border-4 border-white/10 rounded-none">
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Optimize_Conversion</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-inter">
                    Your conversion rate is currently <span className="text-[#CCFF00]">0.4%</span>. Deploy these tactics to increase network velocity:
                  </p>
                </div>

                <div className="space-y-4">
                  <StrategyItem label="Direct_Uplink" desc="Use custom referral slugs in Discord communities." />
                  <StrategyItem label="Value_Stacking" desc="Highlight whitelabel options for maximum ROI." />
                  <StrategyItem label="Visual_Proof" desc="Share dashboard screenshots to build trust." />
                </div>

                <ForgeButton variant="ghost" className="w-full h-12 border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-[#CCFF00] hover:text-black hover:border-black transition-all">
                  Generate_Tactical_Report
                </ForgeButton>
              </GlassCard>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function MetricCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-black/40 border border-white/5 p-6 relative overflow-hidden group hover:border-white/20 transition-all">
      <div className="flex items-center gap-3 mb-4 text-gray-400">
        {icon}
        <h3 className="font-bold text-[9px] uppercase tracking-[0.2em]">{label}</h3>
      </div>
      <div className="text-3xl font-black text-white italic tracking-tighter">{value}</div>
    </div>
  );
}

function StrategyItem({ label, desc }: { label: string, desc: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-[#CCFF00] transition-colors">{label}</span>
        <ArrowRight className="w-3 h-3 text-white/20 group-hover:text-[#CCFF00] group-hover:translate-x-1 transition-all" />
      </div>
      <p className="text-[9px] text-gray-600 font-inter">{desc}</p>
    </div>
  );
}
