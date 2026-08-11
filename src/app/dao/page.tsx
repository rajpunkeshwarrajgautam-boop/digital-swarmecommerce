import { redirect } from "next/navigation";

/**
 * The former DAO screen described a treasury, token-weighted voting and a
 * distributed governance network that are not production services. Keep the
 * legacy URL routable without presenting those experimental concepts as live.
 */
export default function DaoPage() {
  redirect("/about");
}
