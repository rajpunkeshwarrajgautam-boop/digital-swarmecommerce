/**
 * 🛰️ DIGITAL SWARM | Analytics Engine
 * -----------------------------------
 * Power-ranking protocol for autonomous artifact optimization.
 */

import { supabaseAdmin } from './supabase';

export interface SwarmMetrics {
  total_transfers: number;
  total_votes: number;
  treasury_velocity: number; // Stability fund growth rate
  sync_level: number; // Overall community synchronization (0-100)
}

export class SwarmAnalyticsService {
  /**
   * 🏗️ CALCULATE SWARM SCORE
   * Generates a power-rank for an artifact based on multi-dimensional activity.
   */
  static calculateScore(item: { sales: number; votes: number; density?: number }): number {
    const saleWeight = 12;
    const voteWeight = 8;
    const densityWeight = 2;

    return (item.sales * saleWeight) + (item.votes * voteWeight) + ((item.density || 0) * densityWeight);
  }

  /**
   * 🌀 GET SWARM PULSE
   * Aggregates global metrics to determine the 'Aura' of the collective.
   */
  static async getSwarmPulse(): Promise<SwarmMetrics> {
    if (!supabaseAdmin) return { total_transfers: 0, total_votes: 0, treasury_velocity: 0, sync_level: 0 };

    try {
      // 1. Total Transfers (Commissions)
      const { count: transferCount } = await supabaseAdmin
        .from('commissions_log')
        .select('*', { count: 'exact', head: true });

      // 2. Total DAO Activity
      const { data: proposalData } = await supabaseAdmin
        .from('dao_proposals')
        .select('yes_votes, no_votes');

      const totalVotes = proposalData?.reduce((acc, p) => acc + p.yes_votes + p.no_votes, 0) || 0;

      // 3. Treasury Velocity (Growth in last 24h)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: recentGrowth } = await supabaseAdmin
        .from('commissions_log')
        .select('metadata')
        .gte('created_at', yesterday);

      const velocity = recentGrowth?.reduce((acc, log) => acc + (log.metadata.dao_share || 0), 0) || 0;

      // 4. Sync Level (Consensus Ratio)
      const consensusRatio = proposalData 
        ? (proposalData.filter(p => p.yes_votes > p.no_votes).length / proposalData.length) * 100 
        : 0;

      return {
        total_transfers: transferCount || 0,
        total_votes: totalVotes,
        treasury_velocity: velocity,
        sync_level: Math.round(consensusRatio) || 50
      };

    } catch (err) {
      console.error('[ANALYTICS_FAULT] Pulse aggregation failed:', err);
      return { total_transfers: 0, total_votes: 0, treasury_velocity: 0, sync_level: 0 };
    }
  }

  /**
   * 🏆 GET TOP PERFORMERS
   * Returns artifacts ranked by their Swarm Score.
   */
  static async getTopPerformers(): Promise<any[]> {
    if (!supabaseAdmin) return [];

    try {
      // Fetch all tokens and their transfer counts (simulated aggregation)
      const { data: tokens, error } = await supabaseAdmin
        .from('digital_tokens')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // In a real production app, we'd use a SQL View for this aggregation
      return tokens.map(token => ({
        ...token,
        swarmScore: this.calculateScore({
          sales: 5, // Mock data for now, would aggregate from commissions_log
          votes: 10, // Mock data for now
          density: 85
        })
      })).sort((a, b) => b.swarmScore - a.swarmScore);

    } catch (err) {
      console.error('[ANALYTICS_FAULT] Ranking failed:', err);
      return [];
    }
  }
}
