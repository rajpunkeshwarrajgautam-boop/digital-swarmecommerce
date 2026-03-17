"use client";

import { useEffect } from "react";
import { CustomCursor } from "@/components/ui/CustomCursor";

export function VisualQuality() {
  useEffect(() => {
    // Implement a simple Lenis-like smooth scroll via CSS for now since we can't install packages
    document.documentElement.style.scrollBehavior = "smooth";
    
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

    // Intersection Observer for reveals stays as it is efficient
    const elementsToObserve = document.querySelectorAll(".silk-reveal-mask, .ono-text-split, .ono-reveal");
    elementsToObserve.forEach(el => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  return <CustomCursor />;
}
