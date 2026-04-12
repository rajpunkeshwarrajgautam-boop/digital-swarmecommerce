/**
 * Applies src/db/merchant_applications.sql via direct Postgres (DDL).
 * Requires DATABASE_URL or DIRECT_URL in .env / .env.local (Supabase → Settings → Database).
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });
config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const sqlPath = join(root, "src", "db", "merchant_applications.sql");

const url = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!url) {
  console.error(
    "Missing DATABASE_URL or DIRECT_URL.\n" +
      "In Supabase: Project Settings → Database → Connection string (URI), use the pooled or direct URL."
  );
  process.exit(1);
}

const sql = postgres(url, { ssl: "require", max: 1 });

try {
  const body = readFileSync(sqlPath, "utf8");
  await sql.unsafe(body);
  console.log("✅ merchant_applications: migration applied (or already present).");
} catch (e) {
  console.error("❌ Migration failed:", e?.message ?? e);
  process.exit(1);
} finally {
  await sql.end({ timeout: 5 });
}
