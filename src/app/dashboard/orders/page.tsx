"use client";

import { motion } from "framer-motion";
import { History, Hash, Calendar, CreditCard, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getUserOrders } from "@/app/actions/user-assets";

type OrderItem = {
  price: number;
  quantity: number;
  products?: {
    name: string;
  } | {
    name: string;
  }[];
};

type Order = {
  id: string;
  status: string;
  cashfree_order_id?: string;
  created_at: string;
  total_amount: number;
  order_items?: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUserOrders();
        if (res.success && res.orders) {
          setOrders(res.orders as Order[]);
        }
      } catch (e) {
        console.error("Orders fetch error", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

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

      <div className="space-y-4">
        {isLoading ? (
           <div className="text-white/30 italic font-black uppercase text-xs tracking-widest">Querying transaction_ledger...</div>
        ) : orders.length === 0 ? (
           <div className="text-white/30 italic font-black uppercase text-xs tracking-widest border border-white/5 p-8 text-center">No active signatures found in history.</div>
        ) : orders.map((order, i) => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative bg-[#0d0d12] border-2 border-white/5 p-6 flex flex-col lg:flex-row items-center justify-between gap-8 hover:border-primary/40 transition-all"
          >
            <div className="flex flex-col md:flex-row items-center gap-10 flex-1 w-full">
              <div className="space-y-1 w-full md:w-auto">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Protocol_ID</p>
                <p className="text-sm font-black italic uppercase tracking-tighter flex items-center gap-2 text-white">
                   <Hash className="w-3.5 h-3.5 text-primary" /> {order.cashfree_order_id?.substring(0,12) || order.id.substring(0,8)}
                </p>
              </div>

              <div className="space-y-1 w-full md:w-auto">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Signature_Date</p>
                <p className="text-sm font-black italic uppercase tracking-tighter flex items-center gap-2 text-white">
                   <Calendar className="w-3.5 h-3.5 text-primary" /> {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-1 w-full md:w-auto">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Value_Transferred</p>
                <p className="text-sm font-black italic uppercase tracking-tighter flex items-center gap-2 text-white">
                   <CreditCard className="w-3.5 h-3.5 text-primary" /> ₹{order.total_amount}
                </p>
              </div>

              <div className="space-y-1 flex-1 w-full">
                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Manifest_Items</p>
                <div className="text-[10px] font-black uppercase tracking-widest text-primary italic truncate max-w-[200px]">
                   {order.order_items?.map(item => {
                     const prod = Array.isArray(item.products) ? item.products[0] : item.products;
                     return prod?.name;
                   }).join(" + ") || "Direct_Acquisition"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
               <span className={`px-4 py-1 text-[9px] font-black uppercase italic tracking-[0.2em] ${
                 order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'completed' || order.status.toLowerCase() === 'success'
                 ? 'bg-primary text-white shadow-[4px_4px_0_rgba(255,107,53,0.3)]' 
                 : 'bg-white/10 text-white/40'
               }`}>
                  {order.status || 'PROCESSED'}
               </span>
               <button className="p-3 bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all group">
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
