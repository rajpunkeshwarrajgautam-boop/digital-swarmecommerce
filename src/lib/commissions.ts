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
 * Default Logic: 70% Merchant | 10% Affiliate | 20% Platform
 */
export function calculateSplits(data: CommissionSplit): SplitResult {
  const { totalAmount, affiliateId } = data;
  
  let merchantShare: number;
  let affiliateShare: number;
  let platformFee: number;

  if (affiliateId) {
    // 3-Way Split: 70/10/20
    merchantShare = totalAmount * 0.7;
    affiliateShare = totalAmount * 0.1;
    platformFee = totalAmount * 0.2;
  } else {
    // 2-Way Split: 80/20 (Merchant gets the affiliate's share if no referral)
    merchantShare = totalAmount * 0.8;
    affiliateShare = 0;
    platformFee = totalAmount * 0.2;
  }

  return {
    merchantShare: parseFloat(merchantShare.toFixed(2)),
    affiliateShare: parseFloat(affiliateShare.toFixed(2)),
    platformFee: parseFloat(platformFee.toFixed(2)),
  };
}

/**
 * PERSISTENCE_PROTOCOL: Commission Record Ingestion
 * Records the financial split in the Supabase commissions table.
 */
export async function recordCommission(orderId: string, splitData: CommissionSplit) {
  if (!supabaseAdmin) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const splits = calculateSplits(splitData);

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
