// Check contact_messages table via Supabase JS (read-only probe).
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  console.log("🔍 Checking if contact_messages table exists...");

  const { error: checkError } = await supabase.from("contact_messages").select("id").limit(1);

  if (!checkError) {
    console.log("✅ contact_messages table already exists! Nothing to do.");
    return;
  }

  if (checkError.code === "42P01") {
    console.log("⚠️  Table does not exist. Create it via Supabase SQL Editor using src/db/contact_messages.sql or src/db/schema.sql.");
    console.log("   👉 SQL Editor: Project → SQL → New query");
  } else {
    console.error("❌ Unexpected error:", checkError);
  }
}

run();
