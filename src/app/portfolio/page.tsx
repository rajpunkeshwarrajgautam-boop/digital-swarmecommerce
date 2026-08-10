import { redirect } from "next/navigation";

/**
 * The former portfolio used fictional projects, stock photography, inert
 * archive links and fabricated infrastructure statistics. It is retired until
 * Digital Swarm has publishable case studies with verifiable project links.
 */
export default function PortfolioPage() {
  redirect("/products");
}
