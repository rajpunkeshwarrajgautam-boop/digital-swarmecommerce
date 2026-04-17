"use client";

import { useRef, useCallback } from "react";

/**
 * Lightweight UI click — Web Audio oscillator only (no fetch/decode).
 * Avoids decodeAudioData failures from malformed/oversized embedded WAV payloads.
 */
export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const playClick = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;

      if (!ctxRef.current) ctxRef.current = new AC();
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") void ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.035;
      osc.frequency.value = 920;
      osc.type = "square";
      osc.connect(gain);
      gain.connect(ctx.destination);
      const t0 = ctx.currentTime;
      osc.start(t0);
      osc.stop(t0 + 0.028);
    } catch {
      /* ignore — audio optional */
    }
  }, []);

  return { playClick };
}
