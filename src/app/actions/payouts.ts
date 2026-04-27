"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export interface CommissionRecord {
  id: string;
  order_id: string;
  total_amount: number;
  merchant_share: number;
  affiliate_share: number;
  platform_fee: number;
  status: 'pending' | 'settled' | 'disputed';
  created_at: string;
}

/**
 * PROTOCOL_LEDGER_FETCH: Retrieves all financial records for the current merchant.
 */
export async function getMerchantPayouts() {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  }

  if (!supabaseAdmin) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const { data, error } = await supabaseAdmin
    .from("commissions")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[PAYOUT_FETCH_ERROR]:", error);
    throw error;
  }

  return data as CommissionRecord[];
}

/**
 * PROTOCOL_SETTLEMENT_REQUEST: Triggers a manual settlement audit.
 * MVP: Injected as a logic hook for future automated payouts.
 */
export async function requestSettlement() {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  }

  // LOGIC: For MVP, we just flag the merchant's pending commissions.
  // Future: Trigger Stripe Connect / Razorpay Payouts.
  
/**
 * PROTOCOL_AFFILIATE_FETCH: Retrieves all referral commissions for the current node.
 */
export async function getAffiliatePayouts() {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  }

  if (!supabaseAdmin) {
    throw new Error("DATABASE_UNAVAILABLE");
  }

  const { data, error } = await supabaseAdmin
    .from("commissions")
    .select("*")
    .eq("affiliate_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[AFFILIATE_FETCH_ERROR]:", error);
    throw error;
  }

  return data as CommissionRecord[];
}

