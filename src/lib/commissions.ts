import { supabaseAdmin } from "./supabase";

export interface CommissionSplit {
  totalAmount: number;
  merchantId: string;
  affiliateId?: string | null;
}

export interface SplitResult {
  merchantShare: number;
  affiliateShare: number;
  platformFee: number;
}

/**
 * ARCHITECTURAL_PROTOCOL: Financial Distribution Logic
 * Calculates the split between the Merchant, the Affiliate (if applicable), and the Digital Swarm Platform.
 * Default Logic: 70/10/20 (Adjustable)
 * Royalty Logic: Optional creator royalty for secondary/recurring transactions.
 */
export function calculateSplits(
  data: CommissionSplit, 
  platformFeePercent: number = 20,
  creatorRoyaltyPercent: number = 0
): SplitResult & { creatorRoyalty: number } {
  const { totalAmount, affiliateId } = data;
  
  // 1. Calculate Base Platform Fee
  let platformFee = totalAmount * (platformFeePercent / 100);
  
  // 2. Extract Creator Royalty (Carved out of platform's share)
  const creatorRoyalty = totalAmount * (creatorRoyaltyPercent / 100);
  platformFee = Math.max(0, platformFee - creatorRoyalty);
  
  let merchantShare: number;
  let affiliateShare: number;

  if (affiliateId) {
    // 3-Way Split: 70/10/X
    merchantShare = totalAmount * 0.7;
    affiliateShare = totalAmount * 0.1;
  } else {
    // 2-Way Split: 80/X (Merchant gets the affiliate's share if no referral)
    merchantShare = totalAmount * 0.8;
    affiliateShare = 0;
  }

  return {
    merchantShare: parseFloat(merchantShare.toFixed(2)),
    affiliateShare: parseFloat(affiliateShare.toFixed(2)),
    platformFee: parseFloat(platformFee.toFixed(2)),
    creatorRoyalty: parseFloat(creatorRoyalty.toFixed(2))
  };
}

import { getDynamicPlatformFee } from "./reputation";

/**
 * PERSISTENCE_PROTOCOL: Commission Record Ingestion
 * Records the financial split in the Supabase commissions table.
 */
export async function recordCommission(
  orderId: string, 
  splitData: CommissionSplit, 
  isSecondary: boolean = false
) {
  if (!supabaseAdmin) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  // 1. [REPUTATION_PROTOCOL] Fetch dynamic fee
  const feePercent = await getDynamicPlatformFee(splitData.merchantId);
  
  // 2. [ROYALTY_PROTOCOL] Check for secondary transaction
  const royaltyPercent = isSecondary ? 5 : 0;
  
  const splits = calculateSplits(splitData, feePercent, royaltyPercent);

  const { error } = await supabaseAdmin
    .from("commissions")
    .insert({
      order_id: orderId,
      merchant_id: splitData.merchantId,
      affiliate_id: splitData.affiliateId || null,
      total_amount: splitData.totalAmount,
      merchant_share: splits.merchantShare,
      affiliate_share: splits.affiliateShare,
      platform_fee: splits.platformFee,
      creator_royalty: splits.creatorRoyalty,
      status: "pending",
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error("[COMMISSION_RECORD_ERROR]:", error);
    throw new Error("FINANCIAL_INGESTION_FAILED");
  }

  return { success: true, splits };
}

/**
 * ARCHITECTURAL_PROTOCOL: High-level financial services.
 */
export class CommissionService {
  /**
   * CALCULATE_SPLIT: Fetches order details and triggers commission recording.
   */
  static async calculateSplit(internalOrderId: string) {
    if (!supabaseAdmin) return;

    // 1. Fetch order details
    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*, merchant_id, affiliate_ref, total_amount')
      .eq('id', internalOrderId)
      .single();

    if (!order) return;

    // 2. Record commission
    return await recordCommission(order.id, {
      totalAmount: order.total_amount,
      merchantId: order.merchant_id || "DIGITAL_SWARM_GENESIS",
      affiliateId: order.affiliate_ref
    });
  }
}

