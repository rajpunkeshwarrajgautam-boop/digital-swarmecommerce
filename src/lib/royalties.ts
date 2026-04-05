/**
 * 💰 DIGITAL SWARM | Royalty Engine
 * ---------------------------------
 * Handles perpetual revenue splits for secondary asset transfers.
 */

import { supabaseAdmin } from './supabase';
import { products } from './data';
import { createHash } from 'crypto';

export interface RoyaltySplit {
  creator_id: string;
  creator_amount: number;
  platform_amount: number;
  dao_amount: number;
  total_royalty: number;
}

export class RoyaltyService {
  /**
   * 🏗️ CALIBRATE SPLIT
   * Calculates the 10% standard royalty for secondary transfers.
   */
  static async calculateSplit(tokenId: string, amount: number): Promise<RoyaltySplit | null> {
    if (!supabaseAdmin || amount <= 0) return null;

    try {
      // 1. Resolve Asset Lineage (Merchant ID)
      const { data: token, error: tokenError } = await supabaseAdmin
        .from('digital_tokens')
        .select('product_id')
        .eq('id', tokenId)
        .single();

      if (tokenError || !token) throw tokenError || new Error("Asset lineage lost");

      const product = products.find(p => p.id === token.product_id);
      if (!product) throw new Error("Product metadata unrecoverable");

      const creatorId = product.merchantId || 'PLATFORM_RESERVE';

      // 2. Standard 10% Split Logic
      const totalRoyalty = amount * 0.10;
      const creator_amount = totalRoyalty * 0.50; // 5% of total
      const platform_amount = totalRoyalty * 0.30; // 3% of total
      const dao_amount = totalRoyalty * 0.20; // 2% of total

      const split: RoyaltySplit = {
        creator_id: creatorId,
        creator_amount,
        platform_amount,
        dao_amount,
        total_royalty: totalRoyalty
      };

      // 3. Log to Distributed Ledger (commissions_log)
      await this.logRoyalty(tokenId, split);

      return split;

    } catch (err) {
      console.error('[ROYALTY_FAULT] Calculation failed:', err);
      return null;
    }
  }

  /**
   * 📜 LOG ROYALTY BROADCAST
   * Records the perpetual reward in the permanent commission ledger.
   */
  private static async logRoyalty(tokenId: string, split: RoyaltySplit) {
    if (!supabaseAdmin) return;

    try {
      const signature = createHash('sha256')
        .update(`${tokenId}:${split.creator_id}:${split.total_royalty}:${Date.now()}`)
        .digest('hex');

      await supabaseAdmin.from('commissions_log').insert({
        merchant_id: split.creator_id,
        order_id: `ROYALTY-${tokenId}`,
        total_amount: split.total_royalty,
        merchant_share: split.creator_amount,
        platform_fee: split.platform_amount,
        tier_applied: 'PERPETUAL_ROYALTY',
        metadata: {
          token_id: tokenId,
          dao_share: split.dao_amount,
          signature
        }
      });

      console.log(`[LEDGER] Royalty broadcast confirmed for Token: ${tokenId}`);

    } catch (err) {
      console.error('[LEDGER_ERROR] Royalty logging failure:', err);
    }
  }
}
