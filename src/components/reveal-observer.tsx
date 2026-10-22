"use client";

import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/hooks";

/**
 * Fades + lifts every `[data-reveal]` element below the fold as it scrolls into view.
 * The attribute value is the stagger step (×100ms).
 */
export function RevealObserver() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "none";
          io.unobserve(el);
        }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
      const d = (Number(el.dataset.reveal) || 0) * 100;
      el.style.opacity = "0";
      el.style.transform = "translateY(50px)";
      el.style.transition = `opacity .9s ${d}ms var(--ease-snap), transform 1.1s ${d}ms var(--ease-snap)`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
