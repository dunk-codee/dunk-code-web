"use client";

import { useRef, useState } from "react";
import { CHANNELS } from "@/lib/content";
import { at } from "@/lib/motion";

/**
 * Canales de contacto en cascada: cada fila entra desde la derecha mientras se dibuja su línea.
 * El email además se copia al hacer clic, porque `mailto:` no hace nada si la compu
 * no tiene un programa de correo configurado (lo más común en Windows).
 */
export function ContactChannels() {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), 2200);
    }, () => {});
  };

  return (
    <>
      {CHANNELS.map((c, i) => {
        const isMail = c.href.startsWith("mailto:");
        const done = copied === c.k;
        return (
          <a
            key={c.k}
            href={c.href}
            onClick={isMail ? () => copy(c.k, c.v) : undefined}
            {...(c.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
            className="relative flex items-center justify-between gap-4 py-6 text-paper transition-[padding,color] duration-350 ease-snap hover:pl-3 hover:text-orange"
          >
            <span aria-hidden className="in-line absolute inset-x-0 top-0 h-px origin-left bg-ink-2" style={at(300 + i * 140)} />
            <span className="in-item flex flex-col gap-1.5" style={at(380 + i * 140)}>
              <span className="label-mono text-subtle">{c.k}</span>
              <span className="text-[clamp(20px,2vw,26px)] font-medium tracking-[-0.02em]">{c.v}</span>
            </span>
            <span className="in-item font-mono" style={at(460 + i * 140)}>
              {done ? (
                <span role="status" className="label-mono animate-fade text-orange">¡Copiado!</span>
              ) : (
                <span aria-hidden className="text-xl">↗</span>
              )}
            </span>
          </a>
        );
      })}
      <span aria-hidden className="in-line h-px origin-left bg-ink-2" style={at(300 + CHANNELS.length * 140)} />
    </>
  );
}
