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
 */
export function calculateSplits(data: CommissionSplit, platformFeePercent: number = 20): SplitResult {
  const { totalAmount, affiliateId } = data;
  
  const platformFee = totalAmount * (platformFeePercent / 100);
  
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
  };
}

import { getDynamicPlatformFee } from "./reputation";

/**
 * PERSISTENCE_PROTOCOL: Commission Record Ingestion
 * Records the financial split in the Supabase commissions table.
 */
export async function recordCommission(orderId: string, splitData: CommissionSplit) {
  if (!supabaseAdmin) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  // 1. [REPUTATION_PROTOCOL] Fetch dynamic fee
  const feePercent = await getDynamicPlatformFee(splitData.merchantId);
  const splits = calculateSplits(splitData, feePercent);

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
      status: "pending",
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error("[COMMISSION_RECORD_ERROR]:", error);
    throw new Error("FINANCIAL_INGESTION_FAILED");
  }

  return { success: true, splits };
}
