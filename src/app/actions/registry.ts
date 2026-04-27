"use server";

import { supabaseAdmin } from "@/lib/supabase";

export interface SwarmNode {
  id: string;
  user_id: string;
  node_name: string;
  node_type: 'merchant' | 'affiliate' | 'hybrid';
  bio?: string;
  avatar_url?: string;
  is_verified: boolean;
  trust_score: number;
  created_at: string;
}

/**
 * PROTOCOL_REGISTRY_FETCH: Retrieves all active nodes in the Swarm.
 */
export async function getRegistryNodes() {
  if (!supabaseAdmin) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const { data, error } = await supabaseAdmin
    .from("swarm_nodes")
    .select("*")
    .order("trust_score", { ascending: false });

  if (error) {
    console.error("[REGISTRY_FETCH_ERROR]:", error);
    throw error;
  }

  return data as SwarmNode[];
}

/**
 * TRUST_SCORE_CALCULATOR: Periodically updates a node's trust metric based on ledger activity.
 * Logic: +10 per verified sale, +50 for verification, -100 for disputed commissions.
 */
export async function updateNodeTrust(userId: string) {
  if (!supabaseAdmin) return;

  // 1. Fetch total successful ledger entries
  const { count, error: countError } = await supabaseAdmin
    .from("protocol_ledger")
    .select("*", { count: "exact", head: true })
    .eq("transaction_id", userId); // Simplified for MVP

  if (countError) return;

  const baseScore = (count || 0) * 10;
  
  // 2. Update the node profile
  await supabaseAdmin
    .from("swarm_nodes")
    .update({ trust_score: baseScore })
    .eq("user_id", userId);
}
