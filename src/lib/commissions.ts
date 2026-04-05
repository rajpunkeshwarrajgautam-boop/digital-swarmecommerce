/**
 * 💰 DIGITAL SWARM | Commission Engine
 * -----------------------------------
 * Manages the financial split between the Platform and Merchants.
 */

import { supabaseAdmin } from './supabase';

export interface CommissionEntry {
  order_id: string;
  merchant_id: string;
  total_amount: number;
  platform_fee: number;
  merchant_share: number;
  status: 'pending' | 'paid';
  tier_applied: string;
}

export type CommissionTier = 'INITIATE' | 'CORE' | 'PRIME';

export class CommissionService {
  /**
   * 🏗️ REPUTATION PROTOCOL
   * -----------------------
   * Retrieves the current commission rate for a merchant.
   */
  static async getCommissionRate(merchantId: string): Promise<{ rate: number; tier: CommissionTier }> {
    // SYSTEM merchants always use CORE (30%)
    if (merchantId === 'SYSTEM' || merchantId === 'PLATFORM_DIRECT') {
      return { rate: 0.30, tier: 'CORE' };
    }

    try {
      // In a full implementation, we'd fetch the merchant's reputation from Supabase.
      // Mocking high-performance for elite merchants for now.
      const isPrime = ['ZERO_PRIME_NODE', 'ALGO_MASTER'].includes(merchantId);
      
      if (isPrime) return { rate: 0.20, tier: 'PRIME' };
      return { rate: 0.40, tier: 'INITIATE' }; // New/Unverified

    } catch (err) {
      console.error('[REPUTATION_FAULT] Falling back to standard tier:', err);
      return { rate: 0.30, tier: 'CORE' };
    }
  }

  /**
   * Calculates and records the dynamic revenue split for an order.
   * Identifies the merchant for each item and logs the delta based on their tier.
   */
  static async calculateSplit(orderId: string): Promise<{ success: boolean; message: string }> {
    if (!supabaseAdmin) return { success: false, message: "Database unavailable" };

    try {
      // 1. Check if commission is already processed (Idempotency)
      const { data: existing } = await supabaseAdmin
        .from('commissions_log')
        .select('id')
        .eq('order_id', orderId)
        .single();

      if (existing) return { success: true, message: "Commission already processed" };

      // 2. Fetch order items with their merchant details
      const { data: items, error: itemsError } = await supabaseAdmin
        .from('order_items')
        .select(`
          price,
          quantity,
          product_id,
          products (
            merchant_id
          )
        `)
        .eq('order_id', orderId);

      if (itemsError || !items) throw new Error("Failed to fetch order items");

      // 3. Process splits per merchant
      const entries: CommissionEntry[] = [];
      const merchantGroups: Record<string, number> = {};

      // Group totals by merchant
      for (const item of items) {
        const merchantId = (item.products as any)?.merchant_id || "SYSTEM";
        const lineTotal = item.price * item.quantity;
        merchantGroups[merchantId] = (merchantGroups[merchantId] || 0) + lineTotal;
      }

      // 4. Calculate tiered splits
      for (const [merchantId, total] of Object.entries(merchantGroups)) {
        const { rate, tier } = await this.getCommissionRate(merchantId);
        const platformFee = total * rate;
        const merchantShare = total - platformFee;

        entries.push({
          order_id: orderId,
          merchant_id: merchantId,
          total_amount: total,
          platform_fee: platformFee,
          merchant_share: merchantShare,
          status: 'pending',
          tier_applied: tier
        });
      }

      const { error: insertError } = await supabaseAdmin
        .from('commissions_log')
        .insert(entries);

      if (insertError) throw insertError;

      console.log(`[FINANCE] Tiered split completed for Order: ${orderId}`);
      return { success: true, message: "Commission split recorded" };

    } catch (err) {
      console.error('[FINANCE_ERROR] Commission calculation failed:', err);
      return { success: false, message: "Calculation fault" };
    }
  }
}
