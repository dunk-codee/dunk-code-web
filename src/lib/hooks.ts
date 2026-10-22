"use client";

import { useEffect, useEffectEvent, useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}

export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

/** Runs `onFrame` at most once per animation frame while the page scrolls or resizes. */
export function useScrollFrame(onFrame: () => void) {
  const run = useEffectEvent(onFrame);
  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; run(); });
    };
    run();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);
}

/** Locks page scroll while `locked` is true (menu / modal). */
export function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [locked]);
}

export function useEscape(onEscape: () => void) {
  const handler = useEffectEvent(onEscape);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handler(); };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
}
