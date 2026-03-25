"use client";

import { motion } from "framer-motion";
import { HelpCircle, Terminal, Code, Cpu, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const faqs = [
  {
    q: "HOW DO I ACCESS MY PURCHASE?",
    a: "Immediately after checkout, you will be redirected to a download portal. A secure link will also be sent to your Clerk-registered email. Access is perpetual."
  },
  {
    q: "DO YOU PROVIDE INSTALLATION SUPPORT?",
    a: "Every product includes a 'Deployment Protocol' (README). For complex integrations, our elite engineers are available via the 'Contact Desk'."
  },
  {
    q: "IS THE CODE FULLY TYPED?",
    a: "Yes. All Digital Swarm templates utilize strict TypeScript for maximum architectural integrity and self-documenting logic."
  },
  {
    q: "CAN I USE THESE IN CLIENT PROJECTS?",
    a: "Affirmative. Our Standard Commercial License allows for unlimited use in both personal and client-facing commercial applications."
  }
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 overflow-hidden relative">
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="border-l-4 border-primary pl-8 py-4">
            <h1 className="text-6xl font-black italic uppercase tracking-tighter mb-4">Support_Protocols</h1>
            <p className="text-white/40 text-xl font-bold uppercase tracking-tight">Access technical intelligence and operational guidance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, i) => (
              <div key={i} className="p-8 border-2 border-white/5 bg-zinc-950/50 hover:border-primary/30 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <Terminal className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest">{faq.q}</h3>
                </div>
                <p className="text-white/40 text-sm font-bold leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="bg-primary p-12 text-black shadow-[12px_12px_0px_#333]">
             <h2 className="text-3xl font-black italic uppercase mb-4 leading-none">Need Direct Link?</h2>
             <p className="text-black/70 font-bold mb-8 uppercase tracking-tight">Our engineers are standing by at the Contact Desk for rapid response.</p>
             <Link href="/contact">
                <Button className="bg-black text-white hover:bg-zinc-800 border-none px-12 h-14 font-black uppercase tracking-widest">
                  Open Comms
                </Button>
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
