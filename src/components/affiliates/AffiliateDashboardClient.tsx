"use client";

import { useState } from "react";
import { Copy, PlusCircle, TrendingUp, Users, IndianRupee, Check, ExternalLink, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface AffiliateData {
  id: string;
  user_id: string;
  ref_code?: string;
  referral_code?: string;
  clicks?: number;
  total_clicks?: number;
  conversions?: number;
  earnings?: number;
  total_earnings?: number | string;
  status?: string;
  created_at?: string;
}

interface AffiliateDashboardProps {
  initialData: AffiliateData | null;
  userId: string;
  userEmail: string;
}

export default function AffiliateDashboardClient({
  initialData,
  userId,
  userEmail,
}: AffiliateDashboardProps) {
  const [data, setData] = useState<AffiliateData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const refCode = data?.ref_code || data?.referral_code;
  const referralUrl = refCode
    ? `https://digitalswarm.in?ref=${refCode}`
    : null;

  const clicks = data?.clicks ?? data?.total_clicks ?? 0;
  const conversions = data?.conversions ?? 0;
  const earnings = Number(data?.earnings ?? data?.total_earnings ?? 0);
  const conversionRate = clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : "0.0";

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/affiliate/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userEmail }),
      });
      const result = await res.json();
      if (result.refCode) {
        setData(result.affiliate);
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!referralUrl) return;
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── ONBOARDING STATE ───────────────────────────────────────────────────────
  if (!data || !refCode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 via-zinc-900 to-black border-2 border-primary/30 rounded-3xl p-10 md:p-16 text-center"
      >
        <div className="w-20 h-20 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <Zap className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
          Join the Swarm Partner Network
        </h2>
        <p className="text-zinc-400 text-lg mb-4 max-w-xl mx-auto">
          Earn <span className="text-primary font-bold">10% commission</span> on every sale you refer.
          Generate your unique link below and start earning instantly.
        </p>
        <div className="flex flex-wrap gap-6 justify-center mb-10 text-sm">
          {[
            "10% per sale",
            "30-day cookie window",
            "Real-time tracking",
            "Direct bank payout",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-2 text-zinc-400">
              <Check className="w-4 h-4 text-primary" />
              {feat}
            </div>
          ))}
        </div>
        <button
          id="affiliate-generate-btn"
          onClick={handleGenerateCode}
          disabled={loading}
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black font-black uppercase italic tracking-widest text-sm rounded-2xl shadow-[0_20px_50px_rgba(255,107,53,0.3)] hover:scale-105 transition-all disabled:opacity-60"
        >
          <PlusCircle className="w-5 h-5" />
          {loading ? "Generating..." : "Generate My Affiliate Link"}
        </button>
      </motion.div>
    );
  }

  // ─── DASHBOARD STATE ────────────────────────────────────────────────────────
  return (
    <div className="space-y-8">
      {/* Referral Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <ExternalLink className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-black uppercase italic tracking-tight">Your Referral Link</h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 bg-black border border-zinc-800 rounded-2xl px-5 py-4 font-mono text-sm text-primary overflow-hidden">
            <p className="truncate">{referralUrl}</p>
          </div>
          <button
            id="affiliate-copy-link-btn"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-black font-black uppercase italic tracking-widest text-xs rounded-2xl hover:scale-105 transition-all whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "COPIED!" : "COPY LINK"}
          </button>
        </div>
        <p className="mt-4 text-xs font-mono text-zinc-600 uppercase tracking-widest">
          Ref Code: <span className="text-zinc-400">{refCode}</span>
          {" · "}Status:{" "}
          <span className={data.status === "active" ? "text-green-400" : "text-zinc-400"}>
            {data.status?.toUpperCase() || "ACTIVE"}
          </span>
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Clicks",
            value: clicks.toLocaleString(),
            icon: Users,
            color: "text-emerald-400",
            sub: "Link visits tracked",
          },
          {
            label: "Conversions",
            value: conversions.toLocaleString(),
            icon: TrendingUp,
            color: "text-blue-400",
            sub: `${conversionRate}% conversion rate`,
          },
          {
            label: "Total Earnings",
            value: `₹${earnings.toFixed(0)}`,
            icon: IndianRupee,
            color: "text-primary",
            sub: "Ready for payout",
          },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className={`text-4xl font-black italic tracking-tighter ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <p className="text-xs text-zinc-600 font-mono uppercase tracking-wider">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <h3 className="font-black uppercase italic tracking-tight text-lg mb-6 text-zinc-300">
          How Your Commission Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {[
            { step: "01", title: "Share Your Link", desc: "Send your referral URL to friends, followers, or on social media." },
            { step: "02", title: "They Purchase", desc: "When they buy any Digital Swarm product within 30 days of clicking." },
            { step: "03", title: "You Earn 10%", desc: "10% of their order total is automatically credited to your balance." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <span className="text-3xl font-black italic text-primary/30 shrink-0">{item.step}</span>
              <div>
                <p className="font-black uppercase tracking-tight text-white mb-1">{item.title}</p>
                <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
