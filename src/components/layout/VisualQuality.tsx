"use client";

import { useEffect } from "react";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { CommandCenter } from "@/components/ui/CommandCenter";

export function VisualQuality() {
  useEffect(() => {
    // Global Intersection Observer for ONO reveals
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const elementsToObserve = document.querySelectorAll(".silk-reveal-mask, .ono-text-split, .ono-reveal");
    elementsToObserve.forEach(el => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <CommandCenter />
    </>
  );
}
