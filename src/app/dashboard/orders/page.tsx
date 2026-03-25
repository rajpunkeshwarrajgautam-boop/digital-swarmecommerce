"use client";

import { motion } from "framer-motion";
import { History, Hash, Calendar, CreditCard, ChevronRight } from "lucide-react";

// Mock order data
const orders = [
  {
    id: "99281",
    date: "MAR 25, 2026",
    total: "₹3,999",
    status: "FULFILLED",
    items: ["SaaS Launchpad Pro"]
  },
  {
    id: "98442",
    date: "MAR 22, 2026",
    total: "₹1,499",
    status: "FULFILLED",
    items: ["AI Agent Workforce (V1.2)"]
  }
];

export default function OrdersPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit"
        >
          <History className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Signature Logs</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
          Order <br />
          <span className="text-white/20 italic">History</span>
        </h1>
      </header>

      <div className="space-y-6">
        {orders.map((order, i) => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-white/5 border-4 border-black p-8 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-primary/20 transition-all shadow-[8px_8px_0_#000]"
          >
            <div className="flex flex-col md:flex-row items-center gap-12 flex-1">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Order_Hash</p>
                <p className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                   <Hash className="w-4 h-4 text-primary" /> {order.id}
                </p>
              </div>

              <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Timestamp</p>
                <p className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-primary" /> {order.date}
                </p>
              </div>

              <div className="space-y-1 text-center md:text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Total_Amount</p>
                <p className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                   <CreditCard className="w-4 h-4 text-primary" /> {order.total}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
               <span className="px-4 py-1.5 bg-green-500 text-black text-[10px] font-black uppercase italic tracking-widest shadow-[4px_4px_0_#000]">
                  {order.status}
               </span>
               <button className="p-4 bg-black border-2 border-white/10 hover:bg-white hover:text-black transition-all group">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
