import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Licensing & Acquisition Tiers",
  description: "Flexible pricing for elite developers. Choose your transmission tier and gain instant access to the swarm's premium protocols.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
