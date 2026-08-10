import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database unavailable" }, { status: 503 });

    const [{ data: products, error: productError }, { data: commissions, error: commissionError }] = await Promise.all([
      supabaseAdmin
        .from("products")
        .select("id,is_verified,is_visible,in_stock")
        .eq("merchant_id", user.id),
      supabaseAdmin
        .from("commissions")
        .select("id,merchant_share,status,created_at")
        .eq("merchant_id", user.id),
    ]);

    if (productError) throw productError;
    if (commissionError) throw commissionError;

    const productRows = products || [];
    const commissionRows = commissions || [];
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const recordedCommission = commissionRows.reduce((sum, row) => sum + Number(row.merchant_share || 0), 0);
    const pendingCommission = commissionRows
      .filter((row) => row.status === "pending")
      .reduce((sum, row) => sum + Number(row.merchant_share || 0), 0);
    const settledCommission = commissionRows
      .filter((row) => row.status === "settled")
      .reduce((sum, row) => sum + Number(row.merchant_share || 0), 0);
    const paidConversions7d = commissionRows.filter((row) => new Date(row.created_at).getTime() >= sevenDaysAgo).length;

    return NextResponse.json({
      listings: productRows.length,
      verifiedListings: productRows.filter((row) => row.is_verified).length,
      publishedListings: productRows.filter((row) => row.is_verified && row.is_visible && row.in_stock).length,
      recordedCommission,
      pendingCommission,
      settledCommission,
      paidConversions: commissionRows.length,
      paidConversions7d,
    });
  } catch (error) {
    console.error("[merchant stats] unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
