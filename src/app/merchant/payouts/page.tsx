"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { Wallet, ArrowUpRight, Clock, ShieldCheck, Download, History } from "lucide-react";
import { getMerchantPayouts, CommissionRecord, requestSettlement } from "@/app/actions/payouts";
import { motion } from "framer-motion";

export default function MerchantPayoutsPage() {
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMerchantPayouts();
        setRecords(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalEarnings = records.reduce((acc, r) => acc + Number(r.merchant_share), 0);
  const pendingSettlement = records
    .filter(r => r.status === 'pending')
    .reduce((acc, r) => acc + Number(r.merchant_share), 0);

  async function handleSettlement() {
    setRequesting(true);
    await requestSettlement();
    setTimeout(() => {
      setRequesting(false);
      alert("SETTLEMENT_REQUEST_RECEIVED: Audit node initiated.");
    }, 1500);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">The Vault</h1>
              <p className="text-gray-500 max-w-md text-sm font-inter">
                Monitor your financial velocity and manage protocol settlements. All shares are calculated in real-time per order sync.
              </p>
            </div>
            <div className="flex gap-4">
              <ForgeButton 
                variant="primary" 
                className="h-16 px-10 text-sm font-black italic uppercase tracking-widest"
                onClick={handleSettlement}
                disabled={requesting || pendingSettlement === 0}
              >
                {requesting ? "Processing_Request..." : "Request_Settlement"}
              </ForgeButton>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard 
              label="Total_Earnings" 
              value={`₹${totalEarnings.toLocaleString()}`} 
              sub="ALL_TIME_SHARE" 
              color="text-[#CCFF00]"
            />
            <StatsCard 
              label="Pending_Settlement" 
              value={`₹${pendingSettlement.toLocaleString()}`} 
              sub="AUDIT_IN_PROGRESS" 
              color="text-white"
            />
            <StatsCard 
              label="Node_Tier" 
              value="80%" 
              sub="PRO_TIER_LOCKED" 
              color="text-cyan-400"
            />
          </div>

          {/* Ledger Table */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-black uppercase tracking-widest text-sm text-white/40 italic flex items-center gap-2">
                <History className="w-4 h-4" /> {"/// FINANCIAL_LEDGER ///"}
              </h3>
            </div>

            <GlassCard className="overflow-hidden border-4 border-white/10 rounded-none bg-black/40">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Order_ID</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Total_Value</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Merchant_Share</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Platform_Fee</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Timestamp</th>
                      <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] animate-pulse">
                          Syncing_Financial_Nodes...
                        </td>
                      </tr>
                    ) : records.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">
                          NO_TRANSACTIONS_DETECTED
                        </td>
                      </tr>
                    ) : (
                      records.map((record) => (
                        <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                          <td className="p-4 font-mono text-xs text-white/60">#{record.order_id.slice(0, 8)}</td>
                          <td className="p-4 font-mono text-sm text-white">₹{record.total_amount}</td>
                          <td className="p-4 font-mono text-sm text-[#CCFF00] font-black">₹{record.merchant_share}</td>
                          <td className="p-4 font-mono text-xs text-gray-500">₹{record.platform_fee}</td>
                          <td className="p-4 font-mono text-xs text-gray-500">{new Date(record.created_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-none border ${
                              record.status === 'settled' 
                                ? 'bg-[#CCFF00]/10 border-[#CCFF00]/30 text-[#CCFF00]' 
                                : 'bg-white/5 border-white/10 text-white/40'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-4 p-6 bg-white/5 border border-white/10">
            <ShieldCheck className="text-[#CCFF00] w-6 h-6" />
            <div className="space-y-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Encrypted_Audit_Trail</h4>
              <p className="text-[9px] text-gray-500 font-inter max-w-lg">
                All financial distributions are locked via HMAC signatures and verified across the Swarm Registry. Payouts are processed every 72 hours for verified nodes.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function StatsCard({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) {
  return (
    <div className="bg-black/40 border-4 border-white/10 p-8 rounded-none relative overflow-hidden group hover:border-white/30 transition-all">
      <div className="space-y-2 relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">{label}</h3>
        <div className={`text-4xl font-black italic tracking-tighter ${color}`}>{value}</div>
        <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{sub}</div>
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Wallet className="w-12 h-12 text-white" />
      </div>
    </div>
  );
}
