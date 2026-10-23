"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Contenedor que marca `data-in` la primera vez que entra en pantalla.
 * Las clases `in-*` de globals.css quedan pausadas en su estado inicial hasta ese momento.
 */
export function InView({ className, children, amount = 0.2 }: { className?: string; children: ReactNode; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.in = "";
        io.disconnect();
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  return (
    <div ref={ref} data-scope className={className}>
      {children}
    </div>
  );
}
