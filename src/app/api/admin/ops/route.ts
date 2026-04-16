import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

const MASTER_ADMIN_EMAILS = [
  "admin@digitalswarm.in",
  "rajpunkeshwarrajgautam@gmail.com",
  "test@example.com",
];

type CountResult = { count: number | null };

export async function GET() {
  try {
    const user = await currentUser();
    const primaryEmail = user?.emailAddresses[0]?.emailAddress?.toLowerCase();

    if (!primaryEmail || !MASTER_ADMIN_EMAILS.includes(primaryEmail)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database service unavailable" }, { status: 500 });
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [
      pendingOlderThan30m,
      failedLast24h,
      paidLast24h,
      recentStuckOrders,
      webhookRetryBacklog,
      pendingWebhookLogs,
      webhookLogsProbe,
    ] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .lt("created_at", thirtyMinutesAgo),
      supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "failed")
        .gt("created_at", twentyFourHoursAgo),
      supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "paid")
        .gt("created_at", twentyFourHoursAgo),
      supabaseAdmin
        .from("orders")
        .select("id, cashfree_order_id, customer_email, status, created_at")
        .in("status", ["pending", "failed"])
        .order("created_at", { ascending: false })
        .limit(8),
      supabaseAdmin
        .from("webhook_logs")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "PAYMENT_SUCCESS_WEBHOOK")
        .eq("status", "partial_success_fulfillment_failed"),
      supabaseAdmin
        .from("webhook_logs")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabaseAdmin.from("webhook_logs").select("id").limit(1),
    ]);

    const webhookLogsAvailable = !webhookLogsProbe.error;

    return NextResponse.json({
      ok: true,
      diagnostics: {
        cashfreeConfigured: Boolean(
          process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY
        ),
        cronSecretConfigured: Boolean(process.env.CRON_SECRET),
        webhookLogsAvailable,
      },
      counters: {
        pendingOlderThan30m: (pendingOlderThan30m as CountResult).count || 0,
        failedLast24h: (failedLast24h as CountResult).count || 0,
        paidLast24h: (paidLast24h as CountResult).count || 0,
        webhookRetryBacklog:
          webhookLogsAvailable ? (webhookRetryBacklog as CountResult).count || 0 : null,
        pendingWebhookLogs:
          webhookLogsAvailable ? (pendingWebhookLogs as CountResult).count || 0 : null,
      },
      recentStuckOrders: recentStuckOrders.data || [],
    });
  } catch (error) {
    console.error("[ADMIN_OPS_ERR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
