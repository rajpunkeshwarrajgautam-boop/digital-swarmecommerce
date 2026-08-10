import { redirect } from "next/navigation";

/**
 * Legacy launch-campaign URL. The former page advertised an unbacked HUNTER40
 * discount, fabricated usage metrics and the wrong payment processor. Current
 * catalogue pricing is authoritative and no Product Hunt promotion is active.
 */
export default function ProductHuntHub() {
  redirect("/products");
}
