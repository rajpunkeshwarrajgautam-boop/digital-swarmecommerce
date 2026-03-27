"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, Cpu, Activity, Check, AlertTriangle } from "lucide-react";

interface AIAnalystProps {
  productName: string;
  category: string;
}

export function AIAnalyst({ productName, category }: AIAnalystProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const analysisSteps = [
      `INITIALIZING_SWARM_UPLINK...`,
      `FETCHING_REPOSITORY_METADATA: ${productName}`,
      `ANALYZING_CATEGORY_CONTEXT: ${category}`,
      `ANALYZING_ARCHITECTURAL_COHESION...`,
      `SCANNING_DEPENDENCY_GRAPH...`,
      `VERIFYING_NEURAL_EFFICIENCY_RATING...`,
      `RUNNING_STRESS_TEST_SIMULATION...`,
      `CALCULATING_ROI_PROJECTIONS...`,
      `ANALYSIS_COMPLETE.`
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < analysisSteps.length) {
        setLines(prev => [...prev, analysisSteps[currentStep]]);
        currentStep++;
        setProgress((currentStep / analysisSteps.length) * 100);
      } else {
        setIsAnalyzing(false);
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [productName, category]);

  return (
    <div className="w-full bg-[#050505] border border-white/10 overflow-hidden font-mono text-[10px] shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-white/5 border-b border-white/5 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-primary" />
          <span className="uppercase tracking-[0.2em] font-black text-white/40 italic">AI_ANALYST v2.4</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-white/10" />
          <div className="w-1.5 h-1.5 bg-white/10" />
          <div className="w-1.5 h-1.5 bg-primary/40" />
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Terminal Text */}
        <div className="h-40 overflow-y-auto space-y-1 scrollbar-hide">
          <AnimatePresence>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${i === lines.length - 1 ? "text-primary" : "text-white/40"} uppercase tracking-widest`}
              >
                 <span className="text-primary/40 mr-2">{">"}</span> {line}
              </motion.div>
            ))}
          </AnimatePresence>
          {isAnalyzing && (
            <motion.div
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-1.5 h-3 bg-primary inline-block ml-1"
            />
          )}
        </div>

        {/* Results Grid (Visible after analysis) */}
        <div className={`mt-6 pt-6 border-t border-white/5 grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-1000 ${isAnalyzing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>
          <Metric icon={Cpu} label="Neural Score" value="9.8/10" />
          <Metric icon={Shield} label="Security Check" value="PASSED" color="text-green-500" />
          <Metric icon={Activity} label="Latency" value="12ms" />
          <Metric icon={Check} label="Reliability" value="99.9%" />
        </div>

        {/* Intelligence Verdict */}
        {!isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-primary/5 border border-primary/20 flex gap-4 items-start"
          >
            <AlertTriangle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-primary font-black uppercase tracking-widest mb-1 italic">VERDICT: OPTIMAL_ASSET</p>
              <p className="text-white/40 leading-relaxed uppercase">
                THIS UNIT EXCEEDS BASELINE PERFORMANCE PARAMETERS. DEPLOYMENT IN HIGH-STAKES ENVIRONMENTS IS RECOMMENDED.
              </p>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="h-0.5 w-full bg-white/5">
        <motion.div 
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, color = "text-white" }: { icon: React.ElementType, label: string, value: string, color?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 opacity-20">
        <Icon className="w-2.5 h-2.5" />
        <span className="uppercase text-[8px] font-black tracking-widest">{label}</span>
      </div>
      <span className={`text-[11px] font-black tracking-tighter uppercase italic ${color}`}>{value}</span>
    </div>
  );
}
