import type { CSSProperties, ReactNode } from "react";
import { at } from "@/lib/motion";

const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * Aparición tipo explosión (clases `in-dot`, `in-spark`, `in-burst`; necesita un `InView` arriba):
 * un punto naranja late, estalla en chispas y el botón se abre en círculo desde el centro.
 * `w`/`h` = tamaño aproximado del botón, para que las chispas salgan por fuera del borde.
 * `tone`: fondo sobre el que va, para que las chispas alternas contrasten (blancas en oscuro, negras en claro).
 */
export function Burst({
  at: ms,
  w,
  h,
  tone = "dark",
  className = "",
  children,
}: {
  at: number;
  w: number;
  h: number;
  tone?: "dark" | "light";
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <span className="in-burst inline-flex" style={at(ms + 160)}>
        {children}
      </span>
      <span aria-hidden className="in-dot pointer-events-none absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5 hidden size-3 rounded-full bg-orange" style={at(ms)} />
      {SPARKS.map((a, i) => {
        const r = (a * Math.PI) / 180;
        const style = {
          "--x": `${Math.round(Math.cos(r) * (w / 2 + 16))}px`,
          "--y": `${Math.round(Math.sin(r) * (h / 2 + 14))}px`,
        } as CSSProperties;
        return (
          <span
            key={a}
            aria-hidden
            className={`in-spark pointer-events-none absolute top-1/2 left-1/2 -mt-[3px] -ml-[3px] hidden size-1.5 rounded-full ${i % 2 ? (tone === "dark" ? "bg-paper" : "bg-ink") : "bg-orange"}`}
            style={at(ms + 200, style)}
          />
        );
      })}
    </span>
  );
}
