"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

type HealthPayload = {
  ok?: boolean;
  checks?: Record<string, { ok?: boolean; detail?: string; count?: number }>;
  catalog?: { score?: number; productsEvaluated?: number };
};

export default function HealthPage() {
  const [health, setHealth] = useState<HealthPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/health", { cache: "no-store" });
      const data = (await response.json()) as HealthPayload;
      setHealth(data);
      if (!response.ok && !data.checks) setError("Health service is unavailable.");
    } catch {
      setError("Health service is unavailable.");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const checks = health?.checks ? Object.entries(health.checks) : [];

  return (
    <main className="min-h-screen bg-[#07070b] px-6 pb-24 pt-36 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-black uppercase tracking-[.25em] text-primary">Live readiness</p>
            <h1 className="mt-3 text-5xl font-black uppercase italic tracking-tighter">System Health</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
              This page reflects the current application readiness endpoint. It does not substitute a synthetic “100% operational” value when a dependency is unavailable.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs font-black uppercase tracking-wider text-white/60 hover:border-primary/30 hover:text-white disabled:opacity-40"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <section className={`mb-6 rounded-2xl border p-6 ${health?.ok ? "border-green-500/25 bg-green-500/[0.06]" : "border-amber-500/25 bg-amber-500/[0.06]"}`}>
          <div className="flex items-start gap-4">
            {health?.ok ? <CheckCircle2 className="mt-0.5 h-6 w-6 text-green-300" /> : <AlertTriangle className="mt-0.5 h-6 w-6 text-amber-300" />}
            <div>
              <h2 className="text-xl font-black uppercase">{loading ? "Checking…" : health?.ok ? "Ready" : "Attention required"}</h2>
              <p className="mt-2 text-sm leading-6 text-white/45">
                {error || (health?.ok
                  ? "The readiness checks currently reported by the application are passing."
                  : "One or more application dependencies or required configuration checks are not currently ready.")}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-3 md:grid-cols-2">
          {checks.map(([name, check]) => (
            <div key={name} className="rounded-xl border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] font-black uppercase tracking-[.16em] text-white/45">{name.replace(/_/g, " ")}</span>
                <span className={`text-[10px] font-black uppercase ${check.ok ? "text-green-300" : "text-amber-300"}`}>
                  {check.ok ? "pass" : "not ready"}
                </span>
              </div>
              {check.detail ? <p className="mt-3 text-xs text-white/30">{check.detail.replace(/_/g, " ")}</p> : null}
              {typeof check.count === "number" ? <p className="mt-2 text-xs text-white/30">Recorded rows: {check.count}</p> : null}
            </div>
          ))}
        </div>

        {health?.catalog ? (
          <p className="mt-8 text-xs leading-5 text-white/30">
            Catalog integrity score: {health.catalog.score ?? "—"}/10 across {health.catalog.productsEvaluated ?? 0} currently sellable products. This is a mechanical configuration check, not a product quality or popularity rating.
          </p>
        ) : null}
      </div>
    </main>
  );
}
