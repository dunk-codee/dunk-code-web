"use client";

import { useEffect } from "react";

/**
 * Al estirar el scroll más allá del final (rebote de iOS) se ve el fondo del <html>, que es el claro de la página.
 * Mientras el footer está en pantalla lo pasa a `ink`, así abajo sigue el color del footer. El contenido no cambia:
 * el body mantiene su fondo `paper`.
 */
export function OverscrollColor() {
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(([e]) => {
      root.style.backgroundColor = e.isIntersecting ? "var(--color-ink)" : "";
    });
    io.observe(footer);
    return () => {
      io.disconnect();
      root.style.backgroundColor = "";
    };
  }, []);
  return null;
}
