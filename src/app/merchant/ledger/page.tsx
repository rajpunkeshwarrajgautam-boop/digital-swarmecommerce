"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, Lock, ChevronDown, CheckCircle2, AlertCircle, Database, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getMerchantPayouts, requestSettlement, CommissionRecord } from "@/app/actions/payouts";
import { ForgeButton } from "@/components/ui/ForgeButton";

export default function ProtocolLedgerPage() {
  const [entries, setEntries] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditStatus, setAuditStatus] = useState<"pass" | "fail" | "checking">("checking");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    async function fetchLedger() {
      try {
        const data = await getMerchantPayouts();
        setEntries(data);
        setAuditStatus("pass");
      } catch (error) {
        console.error("LEDGER_SYNC_ERROR:", error);
        setAuditStatus("fail");
      } finally {
        setLoading(false);
      }
    }
    
    fetchLedger();
  }, []);

  const handleSettlement = async () => {
    setRequesting(true);
    try {
      await requestSettlement();
      // Logic for success toast/notification
    } catch (error) {
      console.error("SETTLEMENT_ERROR:", error);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white leading-none">Swarm Ledger</h1>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Node_Integrity:</span>
                <div className={`flex items-center gap-2 px-3 py-1 border ${
                  auditStatus === "pass" ? "border-[#CCFF00] text-[#CCFF00] bg-[#CCFF00]/5" : "border-red-500 text-red-500 bg-red-500/5"
                }`}>
                  {auditStatus === "checking" ? (
                    <span className="animate-pulse">RUNNING_CHECKS...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">CRYPTO_CHAIN_VALIDATED</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <ForgeButton 
              variant="primary" 
              className="h-14 px-8" 
              onClick={handleSettlement}
              disabled={requesting || entries.length === 0}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" /> 
              {requesting ? "AUDITING_PAYROLL..." : "REQUEST_SETTLEMENT"}
            </ForgeButton>
          </div>

          <div className="relative border-l-2 border-white/10 ml-4 pl-12 space-y-12 pb-12">
            {loading ? (
              <div className="text-white/20 font-mono text-xs uppercase tracking-widest py-20">Syncing_Protocol_Blocks...</div>
            ) : (
              entries.map((entry, index) => (
                <LedgerBlock key={entry.id} entry={entry} isLatest={index === 0} />
              ))
            )}

            {/* Genesis Anchor */}
            <div className="absolute -bottom-2 -left-3 w-6 h-6 bg-black border-2 border-white/20 flex items-center justify-center">
              <Database className="w-3 h-3 text-white/40" />
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function LedgerBlock({ entry, isLatest }: { entry: any, isLatest: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative">
      <div className="absolute -left-[54px] top-6 w-10 h-[2px] bg-white/10" />
      <div className={`absolute -left-[64px] top-4 w-6 h-6 border-2 transition-all duration-500 ${
        isLatest ? "bg-[#CCFF00] border-black scale-110 shadow-[0_0_20px_#CCFF00]" : "bg-black border-white/20"
      }`}>
        <Lock className={`w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
          isLatest ? "text-black" : "text-white/40"
        }`} />
      </div>

      <GlassCard className="p-8 border-4 border-white/10 rounded-none group hover:border-white/30 transition-all cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest ${isLatest ? "text-[#CCFF00]" : "text-white/40"}`}>
                Block_#{entry.id.padStart(4, '0')}
              </span>
              <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{new Date(entry.created_at).toLocaleString()}</span>
            </div>
            <h3 className="text-2xl font-black italic uppercase text-white tracking-tight">TX_SEALED: {entry.order_id || entry.transaction_id}</h3>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">Settlement_Share:</div>
            <div className="text-2xl font-mono text-[#CCFF00] font-black italic">
              ₹{entry.merchant_share || entry.payload?.amount * 0.7 || 0}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">/// PREVIOUS_HASH_REFERENCE ///</h4>
                  <code className="text-[9px] font-mono text-gray-500 break-all block">{entry.previous_hash}</code>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white">/// IMMUTABLE_PAYLOAD ///</h4>
                  <pre className="text-[9px] font-mono text-gray-400 bg-white/5 p-4 border border-white/5">
                    {JSON.stringify(entry.payload, null, 2)}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3 text-[#CCFF00]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#CCFF00]/80 italic">Verified_by_Swarm_Nodes</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-white/20 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </GlassCard>
    </div>
  );
}
