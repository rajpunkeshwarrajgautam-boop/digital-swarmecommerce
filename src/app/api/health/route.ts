import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { evaluateCatalogReadiness } from "@/lib/catalog-readiness";

export const dynamic = "force-dynamic";

type TableCheck = { ok: boolean; detail?: string };

/**
 * GET /api/health
 * Ops / uptime: products DB + optional admin table probes when service role is set.
 */
export async function GET() {
  const checks: Record<string, TableCheck | { ok: boolean; count?: number }> = {};
  const catalog = evaluateCatalogReadiness();
  const paymentConfigOk = Boolean(
    process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY
  );
  const cronSecretOk = Boolean(process.env.CRON_SECRET);

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
    checks.webhook_logs = { ok: false, detail: "service_role_unset" };
  } else {
    const admin = supabaseAdmin;
    const probe = async (table: string): Promise<TableCheck> => {
      const { error } = await admin.from(table).select("id").limit(1);
      if (error) {
        const msg = error.message ?? "";
        const missing =
          error.code === "42P01" ||
          error.code === "PGRST205" ||
          msg.includes("does not exist") ||
          msg.includes("schema cache");
        return { ok: false, detail: missing ? "table_missing" : "query_error" };
      }
      return { ok: true };
    };

    checks.contact_messages = await probe("contact_messages");
    checks.merchant_applications = await probe("merchant_applications");
    checks.webhook_logs = await probe("webhook_logs");
  }

  const adminTablesOk =
    !supabaseAdmin ||
    (checks.contact_messages &&
      "ok" in checks.contact_messages &&
      checks.contact_messages.ok &&
      checks.merchant_applications &&
      "ok" in checks.merchant_applications &&
      checks.merchant_applications.ok);

  const catalogOk = catalog.score >= 9.5;
  const overallOk = productsOk && adminTablesOk && catalogOk;
  checks.catalog_readiness = {
    ok: catalogOk,
    detail: `score_${catalog.score}`,
  };
  checks.cashfree_config = {
    ok: paymentConfigOk,
    detail: paymentConfigOk ? "configured" : "missing_env",
  };
  checks.cron_secret = {
    ok: cronSecretOk,
    detail: cronSecretOk ? "configured" : "missing_env",
  };

  return NextResponse.json(
    {
      ok: overallOk,
      service: "digital-swarm-ecommerce",
      checks,
      catalog,
    },
    { status: productsOk ? 200 : 503 }
  );
}
