"use client";

import { useEffect, useRef } from "react";
import { MARQUEE } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/hooks";

const ITEMS = [...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE];

/** Endless ticker that speeds up with scroll velocity. */
export function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0, offset = 0, velocity = 0, lastY = scrollY;
    const loop = () => {
      const m = trackRef.current;
      const y = scrollY, dy = y - lastY;
      lastY = y;
      if (m && !prefersReducedMotion()) {
        velocity = velocity * 0.9 + dy * 0.1;
        offset += 0.7 + Math.min(30, Math.abs(velocity) * 0.9);
        const half = m.scrollWidth / 2;
        if (half) {
          offset %= half;
          m.style.transform = `translateX(${-offset}px)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div aria-hidden className="relative z-[2] overflow-hidden border-b border-ink-2 bg-ink py-5 text-paper">
      <div ref={trackRef} className="flex w-max will-change-transform">
        {ITEMS.map((m, i) => (
          <span
            key={i}
            className="flex items-center gap-8 pr-8 text-[clamp(20px,2.2vw,30px)] leading-none font-medium tracking-[-0.02em] whitespace-nowrap"
          >
            {m}
            <span className="inline-block size-[.42em] rounded-full bg-orange" />
          </span>
        ))}
      </div>
    </div>
  );
}
