"use client";

import { useRef } from "react";
import { Ball } from "./ball";
import { prefersReducedMotion, useScrollFrame } from "@/lib/hooks";

/** Decorative ball that rotates with page scroll. */
export function SpinBall({ className }: { className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollFrame(() => {
    if (ref.current && !prefersReducedMotion()) ref.current.style.transform = `rotate(${scrollY * 0.12}deg)`;
  });
  return (
    <div aria-hidden className={`pointer-events-none absolute ${className}`}>
      <div ref={ref} className="size-full">
        <Ball stroke={4} />
      </div>
    </div>
  );
}
