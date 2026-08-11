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

export async function getMerchantPayouts() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  const { data, error } = await supabaseAdmin
    .from("commissions")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as CommissionRecord[];
}

/** Records a real manual settlement request in the support queue. It does not
 * pretend that a bank transfer was initiated. */
export async function requestSettlement() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  const { data: pending, error: pendingError } = await supabaseAdmin
    .from("commissions")
    .select("merchant_share")
    .eq("merchant_id", user.id)
    .eq("status", "pending");

  if (pendingError) throw pendingError;
  const rows = pending || [];
  const amount = rows.reduce((sum, row) => sum + Number(row.merchant_share || 0), 0);
  if (amount <= 0) return { success: false, message: "No pending merchant commission is available for review." };

  const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;
  if (!email) return { success: false, message: "Your account needs an email address before requesting settlement." };

  const { error: insertError } = await supabaseAdmin.from("contact_messages").insert({
    first_name: user.firstName || "Merchant",
    last_name: user.lastName || "",
    email: email.toLowerCase(),
    message: `Merchant settlement review request\nMerchant user ID: ${user.id}\nPending records: ${rows.length}\nRecorded pending merchant share: INR ${amount.toFixed(2)}`,
  });

  if (insertError) throw insertError;
  return { success: true, message: "Settlement review request recorded. Support will follow up by email." };
}

export async function getAffiliatePayouts() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHORIZED_ACCESS_DENIED");
  if (!supabaseAdmin) throw new Error("DATABASE_UNAVAILABLE");

  const { data: affiliate, error: affiliateError } = await supabaseAdmin
    .from("affiliates")
    .select("referral_code")
    .eq("user_id", user.id)
    .maybeSingle();

  if (affiliateError) throw affiliateError;
  if (!affiliate?.referral_code) return [] as CommissionRecord[];

  const { data, error } = await supabaseAdmin
    .from("commissions")
    .select("*")
    .eq("affiliate_id", affiliate.referral_code)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as CommissionRecord[];
}
