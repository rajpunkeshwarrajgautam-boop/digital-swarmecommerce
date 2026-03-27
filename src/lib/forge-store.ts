"use client";

import { create } from "zustand";

interface ForgeUIState {
  isConciergeOpen: boolean;
  systemStatus: "idle" | "processing" | "optimizing";
  toggleConcierge: () => void;
  setConciergeOpen: (open: boolean) => void;
  setSystemStatus: (status: ForgeUIState["systemStatus"]) => void;
}

export const useForgeStore = create<ForgeUIState>((set) => ({
  isConciergeOpen: false,
  systemStatus: "idle",
  toggleConcierge: () => set((state) => ({ isConciergeOpen: !state.isConciergeOpen })),
  setConciergeOpen: (open) => set({ isConciergeOpen: open }),
  setSystemStatus: (status) => set({ systemStatus: status }),
}));
