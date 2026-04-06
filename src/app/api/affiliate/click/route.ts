import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/affiliate/click
 * Increments the click counter for a given ref code.
 * Called whenever someone visits the site via a referral link.
 *
 * Body: { refCode: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { refCode } = (await req.json()) as { refCode: string };

    if (!refCode || typeof refCode !== "string") {
      return NextResponse.json({ error: "refCode required" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    // Increment click count atomically via Supabase RPC
    const { error } = await supabaseAdmin.rpc("increment_affiliate_clicks", {
      p_ref_code: refCode,
    });

    if (error) {
      // Fallback: direct increment if RPC doesn't exist
      const { data: affiliate } = await supabaseAdmin
        .from("affiliates")
        .select("clicks")
        .eq("ref_code", refCode)
        .single();

      if (affiliate) {
        await supabaseAdmin
          .from("affiliates")
          .update({ clicks: (affiliate.clicks || 0) + 1 })
          .eq("ref_code", refCode);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
