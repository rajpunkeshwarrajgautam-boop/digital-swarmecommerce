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

    const elementsToObserve = document.querySelectorAll(".silk-reveal-mask, .ono-text-split, .ono-reveal");
    elementsToObserve.forEach(el => revealObserver.observe(el));

    // Add noise grain movement animation via JS
    const updateGrainPosition = () => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      document.body.style.setProperty('--grain-x', `${x}%`);
      document.body.style.setProperty('--grain-y', `${y}%`);
    };

    const interval = setInterval(updateGrainPosition, 50);
    return () => {
      clearInterval(interval);
      revealObserver.disconnect();
    };
  }, []);

  return <CustomCursor />;
}
