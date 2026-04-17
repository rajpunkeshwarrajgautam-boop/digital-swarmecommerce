"use client";

import dynamic from "next/dynamic";
import { ForgeToast } from "@/components/ui/ForgeToast";

const VisualQuality = dynamic(
  () => import("@/components/layout/VisualQuality").then((m) => ({ default: m.VisualQuality })),
  { ssr: false },
);
const AIConcierge = dynamic(
  () => import("@/components/forge/AIConcierge").then((m) => ({ default: m.AIConcierge })),
  { ssr: false },
);
const HiveMindChat = dynamic(
  () => import("@/components/chat/HiveMindChat").then((m) => ({ default: m.HiveMindChat })),
  { ssr: false },
);

export function RootClientWidgets() {
  return (
    <>
      <VisualQuality />
      <ForgeToast />
      <AIConcierge />
      <HiveMindChat />
    </>
  );
}
