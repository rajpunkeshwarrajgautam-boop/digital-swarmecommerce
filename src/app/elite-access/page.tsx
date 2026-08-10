import { redirect } from "next/navigation";

/**
 * Legacy marketing route. The former page advertised unverified private-vault,
 * code-review and priority-support membership benefits. Current paid options
 * are documented on the pricing and product pages instead.
 */
export default function EliteAccessPage() {
  redirect("/pricing");
}
