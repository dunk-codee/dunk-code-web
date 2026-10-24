"use client";

import { useEffect, useRef, useState } from "react";
import { gravityDrop } from "@/lib/bounce";
import { prefersReducedMotion } from "@/lib/hooks";
import { Ball } from "./ball";

/**
 * El "punto" del logo del footer: la primera vez que entra en pantalla cae como una pelota de básquet,
 * con gravedad real, piques que pierden energía, aplastamiento en cada golpe y un giro que va frenando.
 */
export function FooterBall() {
  const ref = useRef<HTMLSpanElement>(null);
  const move = useRef<HTMLSpanElement>(null);
  const shape = useRef<HTMLSpanElement>(null);
  const turn = useRef<HTMLSpanElement>(null);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || el.getBoundingClientRect().top <= innerHeight) return;
    setWaiting(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || !move.current || !shape.current || !turn.current) return;
        io.disconnect();
        const anim = gravityDrop(innerHeight * 0.7);
        move.current.animate(anim.move, anim.duration);
        shape.current.animate(anim.shape, anim.duration);
        turn.current.animate([{ rotate: "-300deg" }, { rotate: "0deg" }], {
          duration: anim.duration,
          easing: "cubic-bezier(.15,.6,.3,1)",
        });
        setWaiting(false);
      },
      { threshold: 1, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} aria-hidden className="mr-[.06em] ml-[.04em] inline-block size-[.27em]">
      <span ref={move} className={`block size-full ${waiting ? "opacity-0" : ""}`}>
        <span ref={shape} className="block size-full origin-bottom">
          <span ref={turn} className="block size-full">
            <Ball />
          </span>
        </span>
      </span>
    </span>
  );
}
