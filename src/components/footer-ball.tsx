"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Ball } from "./ball";
import { prefersReducedMotion } from "@/lib/hooks";

/** El "punto" del logo del footer: cae como una pelota de básquet la primera vez que entra en pantalla. */
export function FooterBall() {
  const ref = useRef<HTMLSpanElement>(null);
  const [phase, setPhase] = useState<"idle" | "waiting" | "dropping">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || el.getBoundingClientRect().top <= innerHeight) return;
    setPhase("waiting");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setPhase("dropping");
        io.disconnect();
      },
      { threshold: 1, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dropping = phase === "dropping";
  return (
    <span ref={ref} aria-hidden className="mr-[.06em] ml-[.04em] inline-block size-[.27em]">
      <span
        className={`block size-full origin-bottom ${dropping ? "ball-drop" : ""} ${phase === "waiting" ? "opacity-0" : ""}`}
        style={{ "--drop-from": "-70vh" } as CSSProperties}
      >
        <span className={`block size-full ${dropping ? "ball-roll" : ""}`}>
          <Ball />
        </span>
      </span>
    </span>
  );
}
