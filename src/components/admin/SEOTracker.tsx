"use client";

import { motion } from "framer-motion";
import { Activity, Globe, Zap, Database, AlertCircle } from "lucide-react";

export function SEOTracker() {
  return (
    <div className="bg-black/40 border border-white/10 p-8 rounded-2xl space-y-6 mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold uppercase tracking-[0.3em] text-xs text-[#CCFF00] italic">
            {"/// ALGORITHMIC_VISIBILITY ///"}
          </h3>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-1">Core Web Vitals & Search Matrix</p>
        </div>
        <span className="text-[10px] font-black bg-[#CCFF00]/10 text-[#CCFF00] px-2 py-1 border border-[#CCFF00]/20 tracking-widest uppercase">
          INDEXING_ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* LCP Metric */}
        <div className="border border-white/5 p-4 rounded-xl hover:border-cyan-500/30 transition-colors group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-cyan-500/5 blur-xl group-hover:bg-cyan-500/10 transition-colors" />
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">LCP (Render)</h4>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-white italic">1.2s</span>
            <span className="text-[9px] text-cyan-400 font-bold tracking-widest uppercase mb-1">[PASS]</span>
          </div>
        </div>

        {/* CLS Metric */}
        <div className="border border-white/5 p-4 rounded-xl hover:border-purple-500/30 transition-colors group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-purple-500/5 blur-xl group-hover:bg-purple-500/10 transition-colors" />
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-purple-400" />
            <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CLS (Shift)</h4>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-white italic">0.01</span>
            <span className="text-[9px] text-purple-400 font-bold tracking-widest uppercase mb-1">[PASS]</span>
          </div>
        </div>

        {/* INP Metric */}
        <div className="border border-white/5 p-4 rounded-xl hover:border-yellow-500/30 transition-colors group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-yellow-500/5 blur-xl group-hover:bg-yellow-500/10 transition-colors" />
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-yellow-500" />
            <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">INP (Interact)</h4>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-white italic">64ms</span>
            <span className="text-[9px] text-yellow-500 font-bold tracking-widest uppercase mb-1">[OPTIMAL]</span>
          </div>
        </div>

        {/* Indexed Pages */}
        <div className="border border-white/5 p-4 rounded-xl hover:border-[#CCFF00]/30 transition-colors group relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-[#CCFF00]/5 blur-xl group-hover:bg-[#CCFF00]/10 transition-colors" />
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-[#CCFF00]" />
            <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Indexed Nodes</h4>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-white italic">412</span>
            <span className="text-[9px] text-gray-500 font-bold tracking-widest uppercase mb-1">/ 415 Total</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-4 mt-4 flex items-center gap-2">
        <AlertCircle className="w-3 h-3 text-[#CCFF00]" />
        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Crawler Status: All automated bots have unrestricted access. No pending 404 anomalies detected in the swarm matrix.</span>
      </div>
    </div>
  );
}
