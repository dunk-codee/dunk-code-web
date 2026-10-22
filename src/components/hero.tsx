"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Ball } from "./ball";
import { prefersReducedMotion, useScrollFrame } from "@/lib/hooks";

const delay = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

export function Hero({ ballZoom = true }: { ballZoom?: boolean }) {
  const ballRef = useRef<HTMLSpanElement>(null);
  const fadesRef = useRef<HTMLElement[]>([]);
  const ball0 = useRef<{ cx: number; cy: number; size: number } | null>(null);

  // Document position of the ball at rest, used as the zoom origin.
  const measure = () => {
    const b = ballRef.current;
    if (!b) return;
    let el: HTMLElement | null = b, x = 0, y = 0;
    while (el) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent as HTMLElement | null; }
    ball0.current = { cx: x + b.offsetWidth / 2, cy: y + b.offsetHeight / 2, size: b.offsetWidth || 1 };
  };

  useEffect(() => {
    fadesRef.current = [...document.querySelectorAll<HTMLElement>("[data-herofade]")];
    measure();
    document.fonts?.ready.then(measure);
    addEventListener("resize", measure);
    return () => removeEventListener("resize", measure);
  }, []);

  useScrollFrame(() => {
    const b = ballRef.current, b0 = ball0.current;
    if (!b || !b0) return;
    const reduced = prefersReducedMotion();
    const zoom = ballZoom && !reduced;
    const y = scrollY, vw = innerWidth, vh = innerHeight;
    const p = Math.min(1, Math.max(0, y / (vh * 0.85)));
    if (zoom) {
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      const S = (Math.hypot(vw, vh) / b0.size) * 1.1;
      const tx = (vw / 2 - b0.cx) * e, ty = (vh / 2 - (b0.cy - y)) * e;
      b.style.transform = `translate(${tx}px,${ty}px) scale(${1 + e * S}) rotate(${y * 0.2}deg)`;
    } else {
      b.style.transform = reduced ? "none" : `rotate(${y * 0.2}deg)`;
    }
    const op = String(zoom ? Math.max(0, 1 - p * 1.7) : 1);
    fadesRef.current.forEach((f) => (f.style.opacity = op));
  });

  return (
    <section
      id="inicio"
      className="relative z-[1] box-border flex min-h-svh flex-col justify-between gap-12 overflow-clip px-gutter pt-[clamp(110px,15vh,160px)] pb-[clamp(28px,5vh,48px)]"
    >
      <div
        data-herofade
        className="intro-fade flex flex-wrap justify-between gap-4 font-mono text-[13px] leading-[18px] font-medium tracking-[.04em] text-muted uppercase"
        style={delay(600)}
      >
        <span>{"// software a medida"}</span>
        <span>Estudio de desarrollo</span>
      </div>

      <h1 className="m-0 text-[clamp(44px,11.6vw,204px)] leading-[.9] font-bold tracking-[-0.058em] text-ink">
        <span className="block overflow-hidden pb-[.06em]">
          <span className="intro-line inline-block" style={delay(120)}>Software</span>
        </span>
        <span className="intro-clip block pb-[.06em]">
          <span className="intro-line inline-block whitespace-nowrap" style={delay(260)}>
            a tu medida
            <span
              ref={ballRef}
              className="pointer-events-none relative z-[3] ml-[.045em] inline-block size-[.19em] will-change-transform"
            >
              <span className="ball-drop block size-full origin-bottom" style={delay(700)}>
                <span className="ball-roll block size-full" style={delay(700)}>
                  <Ball />
                </span>
              </span>
            </span>
          </span>
        </span>
      </h1>

      <div className="flex flex-wrap items-end justify-between gap-8">
        <div data-herofade className="intro-fade flex max-w-[480px] flex-col gap-[26px]" style={delay(720)}>
          <p className="m-0 text-[clamp(17px,1.45vw,20px)] leading-normal text-pretty text-ink-2">
            Somos Dunk Code. Diseñamos y desarrollamos sitios, apps y sistemas a medida para negocios que necesitan su
            propia herramienta.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a
              href="#proyectos"
              className="inline-flex h-[52px] items-center gap-3 rounded-full bg-ink px-6 text-base font-medium text-paper transition-[transform,background-color] duration-250 hover:-translate-y-0.5 hover:bg-ink-2"
            >
              Ver proyectos <span className="font-mono">↓</span>
            </a>
            <a
              href="#contacto"
              className="inline-flex h-[52px] items-center rounded-full border border-ink px-6 text-base font-medium text-ink transition-colors duration-250 hover:bg-ink hover:text-paper"
            >
              Hablemos
            </a>
          </div>
        </div>
        <div
          data-herofade
          aria-hidden
          className="intro-fade flex items-center gap-3 font-mono text-[13px] font-medium text-muted"
          style={delay(840)}
        >
          <span className="inline-block size-3 animate-hint rounded-full bg-orange motion-reduce:animate-none" />
          <span>{"// scrolleá"}</span>
        </div>
      </div>
    </section>
  );
}
