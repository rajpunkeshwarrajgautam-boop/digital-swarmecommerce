import { NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { evaluateCatalogReadiness } from "@/lib/catalog-readiness";

export const dynamic = "force-dynamic";

type TableCheck = { ok: boolean; detail?: string };

function strongSecret(name: string): boolean {
  return Boolean(process.env[name]?.trim() && process.env[name]!.trim().length >= 32);
}

/**
 * GET /api/health
 * Operational readiness: catalog/database plus the configuration required to
 * accept a payment and issue a private licensed delivery.
 */
export async function GET() {
  const checks: Record<string, TableCheck | { ok: boolean; count?: number }> = {};
  const catalog = evaluateCatalogReadiness();
  const paymentConfigOk = Boolean(
    process.env.CASHFREE_APP_ID?.trim() && process.env.CASHFREE_SECRET_KEY?.trim()
  );
  const emailConfigOk = Boolean(process.env.RESEND_API_KEY?.trim());
  const fulfillmentSecurityOk =
    strongSecret("INTERNAL_FULFILLMENT_SECRET") && strongSecret("LICENSE_SIGNING_SECRET");
  const bridgeSecurityOk = !process.env.SWARM_BRIDGE_SECRET?.trim() || strongSecret("SWARM_BRIDGE_SECRET");
  const cronSecretOk = Boolean(process.env.CRON_SECRET?.trim());

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

  const adminTablesOk = Boolean(
    supabaseAdmin &&
    checks.contact_messages &&
    "ok" in checks.contact_messages &&
    checks.contact_messages.ok &&
    checks.merchant_applications &&
    "ok" in checks.merchant_applications &&
    checks.merchant_applications.ok &&
    checks.webhook_logs &&
    "ok" in checks.webhook_logs &&
    checks.webhook_logs.ok
  );

  const catalogOk = catalog.score === 10;
  checks.catalog_readiness = {
    ok: catalogOk,
    detail: `score_${catalog.score}`,
  };
  checks.cashfree_config = {
    ok: paymentConfigOk,
    detail: paymentConfigOk ? "configured" : "missing_env",
  };
  checks.delivery_email = {
    ok: emailConfigOk,
    detail: emailConfigOk ? "configured" : "missing_env",
  };
  checks.fulfillment_security = {
    ok: fulfillmentSecurityOk,
    detail: fulfillmentSecurityOk ? "configured" : "missing_or_weak_secret",
  };
  checks.bridge_security = {
    ok: bridgeSecurityOk,
    detail: bridgeSecurityOk ? "disabled_or_configured" : "weak_secret",
  };
  checks.cron_secret = {
    ok: cronSecretOk,
    detail: cronSecretOk ? "configured" : "missing_env_optional",
  };

  const overallOk =
    productsOk &&
    adminTablesOk &&
    catalogOk &&
    paymentConfigOk &&
    emailConfigOk &&
    fulfillmentSecurityOk &&
    bridgeSecurityOk;

  return NextResponse.json(
    {
      ok: overallOk,
      service: "digital-swarm-ecommerce",
      checks,
      catalog,
    },
    { status: overallOk ? 200 : 503 }
  );
}
