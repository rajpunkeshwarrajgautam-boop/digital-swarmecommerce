import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical FAQ",
  description: "Operations, licensing, and implementation details for Digital Swarm assets. Find answers to your technical queries.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
