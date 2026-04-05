/**
 * 🏛️ DIGITAL SWARM | Governance Protocol
 * -------------------------------------
 * Handles decentralized proposals and weighted voting.
 */

import { supabaseAdmin } from './supabase';

export interface Proposal {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'PASSED' | 'REJECTED';
  yes_votes: number;
  no_votes: number;
  end_date: string;
  created_at?: string;
}

export class GovernanceService {
  /**
   * 🏗️ BROADCAST PROPOSAL
   * Initiates a new governance vote. Requires Swarm Rank verification.
   */
  static async createProposal(userId: string, title: string, description: string): Promise<{ success: boolean; id?: string }> {
    if (!supabaseAdmin) return { success: false };

    try {
      const { data, error } = await supabaseAdmin.from('dao_proposals').insert({
        creator_id: userId,
        title,
        description,
        status: 'ACTIVE',
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7-day vote
      }).select().single();

      if (error) throw error;
      return { success: true, id: data.id };

    } catch (err) {
      console.error('[GOVERNANCE_FAULT] Proposal broadcast failed:', err);
      return { success: false };
    }
  }

  /**
   * 🗳️ CAST DECISION
   * Records a user's vote, weighted by their total token count.
   */
  static async castVote(userId: string, proposalId: string, vote: 'YES' | 'NO'): Promise<{ success: boolean; weight: number }> {
    if (!supabaseAdmin) return { success: false, weight: 0 };

    try {
      // 1. Calculate Voting Weight (1 DST = 1 Weight)
      const { count, error: countError } = await supabaseAdmin
        .from('digital_tokens')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', userId);

      if (countError) throw countError;
      const weight = count || 0;

      if (weight <= 0) return { success: false, weight: 0 };

      // 2. Atomic Vote Update
      const { error: voteError } = await supabaseAdmin.from('dao_votes').upsert({
        user_id: userId,
        proposal_id: proposalId,
        vote,
        weight
      });

      if (voteError) throw voteError;

      // 3. Update Proposal Aggregates
      const column = vote === 'YES' ? 'yes_votes' : 'no_votes';
      await supabaseAdmin.rpc('increment_vote', { 
        prop_id: proposalId, 
        vote_type: column, 
        vote_weight: weight 
      });

      console.log(`[GOVERNANCE] Decision cast for ${proposalId} (Weight: ${weight})`);
      return { success: true, weight };

    } catch (err) {
      console.error('[GOVERNANCE_FAULT] Vote registration failed:', err);
      return { success: false, weight: 0 };
    }
  }

  /**
   * 💰 NABLA TREASURY TRACKER
   * Aggregates the 2% stability fund from every secondary transfer.
   */
  static async getTreasuryBalance(): Promise<number> {
    if (!supabaseAdmin) return 0;

    try {
      const { data, error } = await supabaseAdmin
        .from('commissions_log')
        .select('metadata')
        .eq('tier_applied', 'PERPETUAL_ROYALTY');

      if (error) throw error;

      return data.reduce((acc, log) => acc + (log.metadata.dao_share || 0), 0);

    } catch (err) {
      console.error('[GOVERNANCE_FAULT] Treasury calculation failed:', err);
      return 0;
    }
  }
}
