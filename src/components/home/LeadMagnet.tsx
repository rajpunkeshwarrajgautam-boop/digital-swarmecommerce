"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

declare global {
  interface Window {
    fbq?: (command: string, event: string, params?: Record<string, unknown>) => void;
  }
}

export function LeadMagnet() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Track event if needed
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', { content_name: 'Free Audit' });
      }
    }, 2000);
  };

  return (
    <section className="py-40 relative overflow-hidden bg-background">
      <div className="container px-6 mx-auto">
        <div className="relative p-10 md:p-20 bg-zinc-950 border-4 border-white flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-8 opacity-10 blur-3xl bg-primary w-[500px] h-[500px] rounded-none translate-x-1/2 -translate-y-1/2" />
          
          <div className="relative z-10 space-y-10 max-w-2xl flex-1">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic border-b-2 border-primary pb-2">Diagnostic_Protocol_Active</span>
            
            <h2 className="text-5xl md:text-[7rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-6">
              Free_Market<br/>
              <span className="text-white">Audit_Scan</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/50 font-bold uppercase italic tracking-tighter leading-tight">
              Most Indian businesses are wasting <span className="text-primary italic">30% of their ad spend</span> on broken landing pages. We identify the leaks for free.
            </p>

            <ul className="space-y-4">
               {[
                 "Competitor_Traffic_Xray",
                 "Conversion_Rate_Leak_Scan",
                 "Mobile_Latency_Audit",
                 "SEO_Visibility_Matrix"
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">
                    <CheckCircle className="w-4 h-4 text-primary" /> {item}
                 </li>
               ))}
            </ul>
          </div>

          <div className="relative z-10 flex-1 w-full max-w-lg">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="p-8 md:p-12 bg-black/60 border border-white/10 backdrop-blur-xl space-y-6 shadow-[30px_30px_0px_rgba(0,0,0,0.5)]">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Website_URL</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                      required
                      type="url" 
                      placeholder="HTTPS://YOURWEBSITE.IN"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 p-5 pl-12 text-sm font-black uppercase italic tracking-tighter focus:border-primary/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">Comms_Relay (Email)</label>
                  <input 
                    required
                    type="email" 
                    placeholder="CORE@LEADER.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 p-5 text-sm font-black uppercase italic tracking-tighter focus:border-primary/50 outline-none transition-all"
                  />
                </div>

                <Button 
                  disabled={isSubmitting}
                  className="w-full h-20 bg-primary text-black font-black uppercase tracking-widest rounded-none text-lg hover:bg-white transition-all shadow-[8px_8px_0px_#000] active:shadow-none translate-x-px translate-y-px active:translate-x-2 active:translate-y-2"
                >
                  {isSubmitting ? "Scanning_Mainframe..." : "Initiate Audit Scan"} <Zap className="w-5 h-5 ml-4" />
                </Button>
                
                <p className="text-[8px] font-black uppercase tracking-widest text-white/20 text-center italic">Encryption_Active // Audit_Reports_Delivered_In_24H</p>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 bg-primary text-black border-4 border-black text-center space-y-6 shadow-[30px_30px_0px_rgba(var(--primary-rgb),0.2)]"
              >
                 <CheckCircle className="w-16 h-16 mx-auto" />
                 <h3 className="text-4xl font-black italic uppercase leading-none">Scan_Initiated</h3>
                 <p className="text-sm font-black uppercase italic tracking-tighter opacity-80">
                   Our agents are analyzing {url.replace('https://', '')}. <br/> Intel report will hit {email} within 24 hours.
                 </p>
                 <Button variant="outline" className="border-black text-black uppercase font-black italic text-xs tracking-widest h-12" onClick={() => setIsSuccess(false)}>
                    New_Scan <ArrowRight className="w-4 h-4 ml-4" />
                 </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
