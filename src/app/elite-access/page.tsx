"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowRight, Sparkles, Diamond } from "lucide-react";
import Link from "next/link";
import NextImage from "next/image";

export default function EliteAccessPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Premium Dark Theme */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.05),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-swarm-pattern opacity-[0.05] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <header className="mb-24 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-none bg-primary/10 border border-primary/20 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Beyond Commercial Code</span>
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.75]">
               Elite <span className="text-primary italic">Access</span>
            </h1>
            <p className="text-2xl text-white/50 font-bold tracking-tight max-w-3xl leading-snug">
              Reserved for architects building empires. Access custom-engineered protocols, 1-on-1 architectural reviews, and our private vault of unreleased swarm intelligence.
            </p>

            <Link href="/pricing" className="mt-8 group relative">
              <div className="absolute inset-0 bg-primary blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative px-12 py-5 bg-primary text-white font-black uppercase italic tracking-[0.2em] rounded-none shadow-2xl flex items-center gap-4 hover:-translate-y-1 transition-all">
                 Join the Elite Swarm <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <EliteFeature 
            icon={Diamond} 
            title="Private Vault" 
            desc="Access codebases never released to the public library, including our proprietary swarm orchestrators."
          />
          <EliteFeature 
            icon={ShieldCheck} 
            title="Arch Review" 
            desc="Monthly 1-on-1 code reviews with Digital Swarm lead engineers to harden your specific implementation."
          />
          <EliteFeature 
            icon={Zap} 
            title="Priority Deploy" 
            desc="Get 24-hour response times on integration support and custom modification requests."
          />
        </div>

        {/* Visual Badge Background */}
        <div className="mt-32 p-2 relative">
           <div className="absolute inset-0 bg-white/5 rounded-none border border-white/10 backdrop-blur-3xl" />
           <div className="relative p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex flex-col gap-4 text-center lg:text-left">
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter">Membership Tiers</h2>
                 <p className="text-white/40 font-bold max-w-sm lowercase">Our elite protocols are restricted to qualified developers. Select your tier to proceed with authorization.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-12 opacity-30 grayscale contrast-125">
                 <NextImage src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" width={100} height={32} alt="Safe Payment" className="h-8 w-auto" />
                 <NextImage src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" width={100} height={32} alt="Secure Processor" className="h-8 w-auto" />
              </div>
              <Link href="/pricing" className="px-10 py-4 border-4 border-white text-white font-black uppercase italic tracking-widest hover:bg-white hover:text-black transition-all">
                 View Tiers
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

function EliteFeature({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) {
  return (
    <div className="relative p-10 bg-white/5 border border-white/10 rounded-none hover:bg-linear-to-b hover:from-primary/10 hover:to-transparent transition-all group overflow-hidden">
       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon className="w-32 h-32" />
       </div>
       <Icon className="w-12 h-12 text-primary mb-8 group-hover:rotate-12 transition-transform" />
       <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">{title}</h3>
       <p className="text-sm text-white/40 font-bold leading-relaxed">{desc}</p>
    </div>
  );
}
