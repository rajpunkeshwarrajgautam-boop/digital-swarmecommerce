"use client";

import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone, Globe, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-32 pb-20 font-mono">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left: Info & Handshake Command */}
          <div className="space-y-12">
            <header className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Operational Handshake</span>
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
                Initiate <br />
                <span className="text-white/20 italic">Connection</span>
              </h1>
              <p className="text-white/40 text-lg font-medium leading-relaxed uppercase tracking-tight max-w-md">
                Direct integration with our core engineering team. Expect sub-ms response latency.
              </p>
            </header>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all shadow-xl">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Email Terminal</p>
                  <p className="text-xl font-black italic uppercase tracking-tighter">ops@digitalswarm.in</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all shadow-xl">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Physical Node</p>
                  <p className="text-xl font-black italic uppercase tracking-tighter">Silicon Oasis, Dubai, UAE</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-14 h-14 bg-white/5 border-2 border-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all shadow-xl">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">Emergency Uplink</p>
                  <p className="text-xl font-black italic uppercase tracking-tighter">+971 50 000 0000</p>
                </div>
              </div>
            </div>

            {/* Support Metrics Bar */}
            <div className="p-8 bg-white/5 border-2 border-white/5 rounded-3xl flex items-center justify-between opacity-50">
               <div className="text-center">
                 <div className="text-2xl font-black italic">14m</div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-white/40">Avg TTL</div>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="text-center">
                 <div className="text-2xl font-black italic">24/7</div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-white/40">Availability</div>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="text-center">
                 <div className="text-2xl font-black italic">100%</div>
                 <div className="text-[8px] font-black uppercase tracking-widest text-white/40">Fulfillment</div>
               </div>
            </div>
          </div>

          {/* Right: Handshake Form */}
          <div className="relative">
             <div className="bg-white border-8 border-black p-10 lg:p-16 shadow-[24px_24px_0_#ff6b35] relative z-10">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 text-black border-l-8 border-primary pl-6">
                   Transmission Input
                </h2>
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Callsign</label>
                       <input type="text" placeholder="John Doe" className="w-full bg-black/5 border-4 border-black p-5 font-black uppercase italic tracking-tighter text-lg focus:bg-[#CCFF00] focus:ring-0 outline-none transition-all shadow-[6px_6px_0_#000]" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Encryption Email</label>
                       <input type="email" placeholder="john@ops.com" className="w-full bg-black/5 border-4 border-black p-5 font-black uppercase italic tracking-tighter text-lg focus:bg-[#CCFF00] focus:ring-0 outline-none transition-all shadow-[6px_6px_0_#000]" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Operation Type</label>
                    <select className="w-full bg-black/5 border-4 border-black p-5 font-black uppercase italic tracking-tighter text-lg focus:bg-[#CCFF00] focus:ring-0 outline-none transition-all shadow-[6px_6px_0_#000] appearance-none">
                       <option>Enterprise Build</option>
                       <option>Custom AI Integration</option>
                       <option>Support Tier Query</option>
                       <option>Partnership Protocol</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 ml-1">Encryption Message</label>
                    <textarea rows={5} placeholder="State your objective..." className="w-full bg-black/5 border-4 border-black p-5 font-black uppercase italic tracking-tighter text-lg focus:bg-[#CCFF00] focus:ring-0 outline-none transition-all shadow-[6px_6px_0_#000] resize-none"></textarea>
                  </div>

                  <Button className="w-full py-8 text-xl font-black uppercase tracking-widest bg-black text-white hover:bg-primary transition-all flex items-center justify-center gap-4">
                     Execute Transmission <Send className="w-6 h-6" />
                  </Button>
                </form>
             </div>
             
             {/* Background Decoration */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-primary/20 blur-[150px] -z-10 rounded-full opacity-50" />
          </div>

        </div>

        {/* Truststrip */}
        <div className="mt-32 pt-20 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-20 grayscale transition-all hover:opacity-100 hover:grayscale-0">
           <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Secure Handshake</span>
           </div>
           <div className="flex items-center gap-3">
              <Globe className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Global Proxy</span>
           </div>
           <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-widest">Ultra Low Latency</span>
           </div>
           <div className="flex items-center gap-3">
              <span className="text-xl font-black italic tracking-tighter uppercase whitespace-nowrap">Status: Operational</span>
           </div>
        </div>

      </div>
    </div>
  );
}
