"use client";

import { Fragment, useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gravityDrop } from "@/lib/bounce";
import { Ball } from "./ball";
import { HeroConnect } from "./hero-connect";
import { afterIntro } from "./intro";
import { prefersReducedMotion, useScrollFrame } from "@/lib/hooks";

const LEAD =
  "Somos Dunk Code. Diseñamos y desarrollamos sitios, apps y sistemas a medida para negocios que necesitan su propia herramienta.";

/** Los delays de entrada son relativos al momento en que sube el telón de carga (o al inicio, si ya se vio). */
const delay = (ms: number): CSSProperties => ({ animationDelay: afterIntro(ms) });

export function Hero() {
  const spinRef = useRef<HTMLSpanElement>(null);
  const dropRef = useRef<HTMLSpanElement>(null);
  const squashRef = useRef<HTMLSpanElement>(null);
  const rollRef = useRef<HTMLSpanElement>(null);

  // Sin intro (ya vista en la sesión), la pelota del título cae con física real desde arriba de la pantalla,
  // en el mismo momento que tenía el `ball-drop` CSS (que en ese caso queda desactivado en globals.css).
  useEffect(() => {
    const [drop, squash, roll] = [dropRef.current, squashRef.current, rollRef.current];
    if (!drop || !squash || !roll || prefersReducedMotion() || !document.documentElement.hasAttribute("data-intro-seen")) return;
    // Si el navegador restauró el scroll y la pelota no está a la vista, aparece quieta en su lugar.
    const { bottom } = drop.getBoundingClientRect();
    if (bottom <= 0 || bottom > innerHeight) {
      drop.style.opacity = "1";
      return;
    }
    const anim = gravityDrop(bottom + 20);
    const opts: KeyframeAnimationOptions = { duration: anim.duration, delay: Math.max(0, 650 - performance.now()), fill: "backwards" };
    const anims = [
      drop.animate(anim.move, opts),
      squash.animate(anim.shape, opts),
      roll.animate([{ rotate: "-300deg" }, { rotate: "0deg" }], { ...opts, easing: "cubic-bezier(.15,.6,.3,1)" }),
    ];
    drop.style.opacity = "1";
    return () => anims.forEach((a) => a.cancel());
  }, []);

  useScrollFrame(() => {
    if (prefersReducedMotion()) return;
    // El giro por scroll va en el dibujo, no en el contenedor: si no, con la página scrolleada la caída sale torcida.
    if (spinRef.current) spinRef.current.style.transform = `rotate(${scrollY * 0.2}deg)`;
  });

  return (
    <section
      id="inicio"
      className="relative isolate z-1 box-border flex min-h-svh flex-col justify-between gap-12 overflow-clip px-gutter pt-[clamp(110px,15vh,160px)] pb-[clamp(28px,5vh,48px)]"
    >
      <div className="flex flex-wrap justify-between gap-4 font-mono text-[13px] leading-4.5 font-medium tracking-[.04em] text-muted uppercase">
        <span>
          <Typed text="// software a medida" at={300} />
          <span className="intro-fade inline-block" style={delay(1100)}>
            <span className="ml-1 inline-block h-[1.1em] w-[.55em] animate-blink bg-orange align-[-.2em] motion-reduce:animate-none" />
          </span>
        </span>
        <Typed text="Estudio de desarrollo" at={500} />
      </div>

      {/* Con el dibujo a la vista, título y dibujo van en fila: el dibujo toma el ancho que deja el título y no lo pisa. */}
      <div className="min-[1100px]:flex min-[1100px]:items-end min-[1100px]:justify-between min-[1100px]:gap-[clamp(24px,2.5vw,48px)]">
        {/* En mobile crece más rápido con el ancho (el renglón "a tu medida" + pelota mide ~5.5em y no se corta) y se frena en 88px, lo que mide al entrar en md. */}
        <h1 className="m-0 shrink-0 text-[clamp(44px,calc(16vw-6px),88px)] leading-[.9] md:text-[clamp(44px,11.6vw,204px)] font-bold tracking-[-0.058em] text-ink">
          <span className="sr-only">Software a tu medida</span>
          <span aria-hidden className="block pb-[.06em] perspective-[900px]">
            <Chars text="Software" at={0} />
          </span>
          <span aria-hidden className="block pb-[.06em] whitespace-nowrap perspective-[900px]">
            <Chars text="a tu medida" at={200} />
            <span data-hero-ball className="pointer-events-none relative z-3 ml-[.045em] inline-block size-[.19em]">
              <span ref={dropRef} className="ball-drop block size-full origin-bottom" style={delay(650)}>
                <span ref={squashRef} className="block size-full origin-bottom">
                  <span ref={rollRef} className="ball-roll block size-full" style={delay(650)}>
                    <span ref={spinRef} className="block size-full will-change-transform">
                      <Ball />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          </span>
        </h1>
        <HeroConnect />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-8">
        <div className="flex max-w-120 flex-col gap-6.5">
          <p className="m-0 text-[clamp(17px,1.45vw,20px)] leading-normal text-pretty text-ink-2">
            {LEAD.split(" ").map((w, i) => (
              <Fragment key={i}>
                <span className="intro-word inline-block" style={delay(550 + i * 18)}>
                  {w}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <div className="flex flex-wrap items-end gap-x-10 gap-y-5">
            <UnderLink href="#proyectos" arrow="↓" at={850} primary>
              Ver proyectos
            </UnderLink>
            <UnderLink href="#contacto" arrow="↗" at={950}>
              Hablemos
            </UnderLink>
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

/**
 * Botón de texto subrayado (como el de enviar en contacto): la línea se dibuja al entrar,
 * en hover se llena de naranja y la flecha avanza en su dirección.
 * `primary`: más grande y con la flecha adentro de un círculo naranja.
 */
function UnderLink({
  href,
  arrow,
  at,
  primary = false,
  children,
}: {
  href: string;
  arrow: "↓" | "↗";
  at: number;
  primary?: boolean;
  children: ReactNode;
}) {
  const nudge = arrow === "↓" ? "group-hover:translate-y-1" : "group-hover:translate-x-1 group-hover:-translate-y-1";
  const line = primary ? "h-0.5" : "h-px";
  return (
    <a
      href={href}
      className={`intro-fade group relative inline-flex items-center leading-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-orange ${
        primary
          ? "gap-[.4em] pb-3 text-[clamp(26px,2.5vw,36px)] font-bold tracking-[-0.045em] text-ink"
          : "gap-2 pb-2 text-[clamp(17px,1.4vw,20px)] font-medium tracking-[-0.02em] text-ink-2"
      }`}
      style={delay(at)}
    >
      {children}
      {primary ? (
        <span
          aria-hidden
          className="grid size-[2.1em] place-items-center rounded-full bg-orange font-mono text-[.55em] leading-none font-medium text-ink transition-transform duration-500 ease-snap group-hover:scale-110"
        >
          <span className="transition-transform duration-500 ease-snap group-hover:translate-y-[.3em]">{arrow}</span>
        </span>
      ) : (
        <span aria-hidden className={`font-mono text-muted transition-[translate,color] duration-500 ease-snap group-hover:text-orange ${nudge}`}>
          {arrow}
        </span>
      )}
      <span aria-hidden className={`intro-line absolute inset-x-0 bottom-0 origin-left ${line} bg-line-2`} style={delay(at + 250)} />
      <span
        aria-hidden
        className={`absolute inset-x-0 bottom-0 origin-left scale-x-0 bg-orange transition-transform duration-600 ease-snap group-hover:scale-x-100 group-focus-visible:scale-x-100 ${line}`}
      />
    </a>
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

/**
 * Texto que rueda hacia arriba y lo reemplaza otro en hover (necesita un padre `group`).
 * Sin `alt` entra una copia del mismo texto; el ancho es el del más largo de los dos.
 */
export function RollText({ children, alt = children }: { children: ReactNode; alt?: ReactNode }) {
  return (
    <span className="grid overflow-hidden leading-[1.3] whitespace-nowrap">
      <span className="col-start-1 row-start-1 transition-transform duration-450 ease-snap group-hover:-translate-y-full">{children}</span>
      <span aria-hidden className="col-start-1 row-start-1 translate-y-full transition-transform duration-450 ease-snap group-hover:translate-y-0">
        {alt}
      </span>
    </span>
  );
}
