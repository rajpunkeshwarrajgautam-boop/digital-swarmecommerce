import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * POST /api/affiliate/generate
 * Generates or retrieves an affiliate ref code for a given userId.
 * Creates a record in the `affiliates` Supabase table if one doesn't exist.
 *
 * Body: { userId: string, userEmail: string }
 * Returns: { refCode: string, referralUrl: string, affiliate: object }
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail } = (await req.json()) as {
      userId: string;
      userEmail: string;
    };

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    // Check if affiliate record already exists for this user
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("affiliates")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows found, which is fine
      throw fetchError;
    }

    if (existing?.ref_code) {
      // Return existing affiliate data
      const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in"}?ref=${existing.ref_code}`;
      return NextResponse.json({
        refCode: existing.ref_code,
        referralUrl,
        affiliate: existing,
      });
    }

    // Generate a new unique ref code: swarm_ + 8 random alphanumeric chars
    const refCode = `swarm_${Math.random().toString(36).substring(2, 10)}`;
    const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in"}?ref=${refCode}`;

    const { data: newAffiliate, error: insertError } = await supabaseAdmin
      .from("affiliates")
      .insert({
        user_id: userId,
        user_email: userEmail || null,
        ref_code: refCode,
        clicks: 0,
        conversions: 0,
        earnings: 0,
        status: "active",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({
      refCode,
      referralUrl,
      affiliate: newAffiliate,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
