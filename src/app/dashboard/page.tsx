"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { 
  Zap, 
  ChevronRight, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Clock,
  Box,
  Activity
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

// Mock data - would normally fetch from Supabase
const activeProtocols = [
  {
    id: "p1",
    name: "AI Agent Workforce (V1.2)",
    status: "ACTIVE",
    acquired: "2026-03-22",
    version: "1.2.4",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=300"
  },
  {
    id: "p2",
    name: "SaaS Launchpad Pro",
    status: "PROVISIONING",
    acquired: "2026-03-25",
    version: "2.0.1",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=300"
  }
];

export default function DashboardPage() {
  const { user } = useUser();
  const [greeting] = useState(() => {
    const hours = new Date().getHours();
    if (hours < 12) return "Morning_Protocol Active";
    if (hours < 18) return "Afternoon_Sync Operational";
    return "Evening_Shutdown Approaching";
  });

  return (
    <div className="space-y-12">
      
      {/* Dashboard Hero */}
      <header className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit"
        >
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Status: System_Nominal</span>
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
          {greeting}, <br />
          <span className="text-white/20 italic">{user?.firstName || "Agent"}</span>
        </h1>
      </header>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Active Protocols", value: "02", icon: Box },
          { label: "Acquisition Tier", value: "ELITE", icon: ShieldCheck },
          { label: "System Uptime", value: "100%", icon: Activity }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white/5 border-4 border-black shadow-[8px_8px_0_#000] group hover:border-primary/20 transition-all"
          >
            <stat.icon className="w-6 h-6 text-primary mb-6 group-hover:scale-110 transition-transform" />
            <p className="text-4xl font-black italic text-white mb-1 tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Asset Repository */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b-4 border-black pb-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Active Protocols</h2>
          <Button variant="ghost" className="text-white/30 hover:text-white group">
            All Assets <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {activeProtocols.map((asset, i) => (
            <motion.div 
              key={asset.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/5 border-4 border-black flex flex-col md:flex-row gap-8 shadow-[12px_12px_0_#000] hover:shadow-[12px_12px_0_#ff6b35] transition-all"
            >
              <div className="w-32 h-32 bg-black border-2 border-white/10 shrink-0 grayscale hover:grayscale-0 transition-all overflow-hidden relative">
                <Image 
                  src={user?.imageUrl || asset.image} 
                  alt={user?.fullName || asset.name} 
                  fill 
                  className="object-cover" 
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2 py-0.5 shadow-[2px_2px_0_#000] italic ${asset.status === 'ACTIVE' ? 'bg-green-500 text-black' : 'bg-primary text-white'}`}>
                    {asset.status}
                  </span>
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">VER_{asset.version}</span>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{asset.name}</h3>
                
                <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-all">
                      <Download className="w-3.5 h-3.5" /> Manifest_ZIP
                   </button>
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">
                      <ExternalLink className="w-3.5 h-3.5" /> Documentation
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white text-black p-8 border-8 border-black shadow-[24px_24px_0_#ff6b35] relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Recent Logistics</h3>
               </div>
               <p className="text-black/40 text-[10px] font-black uppercase tracking-widest">Tracking last signature for order_#99281</p>
            </div>
            
            <Link href="/dashboard/orders">
              <Button className="bg-black text-white px-10 py-5 font-black uppercase tracking-widest hover:bg-[#ff6b35] transition-all">
                 Review All Orders
              </Button>
            </Link>
         </div>
      </section>

    </div>
  );
}
