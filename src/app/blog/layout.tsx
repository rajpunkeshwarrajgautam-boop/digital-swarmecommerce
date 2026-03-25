import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field Reports",
  description: "Technical deep dives, SaaS industry analysis, and Digital Swarm system updates. Stay ahead of the curve.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
