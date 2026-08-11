import { redirect } from "next/navigation";

/**
 * The old registry advertised cryptographic identities, live trust scores and
 * network velocity, but there is no production node network behind those
 * claims. Merchant onboarding is the real partner surface.
 */
export default function RegistryPage() {
  redirect("/merchant");
}
