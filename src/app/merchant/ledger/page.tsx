import { redirect } from "next/navigation";

/** Commission records are presented on the factual settlement-review page. */
export default function ProtocolLedgerPage() {
  redirect("/merchant/payouts");
}
