"use server";

import { supabaseAdmin } from "@/lib/supabase";

export interface SwarmPulse {
  globalVelocity: number;
  networkTrust: number;
  taskThroughput: number;
  ledgerVolume: number;
  activeNodes: number;
  healthIndex: number;
}

/** Aggregates only values backed by current database records. */
export async function getGlobalPulse(): Promise<SwarmPulse> {
  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: txCount } = await supabaseAdmin
    .from("commissions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneDayAgo);

  const { data: nodes } = await supabaseAdmin
    .from("swarm_nodes")
    .select("trust_score");

  const avgTrust = nodes && nodes.length > 0
    ? nodes.reduce((acc, curr) => acc + Number(curr.trust_score || 0), 0) / nodes.length
    : 0;

  const { count: taskCount } = await supabaseAdmin
    .from("agent_tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  const { data: ledgerData } = await supabaseAdmin
    .from("commissions")
    .select("total_amount");

  const totalVolume = ledgerData?.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0) || 0;

  // A transparent activity index derived from recorded activity only. No fabricated fallback.
  const activityIndex = Math.min(100, Math.round(((txCount || 0) * 2) + (avgTrust / 10) + (taskCount || 0)));

  return {
    globalVelocity: txCount || 0,
    networkTrust: Math.round(avgTrust),
    taskThroughput: taskCount || 0,
    ledgerVolume: totalVolume,
    activeNodes: nodes?.length || 0,
    healthIndex: activityIndex,
  };
}
