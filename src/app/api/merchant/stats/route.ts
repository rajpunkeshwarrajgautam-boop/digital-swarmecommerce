import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    // ── AGGREGATE_TELEMETRY ─────────────────────────────────────────────
    
    // 1. Fetch merchant's products
    const { data: products, error: prodError } = await supabaseAdmin
      .from("products")
      .select("id, is_verified")
      .eq("merchant_id", user.id);

    if (prodError) throw prodError;

    const productIds = products.map(p => p.id);
    const verifiedCount = products.filter(p => p.is_verified).length;
    const trustScore = products.length > 0 ? (verifiedCount / products.length) * 100 : 0;

    // 2. Fetch sales from order_items
    let totalRevenue = 0;
    let salesCount = 0;
    let syncVelocity = 0;

    if (productIds.length > 0) {
      const { data: orderItems, error: salesError } = await supabaseAdmin
        .from("order_items")
        .select("price, quantity, created_at")
        .in("product_id", productIds);

      if (salesError) throw salesError;

      if (orderItems) {
        totalRevenue = orderItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
        salesCount = orderItems.length;

        // Calculate Velocity (Sales in last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentSales = orderItems.filter(item => new Date(item.created_at) >= sevenDaysAgo);
        syncVelocity = (recentSales.length / (salesCount || 1)) * 100;
      }
    }

    return NextResponse.json({
      revenue: totalRevenue,
      salesCount: salesCount,
      syncVelocity: Math.round(syncVelocity),
      trustScore: Math.round(trustScore),
      activeProtocols: products.length,
    });

  } catch (error) {
    console.error("[MERCHANT_STATS_ERROR]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
