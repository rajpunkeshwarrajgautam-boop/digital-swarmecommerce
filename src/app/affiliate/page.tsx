"use client";

import { useState, useEffect } from "react";
import { 
  Zap, 
  Target, 
  ArrowRight, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  Cpu, 
  Share2,
  Copy,
  CheckCircle2,
  Terminal
} from "lucide-react";

export default function AffiliatePage() {
  const [copied, setCopied] = useState(false);
  const [isLogged, setIsLogged] = useState(false); // Simulated auth for demo
  const [refId, setRefId] = useState("OPERATOR_881");

  const copyLink = () => {
    navigator.clipboard.writeText(`https://digitalswarm.in/?ref=${refId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#050505]">
      {/* Background Noise/Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0"></div>

      <div className="container mx-auto px-4 py-32 relative z-10">
        {/* Header Section */}
        <div className="max-w-5xl mx-auto mb-20 text-center relative">
          <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 px-6 py-1 border-2 border-black bg-[#CCFF00] text-black text-[10px] font-black tracking-[4px] uppercase italic rotate-[-2deg] shadow-[4px_4px_0_#000]">
            System_Partnership_Protocol
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-white uppercase drop-shadow-[5px_5px_0_#CCFF00] leading-none mb-4">
            Affiliate_Command
          </h1>
          <p className="text-xl md:text-2xl font-black text-[#CCFF00] uppercase tracking-widest italic flex items-center justify-center gap-3">
             <Cpu className="w-8 h-8" /> Scalable Revenue Distribution Matrix
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
          {/* Left Column: Benefits & Stats */}
          <div className="lg:col-span-7 space-y-12">
            <div className="bg-[#ffffff] border-8 border-black p-10 shadow-[20px_20px_0_#CCFF00] relative">
              <div className="absolute top-0 right-0 p-4 border-l-8 border-b-8 border-black bg-black text-[#CCFF00] font-black text-xs uppercase tracking-tighter">
                COMMISSION: 50%_SPLIT
              </div>
              
              <h2 className="text-4xl font-black text-black italic uppercase tracking-tighter mb-8 border-b-4 border-black pb-4">
                Economic_Yield_Data
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4 p-6 border-4 border-black bg-[#f4f4f4] shadow-[6px_6px_0_#000]">
                  <div className="flex items-center gap-3">
                    <Zap className="text-[#CCFF00] fill-black w-8 h-8" />
                    <span className="font-black text-3xl italic text-black">High_Conversion</span>
                  </div>
                  <p className="font-black text-xs uppercase text-black/60 leading-relaxed">
                    Our Planet ONO brutalist interface converts visitors at 2.5x the industry average for AI assets.
                  </p>
                </div>
                
                <div className="space-y-4 p-6 border-4 border-black bg-black text-[#CCFF00] shadow-[6px_6px_0_#CCFF00]">
                  <div className="flex items-center gap-3">
                    <Target className="w-8 h-8" />
                    <span className="font-black text-3xl italic">Massive_Payouts</span>
                  </div>
                  <p className="font-black text-xs uppercase text-white/60 leading-relaxed">
                    Average order value: ₹3,499. You keep ₹1,749 per verified tactical deployment.
                  </p>
                </div>
              </div>

              <div className="mt-12 bg-black text-white p-8 border-4 border-black shadow-[inset_0_0_20px_rgba(204,255,0,0.2)]">
                <div className="flex items-center justify-between gap-4 mb-6">
                   <h4 className="font-black italic uppercase tracking-[2px] text-[#CCFF00]">Affiliate_Link_Generator</h4>
                   <Terminal className="w-6 h-6 text-[#CCFF00]" />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-[#111] border-2 border-[#CCFF00] p-4 font-mono text-[#CCFF00] text-sm break-all">
                    https://digitalswarm.in/?ref={refId}
                  </div>
                  <button 
                    onClick={copyLink}
                    className="bg-[#CCFF00] text-black border-4 border-black px-8 py-4 font-black uppercase italic shadow-[4px_4px_0_#fff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2 shrink-0 h-full"
                  >
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? "COPIED" : "UPLINK"}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
               {[
                 { icon: Users, label: "CLICKS", val: "102" },
                 { icon: Target, label: "CONVERSIONS", val: "14" },
                 { icon: BarChart3, label: "EQUITY", val: "₹24,486" }
               ].map((stat, i) => (
                 <div key={i} className="bg-white border-4 border-black p-4 shadow-[8px_8px_0_#000] text-center">
                   <stat.icon className="w-6 h-6 mx-auto mb-2 text-black" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-black/50">{stat.label}</p>
                   <p className="text-2xl font-black text-black italic">{stat.val}</p>
                 </div>
               ))}
            </div>
          </div>

          {/* Right Column: Steps */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#CCFF00] border-8 border-black p-10 shadow-[20px_20px_0_#fff] relative rotate-[1deg]">
               <h3 className="text-4xl font-black text-black italic uppercase tracking-tighter mb-8 leading-none">
                 The_Distribution_Sequence
               </h3>
               
               <div className="space-y-8 relative">
                  <div className="absolute left-[19px] top-4 bottom-4 w-1 bg-black/10"></div>
                  
                  {[
                    { num: "01", title: "Generate_Hash", desc: "Unlock your unique referral payload in your dashboard console." },
                    { num: "02", title: "Deploy_Traffic", desc: "Spread the tactical URL across X, LinkedIn, and Discord pods." },
                    { num: "03", title: "Manual_Verify", desc: "Every purchase is logged in the Digital Swarm core ledger." },
                    { num: "04", title: "Extract_Payout", desc: "Receive direct Bank/UPI wire transfers every Friday at 12:00 GMT." }
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6 relative z-10">
                      <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black italic border-2 border-black shadow-[4px_4px_0_#fff] shrink-0">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="font-black text-xl italic uppercase text-black tracking-tight">{step.title}</h4>
                        <p className="text-xs font-black uppercase text-black/50 leading-tight mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <button className="w-full bg-[#ffc737] border-8 border-black p-8 shadow-[15px_15px_0_#000] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all group">
               <div className="flex items-center justify-between">
                  <div className="text-left">
                     <p className="text-xs font-black uppercase tracking-widest text-black/60 mb-1 italic">Ready_for_deployment?</p>
                     <h4 className="text-4xl font-black text-black italic uppercase tracking-tighter">INITIALIZE_ACCOUNT</h4>
                  </div>
                  <ArrowRight className="w-12 h-12 text-black group-hover:translate-x-4 transition-transform" />
               </div>
            </button>

            <div className="bg-[#f0f0f0] border-4 border-black p-6 flex items-center gap-4 shadow-[8px_8px_0_#000]">
              <ShieldCheck className="w-10 h-10 text-black fill-[#CCFF00]" />
              <p className="font-black uppercase text-[10px] tracking-widest text-black/70 italic">
                Verified Security Protocols Active. All commissions tracked by the Swarm Ledger V2.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="mt-32 border-t-8 border-black pt-8 flex justify-between items-end opacity-20 hover:opacity-100 transition-opacity">
           <div className="font-black italic text-8xl text-white select-none">AFFILIATE</div>
           <div className="font-black uppercase tracking-widest text-[#CCFF00] text-sm animate-pulse">UPLINK_STABLE // SYSTEM_READY</div>
        </div>
      </div>
    </div>
  );
}
