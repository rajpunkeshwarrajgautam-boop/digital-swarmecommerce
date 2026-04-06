/**
 * Resend Domain Verification Diagnostic Script
 * Run: npx ts-node -e "require('./scripts/check-resend-domain.ts')"
 * Or:  npx tsx scripts/check-resend-domain.ts
 *
 * Checks: domain verification status, SPF/DKIM records, delivery health.
 */

import * as https from "https";

const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND_KEY || "";

if (!RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY not set in environment");
  process.exit(1);
}

function resendGet(path: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.resend.com",
      path,
      method: "GET",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

interface ResendRecord {
  record: string;
  name: string;
  type: string;
  ttl: string;
  status: string;
  value: string;
  priority?: number;
}

interface ResendDomain {
  id: string;
  name: string;
  status: string;
  created_at: string;
  region: string;
  records: ResendRecord[];
}

interface ResendDomainsResponse {
  data: ResendDomain[];
}

async function main() {
  console.log("\n🔍 RESEND DOMAIN DIAGNOSTIC — Digital Swarm\n");
  console.log("=".repeat(50));

  // 1. List all domains
  const domainsResponse = (await resendGet("/domains")) as ResendDomainsResponse;
  const domains: ResendDomain[] = domainsResponse?.data || [];

  if (domains.length === 0) {
    console.log("⚠️  No domains found in Resend account.");
    console.log("   → Add domain at: https://resend.com/domains");
    return;
  }

  for (const domain of domains) {
    console.log(`\n📧 Domain: ${domain.name}`);
    console.log(`   ID:      ${domain.id}`);
    console.log(`   Status:  ${domain.status === "verified" ? "✅ VERIFIED" : "❌ " + domain.status.toUpperCase()}`);
    console.log(`   Region:  ${domain.region}`);
    console.log(`   Created: ${new Date(domain.created_at).toLocaleString("en-IN")}`);

    if (domain.records && domain.records.length > 0) {
      console.log("\n   DNS Records:");
      for (const record of domain.records) {
        const statusIcon = record.status === "verified" ? "✅" : "❌";
        console.log(`   ${statusIcon} [${record.type}] ${record.name}`);
        console.log(`      Value:  ${record.value}`);
        console.log(`      Status: ${record.status}`);
      }
    }

    // 2. Check for issues
    if (domain.status !== "verified") {
      console.log("\n   🚨 ACTION REQUIRED:");
      const missing = domain.records?.filter((r) => r.status !== "verified") || [];
      for (const rec of missing) {
        console.log(`   → Add ${rec.type} record for "${rec.name}" with value: ${rec.value}`);
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Diagnostic complete. Fix any ❌ records to improve deliverability.");
  console.log("   Check bounce rates at: https://resend.com/emails\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
