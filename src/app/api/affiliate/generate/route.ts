import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("affiliates")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingError) {
      console.error("[affiliate generate] lookup failed", existingError.message);
      return NextResponse.json({ error: "Affiliate service unavailable" }, { status: 503 });
    }

    if (existing?.referral_code) {
      const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in"}?ref=${existing.referral_code}`;
      return NextResponse.json({ refCode: existing.referral_code, referralUrl, affiliate: existing });
    }

    const base = (user.firstName || "partner").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20) || "partner";
    const referralCode = `${base}_${randomBytes(4).toString("hex")}`;
    const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || null;

    const { data: affiliate, error: insertError } = await supabaseAdmin
      .from("affiliates")
      .insert({
        user_id: user.id,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
        email,
        status: "active",
        referral_code: referralCode,
        total_clicks: 0,
        total_earnings: 0,
      })
      .select("*")
      .single();

    if (insertError || !affiliate) {
      console.error("[affiliate generate] insert failed", insertError?.message);
      return NextResponse.json({ error: "Could not create affiliate profile" }, { status: 503 });
    }

    const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://digitalswarm.in"}?ref=${referralCode}`;
    return NextResponse.json({ refCode: referralCode, referralUrl, affiliate });
  } catch (error) {
    console.error("[affiliate generate] unexpected error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
