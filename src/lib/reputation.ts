import { supabaseAdmin } from "./supabase";

export type SwarmRank = 'INITIATE' | 'OPERATIVE' | 'COMMANDER' | 'LEGEND';

export interface RankConfig {
  rank: SwarmRank;
  threshold: number;
  platformFee: number; // Percentage (e.g., 20 for 20%)
  color: string;
}

export const RANK_TIERS: RankConfig[] = [
  { rank: 'INITIATE', threshold: 0, platformFee: 20, color: '#666666' },
  { rank: 'OPERATIVE', threshold: 500, platformFee: 18, color: '#00D1FF' },
  { rank: 'COMMANDER', threshold: 2000, platformFee: 15, color: '#CCFF00' },
  { rank: 'LEGEND', threshold: 5000, platformFee: 12, color: '#FF0055' },
];

/**
 * PROTOCOL_REPUTATION_AUDIT: Determines the current rank of a node.
 */
export async function getNodeRank(userId: string): Promise<RankConfig> {
  if (!supabaseAdmin) return RANK_TIERS[0];

  const { data, error } = await supabaseAdmin
    .from("swarm_nodes")
    .select("trust_score")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return RANK_TIERS[0];

  const score = data.trust_score || 0;
  
  // Find the highest tier reached
  const tier = [...RANK_TIERS].reverse().find(t => score >= t.threshold);
  return tier || RANK_TIERS[0];
}

/**
 * FINANCIAL_FEE_PROTOCOL: Calculates the dynamic platform cut based on reputation.
 */
export async function getDynamicPlatformFee(userId: string): Promise<number> {
  const tier = await getNodeRank(userId);
  return tier.platformFee;
}
