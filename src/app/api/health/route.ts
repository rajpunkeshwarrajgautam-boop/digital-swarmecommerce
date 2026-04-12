import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type TableCheck = { ok: boolean; detail?: string };

/**
 * GET /api/health
 * Ops / uptime: products DB + optional admin table probes when service role is set.
 */
export async function GET() {
  const checks: Record<string, TableCheck | { ok: boolean; count?: number }> = {};

  const { count, error: productsError } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  checks.products = productsError
    ? { ok: false, detail: "unreachable_or_error" }
    : { ok: true, count: count ?? 0 };

  const productsOk = !productsError;

  if (!supabaseAdmin) {
    checks.contact_messages = { ok: false, detail: "service_role_unset" };
    checks.merchant_applications = { ok: false, detail: "service_role_unset" };
  } else {
    const admin = supabaseAdmin;
    const probe = async (table: string): Promise<TableCheck> => {
      const { error } = await admin.from(table).select("id").limit(1);
      if (error) {
        const missing = error.code === "42P01" || error.message?.includes("does not exist");
        return { ok: false, detail: missing ? "table_missing" : "query_error" };
      }
      return { ok: true };
    };

    checks.contact_messages = await probe("contact_messages");
    checks.merchant_applications = await probe("merchant_applications");
  }

  const adminTablesOk =
    !supabaseAdmin ||
    (checks.contact_messages &&
      "ok" in checks.contact_messages &&
      checks.contact_messages.ok &&
      checks.merchant_applications &&
      "ok" in checks.merchant_applications &&
      checks.merchant_applications.ok);

  const overallOk = productsOk && adminTablesOk;

  return NextResponse.json(
    {
      ok: overallOk,
      service: "digital-swarm-ecommerce",
      checks,
    },
    { status: productsOk ? 200 : 503 }
  );
}
