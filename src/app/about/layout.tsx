import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protocol Manifest",
  description: "The Digital Swarm philosophy: modular, technical, and high-performance. Learn about our mission to accelerate modern software development.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
