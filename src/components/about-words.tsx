"use client";

import { Fragment, useRef } from "react";
import { prefersReducedMotion, useScrollFrame } from "@/lib/hooks";
import { at } from "@/lib/motion";

/** Párrafo cuyas palabras entran desde una máscara y se encienden una por una a medida que la sección entra en pantalla. */
export function AboutWords({ words }: { words: { t: string; accent: boolean }[] }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lit = useRef(-1);

  useScrollFrame(() => {
    const p = ref.current;
    if (!p) return;
    const vh = innerHeight;
    const progress = prefersReducedMotion()
      ? 1
      : // Termina de encenderse con el título al 40% de la pantalla: al llegar desde el link "Nosotros" ya está completo.
        Math.min(1, Math.max(0, (vh * 0.85 - p.getBoundingClientRect().top) / (vh * 0.45)));
    const n = Math.round(progress * words.length);
    if (n === lit.current) return;
    lit.current = n;
    p.querySelectorAll<HTMLElement>("[data-w]").forEach((w, i) => {
      w.style.color = i < n ? (w.dataset.accent ? "var(--color-orange)" : "var(--color-paper)") : "var(--color-dim)";
    });
  });

  return (
    <h2
      ref={ref}
      className="m-0 max-w-[1040px] text-[clamp(30px,4.6vw,66px)] leading-[1.08] font-medium tracking-[-0.035em] text-pretty"
    >
      {/* Cada palabra sube desde atrás de una máscara al entrar (necesita un `InView` arriba). */}
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="-mx-[.06em] -my-[.12em] inline-block overflow-clip px-[.06em] py-[.12em] align-top">
            <span
              data-w
              data-accent={w.accent || undefined}
              className="in-word inline-block text-paper transition-colors duration-350"
              style={at(150 + i * 70)}
            >
              {w.t}
            </span>
          </span>{" "}
        </Fragment>
      ))}
    </h2>
  );
}
