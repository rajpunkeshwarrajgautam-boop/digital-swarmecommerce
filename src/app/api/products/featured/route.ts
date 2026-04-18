import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  normalizeProductFromDb,
  type DbProductRow,
} from "@/lib/mergeStaticProductFromDb";

/**
 * GET /api/products/featured
 * Returns products flagged as is_featured = true in Supabase.
 * Used by the Full Swarm Stack hero bundle section.
 */
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("in_stock", true)
      .order("price", { ascending: false })
      .limit(3);

    if (error) throw error;

    const rows = (data || []) as DbProductRow[];
    return NextResponse.json(rows.map(normalizeProductFromDb), {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
