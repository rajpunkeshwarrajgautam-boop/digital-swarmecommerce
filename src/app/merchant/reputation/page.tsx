import { redirect } from "next/navigation";

/**
 * The former page displayed a hard-coded trust score and synthetic rank/fee
 * system. No production reputation engine backs those values.
 */
export default function ReputationProtocolPage() {
  redirect("/merchant");
}
