import { redirect } from "next/navigation";

/**
 * Database setup is an operator-only concern and the former public page exposed
 * destructive reset/seed SQL containing dummy products. Operational status is
 * available through the non-destructive health page instead.
 */
export default function SetupPage() {
  redirect("/health");
}
