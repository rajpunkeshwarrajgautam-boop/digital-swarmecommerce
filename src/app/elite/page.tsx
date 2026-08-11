import { redirect } from "next/navigation";

/**
 * The former Elite subscription promised weekly agents, private communities
 * and engineering access, but there is no active subscription SKU backing
 * those promises. Keep the legacy URL routable without selling a dummy plan.
 */
export default function EliteTierPage() {
  redirect("/pricing");
}
