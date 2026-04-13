import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secure Transmission",
  description: "Initiate contact with the Digital Swarm core team. Open channels for support, partnerships, or custom protocol builds.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
