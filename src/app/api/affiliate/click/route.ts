import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({ interval: 60 * 60 * 1000, uniqueTokenPerInterval: 1000 });
const REF_CODE = /^[a-z0-9_-]{3,64}$/i;

/** Record one referral visit. The browser deduplicates per session and this
 * endpoint validates/rate-limits the code before incrementing the DB counter. */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    try {
      await limiter.check(30, ip);
    } catch {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { refCode } = (await req.json()) as { refCode?: string };
    const normalized = typeof refCode === "string" ? refCode.trim() : "";
    if (!REF_CODE.test(normalized)) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const { data: affiliate, error: lookupError } = await supabaseAdmin
      .from("affiliates")
      .select("id")
      .eq("referral_code", normalized)
      .eq("status", "active")
      .maybeSingle();

    if (lookupError) {
      console.error("[affiliate click] lookup failed", lookupError.message);
      return NextResponse.json({ error: "Tracking unavailable" }, { status: 503 });
    }
    if (!affiliate) {
      return NextResponse.json({ error: "Unknown referral code" }, { status: 404 });
    }

    const { error } = await supabaseAdmin.rpc("increment_affiliate_clicks", {
      p_ref_code: normalized,
    });

    if (error) {
      console.error("[affiliate click] increment failed", error.message);
      return NextResponse.json({ error: "Tracking unavailable" }, { status: 503 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[affiliate click] unexpected error", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
