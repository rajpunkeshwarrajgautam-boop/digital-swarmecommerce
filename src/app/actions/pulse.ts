"use server";

import { supabaseAdmin } from "@/lib/supabase";

export interface SwarmPulse {
  globalVelocity: number; // Transactions in last 24h
  networkTrust: number; // Avg trust score
  taskThroughput: number; // Total tasks processed
  ledgerVolume: number; // Total volume in INR
  activeNodes: number;
  healthIndex: number; // 0-100 score
}

/**
 * PROTOCOL_TELEMETRY: Aggregates real-time network metrics for the Swarm Pulse.
 */
export async function getGlobalPulse(): Promise<SwarmPulse> {
  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  // 1. Fetch Transaction Velocity (24h)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: txCount } = await supabaseAdmin
    .from("commissions")
    .select("*", { count: "exact", head: true })
    .gte("created_at", oneDayAgo);

  // 2. Fetch Average Trust Score
  const { data: nodes } = await supabaseAdmin
    .from("swarm_nodes")
    .select("trust_score");
  
  const avgTrust = nodes && nodes.length > 0 
    ? nodes.reduce((acc, curr) => acc + (curr.trust_score || 0), 0) / nodes.length 
    : 0;

  // 3. Fetch Task Throughput
  const { count: taskCount } = await supabaseAdmin
    .from("agent_tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "completed");

  // 4. Fetch Ledger Volume
  const { data: ledgerData } = await supabaseAdmin
    .from("commissions")
    .select("total_amount");
  
  const totalVolume = ledgerData?.reduce((acc, curr) => acc + (curr.total_amount || 0), 0) || 0;

  // 5. Calculate Health Index (Simulated Algorithm)
  const healthIndex = Math.min(100, Math.round(((txCount || 0) * 2) + (avgTrust / 10) + (taskCount || 0)));

  return {
    globalVelocity: txCount || 0,
    networkTrust: Math.round(avgTrust),
    taskThroughput: taskCount || 0,
    ledgerVolume: totalVolume,
    activeNodes: nodes?.length || 0,
    healthIndex: healthIndex || 95 // Fallback for low data
  };
}
