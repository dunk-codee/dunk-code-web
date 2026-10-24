"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { NAV } from "@/lib/content";
import { prefersReducedMotion, useBodyLock, useEscape, useScrollFrame } from "@/lib/hooks";
import { bounce } from "@/lib/bounce";
import { Ball } from "./ball";
import { afterIntro } from "./intro";

/** Entrada escalonada después del telón de la intro (usa `.intro-header` de globals.css). */
const enter = (ms: number): CSSProperties => ({ animationDelay: afterIntro(300 + ms) });

/** Color de fondo de cada sección, leído una vez (las transparentes heredan el papel del body). */
const bgCache = new WeakMap<Element, [number, number, number]>();
function sectionBg(el: Element): [number, number, number] {
  let rgb = bgCache.get(el);
  if (!rgb) {
    const m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [];
    rgb = m.length >= 3 && m[3] !== 0 ? [m[0], m[1], m[2]] : [246, 245, 241];
    bgCache.set(el, rgb);
  }
  return rgb;
}

/** Salto de un link a otro: un arco alto y dos piques en el lugar. Si sale desde el aire (`y0`), no toma impulso. */
function hop(from: number, to: number, y0 = 0) {
  const dist = Math.abs(to - from);
  const h = Math.min(8 + dist * 0.07, 32);
  const dur = 230 + Math.sqrt(dist) * 17;
  return bounce(
    [
      { dur, h, x0: from, x1: to, y0 },
      { dur: dur * 0.42, h: h * 0.2, x0: to, x1: to },
      { dur: dur * 0.22, h: h * 0.05, x0: to, x1: to },
    ],
    y0 < -0.5 ? 0 : 70,
    [0.38, 0.15, 0.05],
  );
}

/** Primera aparición: cae desde arriba y pica cada vez más bajo. */
function drop(x: number) {
  return bounce(
    [
      { dur: 340, h: 46, x0: x, x1: x, fall: true },
      { dur: 300, h: 12, x0: x, x1: x },
      { dur: 160, h: 3, x0: x, x1: x },
    ],
    0,
    [0.42, 0.2, 0.07],
  );
}

export function SiteHeader() {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const fade = useRef<HTMLSpanElement>(null);
  const links = useRef<HTMLDivElement>(null);
  const ballX = useRef<HTMLSpanElement>(null);
  const ballY = useRef<HTMLSpanElement>(null);
  const ballSpin = useRef<HTMLSpanElement>(null);
  const lastX = useRef<number | null>(null);
  // Al hacer clic en un link, la sección queda fija hasta llegar (o 1.5s): el scroll suave no pasa por las del medio.
  const lock = useRef<{ id: string; until: number } | null>(null);
  const go = (id: string) => {
    lock.current = { id, until: performance.now() + 1500 };
    setActive(id);
  };

  useScrollFrame(() => {
    let act = "";
    for (const { id } of NAV) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < innerHeight * 0.45) act = id;
    }
    if (lock.current) {
      if (act === lock.current.id || performance.now() > lock.current.until) lock.current = null;
      else act = lock.current.id;
    }
    setActive(act);

    // Toma el color de la sección que tiene debajo: claro sobre oscuro y al revés.
    const h = header.current;
    if (!h) return;
    const under = [...document.querySelectorAll("main > section, footer")].find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= 36 && r.bottom > 36;
    });
    const [r, g, b] = under ? sectionBg(under) : [246, 245, 241];
    h.toggleAttribute("data-dark", 0.2126 * r + 0.7152 * g + 0.0722 * b < 128);
    if (fade.current) fade.current.style.background = `linear-gradient(rgb(${r} ${g} ${b} / .92), rgb(${r} ${g} ${b} / .55) 60%, transparent)`;
  });
  useBodyLock(menuOpen);
  useEscape(() => setMenuOpen(false));

  // El menú superpuesto es solo para mobile; se cierra si la ventana supera el breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 47.5rem)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // La pelota marca la sección activa: salta en arco de un link al otro y pica al caer.
  useEffect(() => {
    const box = links.current;
    const bx = ballX.current;
    const by = ballY.current;
    const bs = ballSpin.current;
    if (!box || !bx || !by || !bs) return;
    const target = () => box.querySelector<HTMLElement>(`[data-nav="${active}"]`);
    const el = target();
    if (!el) {
      bx.style.opacity = "0";
      lastX.current = null;
      return;
    }
    const x = el.offsetLeft + el.offsetWidth / 2;
    // Si la pelota está en pleno salto, el nuevo sale desde donde está ahora (no desde el link anterior).
    const flying = bx.getAnimations().some((a) => a.playState === "running");
    const now = flying ? new DOMMatrix(getComputedStyle(bx).transform) : null;
    const from = now ? now.e : lastX.current;
    lastX.current = x;
    bx.style.opacity = "1";
    bx.style.transform = `translate(${x}px, 0px)`;

    if (!prefersReducedMotion() && from !== x) {
      const anim = from === null ? drop(x) : hop(from, x, now?.f ?? 0);
      for (const n of [bx, by, bs]) n.getAnimations().forEach((a) => a.cancel());
      bx.animate(anim.move, anim.duration);
      by.animate(anim.shape, anim.duration);
      bs.animate(anim.turn, anim.duration);
    }

    // Si cambia el ancho (fuentes, resize), la reubica sin animar.
    const ro = new ResizeObserver(() => {
      const t = target();
      if (!t) return;
      lastX.current = t.offsetLeft + t.offsetWidth / 2;
      bx.style.transform = `translate(${lastX.current}px, 0px)`;
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, [active]);

  return (
    <>
      <header ref={header} className="group/h pointer-events-none fixed inset-x-0 top-0 z-50 px-gutter pt-4 pb-8">
        {/* Degradé del color de la sección de abajo, para que se lea sin una caja. */}
        <span ref={fade} aria-hidden className="absolute inset-0 -z-10" />
        <nav className="pointer-events-auto flex items-center justify-between gap-4 text-ink transition-colors duration-500 group-data-dark/h:text-paper">
          <a
            href="#inicio"
            onClick={() => go("")}
            aria-label="Dunk Code, ir al inicio"
            className="intro-header group flex items-baseline text-[24px] leading-none"
            style={enter(0)}
          >
            <span className="font-medium tracking-[-0.045em]">dunk</span>
            <span className="mx-[.07em] ml-[.05em] inline-block size-[.3em] rounded-full bg-orange transition-transform duration-500 ease-snap group-hover:-translate-y-[.35em]" />
            <span className="font-mono text-[.9em] tracking-[-0.05em]">code</span>
          </a>

          <div ref={links} className="relative hidden items-center md:flex">
            {NAV.map(({ id, label }, i) => (
              <a
                key={id}
                href={`#${id}`}
                data-nav={id}
                onClick={() => go(id)}
                aria-current={active === id ? "location" : undefined}
                className={`intro-header group relative px-4 pt-2 pb-5 font-mono text-[15px] leading-none font-medium transition-opacity duration-300 ${active === id ? "opacity-100" : "opacity-55 hover:opacity-100"}`}
                style={enter(90 + i * 70)}
              >
                {label}
                {/* Línea de hover: se dibuja de izquierda a derecha. */}
                <span
                  aria-hidden
                  className="absolute inset-x-4 bottom-3 h-px origin-left scale-x-0 bg-current transition-transform duration-400 ease-snap group-hover:scale-x-100"
                />
              </a>
            ))}
            <span
              ref={ballX}
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 -ml-[5px] opacity-0 transition-opacity duration-200"
            >
              <span ref={ballY} className="block size-2.5 origin-bottom">
                <span ref={ballSpin} className="block size-full">
                  <Ball stroke={7} />
                </span>
              </span>
            </span>
          </div>

          <a
            href="#contacto"
            onClick={() => go("contacto")}
            className="intro-header group relative isolate hidden h-11 items-center overflow-hidden rounded-full bg-ink px-5 text-[15px] font-medium text-paper transition-colors duration-450 group-data-dark/h:bg-paper group-data-dark/h:text-ink hover:text-ink md:flex"
            style={enter(90 + NAV.length * 70)}
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-full -z-10 h-[160%] rounded-t-[50%] bg-orange transition-transform duration-500 ease-snap group-hover:-translate-y-full"
            />
            Hablemos
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="intro-header h-11 rounded-full bg-ink px-[18px] font-mono text-[13px] font-medium text-paper group-data-dark/h:bg-paper group-data-dark/h:text-ink md:hidden"
            style={enter(120)}
          >
            {menuOpen ? "Cerrar" : "Menú"}
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-45 flex animate-fade flex-col justify-center gap-1.5 bg-ink p-8 text-paper md:hidden"
        >
          {NAV.map(({ id, label }, i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="flex animate-[hero-fade_.7s_var(--ease-snap)_backwards] items-baseline gap-4 text-[52px] leading-[1.1] font-bold tracking-[-0.045em] hover:text-orange motion-reduce:animate-none"
              style={{ animationDelay: `${80 + i * 70}ms` }}
            >
              <span className="font-mono text-sm font-medium tracking-normal text-subtle">{String(i + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
          <div className="mt-8 font-mono text-[13px] font-medium text-subtle">{"// software a medida"}</div>
        </div>
      )}
    </>
  );
}
