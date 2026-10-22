"use client";

import { Fragment, useRef, type CSSProperties, type ReactNode } from "react";
import { Ball } from "./ball";
import { INTRO_MS } from "./intro";
import { prefersReducedMotion, useScrollFrame } from "@/lib/hooks";

const LEAD =
  "Somos Dunk Code. Diseñamos y desarrollamos sitios, apps y sistemas a medida para negocios que necesitan su propia herramienta.";

/** Los delays de entrada son relativos al momento en que sube el telón de carga. */
const delay = (ms: number): CSSProperties => ({ animationDelay: `${INTRO_MS + ms}ms` });

export function Hero() {
  const ballRef = useRef<HTMLSpanElement>(null);

  useScrollFrame(() => {
    if (ballRef.current && !prefersReducedMotion()) ballRef.current.style.transform = `rotate(${scrollY * 0.2}deg)`;
  });

  return (
    <section
      id="inicio"
      className="relative z-[1] box-border flex min-h-svh flex-col justify-between gap-12 overflow-clip px-gutter pt-[clamp(110px,15vh,160px)] pb-[clamp(28px,5vh,48px)]"
    >
      <div className="flex flex-wrap justify-between gap-4 font-mono text-[13px] leading-[18px] font-medium tracking-[.04em] text-muted uppercase">
        <span>
          <Typed text="// software a medida" at={300} />
          <span className="intro-fade inline-block" style={delay(1100)}>
            <span className="ml-1 inline-block h-[1.1em] w-[.55em] animate-blink bg-orange align-[-.2em] motion-reduce:animate-none" />
          </span>
        </span>
        <Typed text="Estudio de desarrollo" at={500} />
      </div>

      <h1 className="m-0 text-[clamp(44px,11.6vw,204px)] leading-[.9] font-bold tracking-[-0.058em] text-ink">
        <span className="sr-only">Software a tu medida</span>
        <span aria-hidden className="block pb-[.06em] [perspective:900px]">
          <Chars text="Software" at={0} />
        </span>
        <span aria-hidden className="block pb-[.06em] whitespace-nowrap [perspective:900px]">
          <Chars text="a tu medida" at={200} />
          <span ref={ballRef} data-hero-ball className="pointer-events-none relative z-[3] ml-[.045em] inline-block size-[.19em] will-change-transform">
            <span className="ball-drop block size-full origin-bottom" style={delay(650)}>
              <span className="ball-roll block size-full" style={delay(650)}>
                <Ball />
              </span>
            </span>
          </span>
        </span>
      </h1>

      <div className="flex flex-wrap items-end justify-between gap-8">
        <div className="flex max-w-[480px] flex-col gap-[26px]">
          <p className="m-0 text-[clamp(17px,1.45vw,20px)] leading-normal text-pretty text-ink-2">
            {LEAD.split(" ").map((w, i) => (
              <Fragment key={i}>
                <span className="intro-word inline-block" style={delay(550 + i * 18)}>
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a
              href="#proyectos"
              className="intro-pill group relative isolate inline-flex h-14 items-center gap-5 overflow-hidden rounded-full bg-ink pr-2 pl-7 text-base font-medium text-paper transition-colors duration-450 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
              style={delay(850)}
            >
              <RollText>Ver proyectos</RollText>
              <span aria-hidden className="relative grid size-10 place-items-center">
                <span className="absolute inset-0 -z-10 rounded-full bg-orange transition-transform duration-600 ease-snap group-hover:scale-[11]" />
                <span className="font-mono text-ink transition-transform duration-450 ease-snap group-hover:translate-y-0.5">↓</span>
              </span>
            </a>
            <a
              href="#contacto"
              className="intro-pill group relative isolate inline-flex h-14 items-center overflow-hidden rounded-full border border-ink px-7 text-base font-medium text-ink transition-colors duration-450 hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
              style={delay(950)}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-full -z-10 h-[160%] rounded-t-[50%] bg-ink transition-transform duration-500 ease-snap group-hover:-translate-y-full"
              />
              <RollText>Hablemos</RollText>
            </a>
          </div>
        </div>
        <div
          aria-hidden
          className="intro-fade flex items-center gap-3 font-mono text-[13px] font-medium text-muted"
          style={delay(1100)}
        >
          <span className="inline-block size-3 animate-hint rounded-full bg-orange motion-reduce:animate-none" />
          <span>{"// scrolleá"}</span>
        </div>
      </div>
    </section>
  );
}

/** Letras que se paran una por una (giro 3D + desenfoque). */
function Chars({ text, at }: { text: string; at: number }) {
  return [...text].map((c, i) => (
    <span key={i} className="intro-char inline-block" style={delay(at + i * 40)}>
      {c === " " ? " " : c}
    </span>
  ));
}

/** Texto monoespaciado que se tipea de a un carácter por paso. */
function Typed({ text, at }: { text: string; at: number }) {
  return (
    <span className="intro-type inline-block" style={{ ...delay(at), "--n": text.length } as CSSProperties}>
      {text}
    </span>
  );
}

/** Texto que rueda hacia arriba y lo reemplaza una copia en hover (necesita un padre `group`). */
function RollText({ children }: { children: ReactNode }) {
  return (
    <span className="relative block overflow-hidden leading-[1.3]">
      <span className="block transition-transform duration-450 ease-snap group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-450 ease-snap group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
}
