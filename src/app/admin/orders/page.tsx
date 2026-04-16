"use client";

import { motion } from "framer-motion";
import { History, Hash, Calendar, CreditCard, User, Download, Activity, AlertTriangle, ShieldCheck, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminOrders, recheckOrderPayment, retryOrderFulfillment } from "@/app/actions/admin";
import { useToastStore } from "@/components/ui/ForgeToast";

import { AdminOpsDiagnostics, AdminOrder, AdminOrderTimelineResponse } from "@/lib/types";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ops, setOps] = useState<AdminOpsDiagnostics | null>(null);
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);
  const [openTimelineOrderId, setOpenTimelineOrderId] = useState<string | null>(null);
  const [timelines, setTimelines] = useState<Record<string, AdminOrderTimelineResponse>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToastStore();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [orderData, opsRes] = await Promise.all([
        getAdminOrders(),
        fetch("/api/admin/ops", { cache: "no-store" }),
      ]);
      setOrders(orderData);
      if (opsRes.ok) {
        setOps(await opsRes.json());
      }
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

  async function handleRetryFulfillment(orderId: string) {
    try {
      setActionOrderId(orderId);
      await retryOrderFulfillment(orderId);
      addToast("SUCCESS", "FULFILLMENT_RETRY_OK", "MANUAL FULFILLMENT RETRY COMPLETED");
      await fetchData();
    } catch {
      addToast("ERROR", "FULFILLMENT_RETRY_FAILED", "UNABLE TO REPLAY PURCHASE FULFILLMENT");
    } finally {
      setActionOrderId(null);
    }
  }

  async function handleRecheckPayment(orderId: string) {
    try {
      setActionOrderId(orderId);
      await recheckOrderPayment(orderId);
      addToast("SUCCESS", "PAYMENT_RECHECK_OK", "PAYMENT STATUS RECHECK COMPLETED");
      await fetchData();
    } catch {
      addToast("ERROR", "PAYMENT_RECHECK_FAILED", "GATEWAY RECHECK DID NOT COMPLETE");
    } finally {
      setActionOrderId(null);
    }
  }

  async function toggleTimeline(orderId: string) {
    if (openTimelineOrderId === orderId) {
      setOpenTimelineOrderId(null);
      return;
    }

    setOpenTimelineOrderId(orderId);

    if (timelines[orderId]) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/timeline`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("timeline_failed");
      }
      const data = (await res.json()) as AdminOrderTimelineResponse;
      setTimelines((current) => ({ ...current, [orderId]: data }));
    } catch {
      addToast("ERROR", "TIMELINE_LOAD_FAILED", "UNABLE TO LOAD ORDER TIMELINE");
    }
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

      {ops && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          <OpsCard label="Pending > 30m" value={String(ops.counters.pendingOlderThan30m)} tone="warn" />
          <OpsCard label="Failed 24h" value={String(ops.counters.failedLast24h)} tone="danger" />
          <OpsCard label="Paid 24h" value={String(ops.counters.paidLast24h)} tone="ok" />
          <OpsCard
            label="Webhook Retry Backlog"
            value={String(ops.counters.webhookRetryBacklog ?? 0)}
            tone="warn"
          />
          <OpsCard
            label="Cron / Gateway"
            value={
              ops.diagnostics.cashfreeConfigured && ops.diagnostics.cronSecretConfigured
                ? "READY"
                : "CHECK"
            }
            tone={
              ops.diagnostics.cashfreeConfigured && ops.diagnostics.cronSecretConfigured
                ? "ok"
                : "danger"
            }
          />
        </section>
      )}

      {ops && ops.recentStuckOrders.length > 0 && (
        <section className="border border-white/5 bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#CCFF00] italic">
            <AlertTriangle className="w-3 h-3" /> Recovery Queue Snapshot
          </div>
          <div className="space-y-2">
            {ops.recentStuckOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border border-white/5 bg-black/20 px-4 py-3"
              >
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-white/50">
                    {order.cashfree_order_id || order.id}
                  </div>
                  <div className="text-xs font-black italic text-white">{order.customer_email}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                  <span className="px-3 py-1 text-[9px] font-black uppercase italic bg-red-500/20 text-red-400 border border-red-500/40">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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
                  <th className="pb-4 pl-6 text-right">Recovery</th>
                  <th className="pb-4 pl-6 text-right">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order, i) => (
                  <>
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
                      <td className="py-6 pl-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {(order.status === "pending" || order.status === "failed") && (
                          <button
                            onClick={() => handleRecheckPayment(order.id)}
                            disabled={actionOrderId === order.id}
                            className="px-3 py-2 text-[9px] font-black uppercase tracking-widest border border-white/10 text-white/70 hover:text-black hover:bg-[#CCFF00] transition-all disabled:opacity-50"
                          >
                            {actionOrderId === order.id ? "WORKING" : "RECHECK"}
                          </button>
                        )}
                        {order.status !== "paid" && (
                          <button
                            onClick={() => handleRetryFulfillment(order.id)}
                            disabled={actionOrderId === order.id}
                            className="px-3 py-2 text-[9px] font-black uppercase tracking-widest border border-primary/30 text-primary hover:bg-primary hover:text-black transition-all disabled:opacity-50 inline-flex items-center gap-2"
                          >
                            <RefreshCw className="w-3 h-3" />
                            {actionOrderId === order.id ? "WORKING" : "RETRY"}
                          </button>
                        )}
                      </div>
                      </td>
                      <td className="py-6 pl-6 text-right">
                        <button
                          onClick={() => toggleTimeline(order.id)}
                          className="px-3 py-2 text-[9px] font-black uppercase tracking-widest border border-white/10 text-white/70 hover:text-black hover:bg-white transition-all inline-flex items-center gap-2"
                        >
                          {openTimelineOrderId === order.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          Trace
                        </button>
                      </td>
                    </motion.tr>
                    {openTimelineOrderId === order.id && (
                      <tr className="bg-black/20">
                        <td colSpan={7} className="px-6 py-5">
                          <OrderTimelinePanel timeline={timelines[order.id]} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderTimelinePanel({ timeline }: { timeline?: AdminOrderTimelineResponse }) {
  if (!timeline) {
    return <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">Loading diagnostic trace...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40">
        <span>{timeline.order.cashfreeOrderId || timeline.order.id}</span>
        <span>Status: {timeline.order.status}</span>
        <span>Licenses: {timeline.diagnostics.licensesFound}</span>
      </div>
      <div className="space-y-3">
        {timeline.timeline.map((entry, index) => (
          <div key={`${entry.timestamp}-${index}`} className="border border-white/5 bg-white/[0.02] px-4 py-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="space-y-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00] italic">
                  {entry.title}
                </div>
                <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                  {entry.detail}
                </div>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-white/30">
                {new Date(entry.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpsCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "danger";
}) {
  const toneClass =
    tone === "ok"
      ? "text-[#CCFF00]"
      : tone === "warn"
        ? "text-yellow-300"
        : "text-red-400";
  const Icon = tone === "ok" ? ShieldCheck : tone === "warn" ? Activity : AlertTriangle;

  return (
    <div className="border border-white/5 bg-white/[0.02] p-5 space-y-3">
      <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic ${toneClass}`}>
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className={`text-3xl font-black italic tracking-tighter ${toneClass}`}>{value}</div>
    </div>
  );
}
