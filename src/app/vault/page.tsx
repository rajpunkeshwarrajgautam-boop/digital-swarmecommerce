import { redirect } from "next/navigation";

/**
 * The old "Vault" UI represented an unfinished token/secondary-transfer
 * experiment. Purchased assets are now served by the real licensed-assets
 * account area, which resolves customer licences and issues private expiring
 * Supabase download URLs.
 */
export default function VaultPage() {
  redirect("/dashboard/assets");
}
