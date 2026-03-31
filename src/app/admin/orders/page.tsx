"use client";

import { motion } from "framer-motion";
import { History, Hash, Calendar, CreditCard, User, Download, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminOrders } from "@/app/actions/admin";
import { useToastStore } from "@/components/ui/ForgeToast";

import { AdminOrder } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToastStore();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (e) {
      addToast("ERROR", "DATA_RETRIEVAL_FAILURE", "UNABLE TO SYNC LOGISTICS LEDGER");
    } finally {
      setIsLoading(false);
    }
  }

  function exportCSV() {
    if (!orders.length) return;
    const headers = ["Order ID", "Customer", "Email", "Total", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...orders.map(o => [
        o.cashfree_order_id || o.id,
        o.customer_name || "Agent_Anon",
        o.customer_email,
        o.total,
        o.status,
        new Date(o.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `digital-swarm-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    addToast("INFO", "CSV_EXPORT_COMPLETE", "TRANSACTION LOG GENERATED SUCCESSFULLY");
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#CCFF00] text-[10px] font-black uppercase tracking-widest italic">
            <History className="w-3 h-3" /> Logistics_Audit_v4.2
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Transaction_Ledger</h1>
        </div>
        
        <button 
          onClick={exportCSV}
          className="flex items-center gap-3 px-8 py-5 border-4 border-black bg-white text-black font-black uppercase italic tracking-widest text-xs hover:bg-[#CCFF00] transition-all shadow-[8px_8px_0_#000]"
        >
          <Download className="w-4 h-4" /> Export_CSV_Data
        </button>
      </header>

      <div className="space-y-2">
        {isLoading ? (
          <div className="text-white/20 italic font-black uppercase text-xs tracking-widest animate-pulse">Syncing logistics_database...</div>
        ) : orders.length === 0 ? (
          <div className="text-white/20 italic font-black uppercase text-xs tracking-widest border-2 border-dashed border-white/5 p-12 text-center">No transaction records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white/30 text-left">
                  <th className="pb-4 pr-6">Signature_ID</th>
                  <th className="pb-4 pr-6">Identity</th>
                  <th className="pb-4 pr-6">Fulfillment_Manifest</th>
                  <th className="pb-4 pr-6 text-right">Value</th>
                  <th className="pb-4 pl-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order, i) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-white/2 transition-colors"
                  >
                    <td className="py-6 pr-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-white/40 tracking-wider flex items-center gap-1">
                             <Hash className="w-3 h-3" /> {order.cashfree_order_id || order.id.substring(0,8)}
                          </span>
                          <span className="text-[9px] font-black italic text-white group-hover:text-[#CCFF00] transition-colors flex items-center gap-1">
                             <Calendar className="w-3 h-3 text-primary" /> {new Date(order.created_at).toLocaleDateString()}
                          </span>
                       </div>
                    </td>
                    <td className="py-6 pr-6">
                       <div className="flex flex-col gap-1">
                          <span className="text-xs font-black italic uppercase tracking-tight text-white flex items-center gap-2">
                             <User className="w-3.5 h-3.5 text-primary" /> {order.customer_name || "Agent_Anon"}
                          </span>
                          <span className="text-[9px] font-mono text-white/30 truncate max-w-[150px]">{order.customer_email}</span>
                       </div>
                    </td>
                    <td className="py-6 pr-6">
                       <div className="flex flex-col gap-0.5 max-w-[250px]">
                          {order.order_items?.map((item, idx) => (
                            <span key={idx} className="text-[9px] font-black uppercase tracking-widest text-[#CCFF00] truncate">
                               {item.products?.name || "Unknown_Protocol"} x{item.quantity}
                            </span>
                          )) || <span className="text-[9px] italic text-white/20">Direct_Inject</span>}
                       </div>
                    </td>
                    <td className="py-6 pr-6 text-right">
                       <span className="text-lg font-black italic text-white flex items-center justify-end gap-1">
                          <CreditCard className="w-4 h-4 text-primary" /> ₹{order.total}
                       </span>
                    </td>
                    <td className="py-6 pl-6 text-right">
                       <span className={`px-4 py-1 text-[9px] font-black uppercase italic tracking-widest ${
                         order.status === 'paid' ? 'bg-[#CCFF00] text-black shadow-[4px_4px_0_#000]' : 'bg-red-500/20 text-red-500 border border-red-500/40'
                       }`}>
                          {order.status}
                       </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
