"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Cpu, Hash, Calendar, Globe } from "lucide-react";

interface LedgerReceiptProps {
  orderId: string;
  signature: string;
  timestamp: string;
  amount: number;
  nodeId?: string;
}

export const LedgerReceipt = ({ 
  orderId, 
  signature, 
  timestamp, 
  amount,
  nodeId
}: LedgerReceiptProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative group w-full"
    >
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#CCFF00] to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative bg-white border-4 border-black p-8 shadow-[12px_12px_0_#000] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#CCFF00]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 top-1/2 w-20 h-1 bg-black/5 rotate-90" />
        
        {/* Scanning Animation Line */}
        <motion.div 
          animate={{ y: [0, 320, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-[2px] bg-[#CCFF00] shadow-[0_0_15px_#CCFF00] z-10 opacity-30 pointer-events-none"
        />

        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <div className="bg-black p-2 border-2 border-[#CCFF00]">
                <ShieldCheck className="w-6 h-6 text-[#CCFF00]" />
              </div>
              <div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter">Sentinel_Receipt</h3>
                <p className="text-[10px] font-black uppercase text-black/40 tracking-[0.2em]">Verified_On_Swarm_Ledger</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-black/40 flex items-center gap-1">
                  <Hash className="w-2 h-2" /> Transaction_ID
                </span>
                <p className="font-mono text-xs font-bold break-all select-all">{orderId}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-black/40 flex items-center gap-1">
                  <Calendar className="w-2 h-2" /> Global_Timestamp
                </span>
                <p className="font-mono text-xs font-bold">{new Date(timestamp).toLocaleString()}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-[9px] font-black uppercase text-black/40 flex items-center gap-1">
                  <Globe className="w-2 h-2" /> Ledger_Signature
                </span>
                <p className="font-mono text-[10px] bg-black text-[#CCFF00] p-3 border-2 border-black shadow-[4px_4px_0_#000] break-all select-all leading-tight italic">
                  {signature}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center w-full md:w-auto p-6 bg-[#CCFF00] border-4 border-black shadow-[8px_8px_0_#000] rotate-2 shrink-0">
             <div className="flex items-center gap-2 mb-1">
                <Cpu className="w-4 h-4 text-black animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-black/60">Node: {nodeId || "ZERO_PRIME"}</span>
             </div>
             <p className="text-3xl font-black italic tracking-tighter">₹{amount.toFixed(2)}</p>
             <span className="text-[10px] font-black uppercase border-t-2 border-black pt-1 mt-2">Status: SUCCESS</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-10 pt-6 border-t-2 border-dashed border-black/10 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-black/30">
          <span>Swarm_Ledger_v1.0.4</span>
          <span>Proof_Of_Ownership_Verified</span>
        </div>
      </div>
    </motion.div>
  );
};
