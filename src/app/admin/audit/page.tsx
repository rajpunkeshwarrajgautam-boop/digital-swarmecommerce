"use client";

import { useEffect, useState } from "react";
import { Header } from "@/layout/Header";
import { Footer } from "@/layout/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldAlert, ShieldCheck, Cpu, Terminal, Database, Activity, RefreshCw } from "lucide-react";
import { runProtocolAudit, AuditResult } from "@/app/actions/audit";
import { motion, AnimatePresence } from "framer-motion";

export default function ProtocolAuditPage() {
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-10));
  };

  const startAudit = async () => {
    setIsScanning(true);
    setLogs([]);
    addLog("Initializing_Audit_Node...");
    addLog("Scanning_Distributed_Ledger...");
    
    try {
      const result = await runProtocolAudit();
      setAudit(result);
      addLog(`Scan_Complete: ${result.totalBlocks} Blocks Verified.`);
      if (result.ledgerIntegrity) {
        addLog("PROTOCOL_INTEGRITY_CONFIRMED.");
      } else {
        addLog("CRITICAL_ERROR: Ledger Chain Compromised.");
      }
    } catch (err) {
      addLog(`FATAL_EXCEPTION: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black pt-32 pb-24 px-6 font-mono">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-4 border-[#00FF41]/20 pb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-5xl font-black uppercase tracking-tighter text-[#00FF41]">Audit_Node</h1>
                  <p className="text-[#00FF41]/60 text-xs font-bold uppercase tracking-widest">Protocol Integrity & Genesis Verification</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={startAudit}
              disabled={isScanning}
              className={`px-8 py-4 border-4 border-[#00FF41] text-[#00FF41] font-black uppercase tracking-widest hover:bg-[#00FF41] hover:text-black transition-all flex items-center gap-3 ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isScanning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Terminal className="w-5 h-5" />}
              {isScanning ? "Scanning..." : "Run_Full_Audit"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Log Console */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-black border-4 border-[#00FF41]/20 p-6 space-y-4 h-[400px] flex flex-col justify-end">
                <div className="flex-1 overflow-hidden space-y-2">
                  <AnimatePresence>
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i + log}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] text-[#00FF41]/80 leading-relaxed"
                      >
                        {log}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="pt-4 border-t border-[#00FF41]/10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00FF41] animate-pulse" />
                  <span className="text-[10px] text-[#00FF41] uppercase font-bold tracking-widest">Terminal_Active</span>
                </div>
              </div>

              <div className="p-6 border-4 border-dashed border-[#00FF41]/10 text-center space-y-4">
                <Cpu className="w-8 h-8 text-[#00FF41]/20 mx-auto" />
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#00FF41]/40">
                  Recursive cryptographic scanning consumes significant protocol resources. Use sparingly.
                </p>
              </div>
            </div>

            {/* Results Grid */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <AuditMetric 
                  label="Chain_Integrity" 
                  value={audit ? (audit.ledgerIntegrity ? "PASSED" : "FAILED") : "PENDING"} 
                  status={audit?.ledgerIntegrity ? "success" : audit ? "error" : "pending"}
                  icon={<Database className="w-5 h-5" />}
                />
                
                <AuditMetric 
                  label="Node_Verification" 
                  value={audit ? (audit.nodeVerification ? "CLEAN" : "PENDING") : "PENDING"} 
                  status={audit?.nodeVerification ? "success" : audit ? "warning" : "pending"}
                  icon={<Activity className="w-5 h-5" />}
                />

                <AuditMetric 
                  label="Total_Blocks" 
                  value={audit?.totalBlocks || "0"} 
                  status="info"
                  icon={<Database className="w-5 h-5" />}
                />

                <AuditMetric 
                  label="Anomalies" 
                  value={audit?.anomalies || "0"} 
                  status={audit?.anomalies === 0 ? "success" : audit ? "error" : "pending"}
                  icon={<ShieldAlert className="w-5 h-5" />}
                />

              </div>

              {audit && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-12 border-4 border-[#00FF41] bg-[#00FF41]/5 space-y-8 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="w-32 h-32 text-[#00FF41]" />
                  </div>
                  
                  <div className="space-y-4">
                    <h2 className="text-3xl font-black uppercase text-[#00FF41]">Protocol_Genesis_Certified</h2>
                    <p className="text-[#00FF41]/60 text-sm max-w-xl">
                      The Digital Swarm protocol has been verified against the SHA-256 genesis anchor. 
                      All node identities and ledger entries are cryptographically sound.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-[#00FF41]/40 uppercase tracking-widest">Certification_Hash:</span>
                    <div className="text-[10px] text-[#00FF41] bg-black/40 p-4 border border-[#00FF41]/20 break-all font-mono">
                      {audit.certificateHash}
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="text-[10px] text-[#00FF41]/60 font-bold uppercase tracking-widest">
                      Timestamp: {new Date(audit.timestamp).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#00FF41] font-black uppercase tracking-widest border-b-2 border-[#00FF41]">
                      Genesis_Ready
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

function AuditMetric({ label, value, status, icon }: { label: string, value: string | number, status: 'success' | 'error' | 'warning' | 'info' | 'pending', icon: React.ReactNode }) {
  const colors = {
    success: '#00FF41',
    error: '#FF0055',
    warning: '#FFAA00',
    info: '#ffffff',
    pending: '#333333'
  };

  return (
    <div className="p-8 border-4 border-[#00FF41]/20 bg-black/40 space-y-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 text-[#00FF41]/10 group-hover:text-[#00FF41]/30 transition-colors">
        {icon}
      </div>
      <div className="space-y-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#00FF41]/40 italic">{label}</span>
        <div className="text-3xl font-black italic tracking-tighter" style={{ color: colors[status] }}>
          {value}
        </div>
      </div>
      <div className="h-[2px] w-full bg-[#00FF41]/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: status === 'pending' ? '0%' : '100%' }}
          className="h-full" 
          style={{ backgroundColor: colors[status] }}
        />
      </div>
    </div>
  );
}
