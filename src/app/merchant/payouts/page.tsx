"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ForgeButton } from "@/components/ui/ForgeButton";
import { Wallet, ShieldCheck, History } from "lucide-react";
import { getMerchantPayouts, CommissionRecord, requestSettlement } from "@/app/actions/payouts";

export default function MerchantPayoutsPage() {
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMerchantPayouts()
      .then(setRecords)
      .catch(() => setMessage("Could not load the commission ledger."))
      .finally(() => setLoading(false));
  }, []);

  const totalRecorded = records.reduce((acc, r) => acc + Number(r.merchant_share || 0), 0);
  const pendingSettlement = records.filter((r) => r.status === 'pending').reduce((acc, r) => acc + Number(r.merchant_share || 0), 0);
  const settled = records.filter((r) => r.status === 'settled').reduce((acc, r) => acc + Number(r.merchant_share || 0), 0);

  async function handleSettlement() {
    setRequesting(true);
    setMessage("");
    try {
      const result = await requestSettlement();
      setMessage(result.message);
    } catch {
      setMessage("Could not record the settlement request. Please contact support@digitalswarm.in.");
    } finally {
      setRequesting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Commission Ledger</h1>
            <p className="text-gray-500 max-w-xl text-sm font-inter">
              These values come from recorded commission rows. Settlement requests enter a manual support review; this page does not represent an automated bank-payout rail.
            </p>
          </div>
          <ForgeButton variant="primary" className="h-16 px-10 text-sm font-black uppercase tracking-widest" onClick={handleSettlement} disabled={requesting || pendingSettlement === 0}>
            {requesting ? "Recording request..." : "Request settlement review"}
          </ForgeButton>
        </div>

        {message && <div className="p-4 border border-white/10 bg-white/5 text-sm text-white/70">{message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard label="Recorded merchant share" value={`₹${totalRecorded.toLocaleString('en-IN')}`} sub="All commission records" />
          <StatsCard label="Pending review" value={`₹${pendingSettlement.toLocaleString('en-IN')}`} sub="Status: pending" />
          <StatsCard label="Settled" value={`₹${settled.toLocaleString('en-IN')}`} sub="Status: settled" />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="font-black uppercase tracking-widest text-sm text-white/40 flex items-center gap-2"><History className="w-4 h-4" /> Commission records</h3>
          </div>

          <GlassCard className="overflow-hidden border border-white/10 bg-black/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Order</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Order total</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-primary">Merchant share</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Platform fee</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Recorded</th>
                    <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="p-12 text-center text-xs text-white/30">Loading ledger…</td></tr>
                  ) : records.length === 0 ? (
                    <tr><td colSpan={6} className="p-12 text-center text-xs text-white/30">No commission records yet.</td></tr>
                  ) : records.map((record) => (
                    <tr key={record.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                      <td className="p-4 font-mono text-xs text-white/60">#{record.order_id.slice(0, 12)}</td>
                      <td className="p-4 font-mono text-sm text-white">₹{Number(record.total_amount).toLocaleString('en-IN')}</td>
                      <td className="p-4 font-mono text-sm text-primary font-black">₹{Number(record.merchant_share).toLocaleString('en-IN')}</td>
                      <td className="p-4 font-mono text-xs text-gray-500">₹{Number(record.platform_fee).toLocaleString('en-IN')}</td>
                      <td className="p-4 font-mono text-xs text-gray-500">{new Date(record.created_at).toLocaleDateString()}</td>
                      <td className="p-4"><span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 border border-white/10 text-white/50">{record.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10">
          <ShieldCheck className="text-primary w-6 h-6 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Settlement policy</h4>
            <p className="text-sm text-gray-500 max-w-2xl">
              A request records a support ticket against the pending commission balance. Payment method, identity checks, taxes, disputes, and timing are confirmed during review.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatsCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-black/40 border border-white/10 p-8 relative overflow-hidden">
      <div className="space-y-2 relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{label}</h3>
        <div className="text-4xl font-black tracking-tighter text-white">{value}</div>
        <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{sub}</div>
      </div>
      <Wallet className="absolute top-5 right-5 w-10 h-10 text-white/5" />
    </div>
  );
}
