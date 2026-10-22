"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FILTERS, PROJECTS, type Filter } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/hooks";
import { ProjectModal } from "./project-modal";

export type ProjectView = "list" | "grid";

// Solo se ofrecen categorías que tienen proyectos; con una sola categoría no hay nada que filtrar.
const AVAILABLE = FILTERS.filter((f) => f === "Todos" || PROJECTS.some((p) => p.cat === f));

export function Projects({ view = "list" }: { view?: ProjectView }) {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [hover, setHover] = useState(-1);
  const [sel, setSel] = useState<number | null>(null);

  const list = PROJECTS.map((p, gi) => ({ ...p, gi })).filter((p) => filter === "Todos" || p.cat === filter);
  const hoveredGi = useLastDefined(hover >= 0 ? list[hover]?.gi : undefined);
  const hovered = hoveredGi === undefined ? undefined : PROJECTS[hoveredGi];
  const cover = hovered?.images?.[0];
  const previewRef = useCursorPreview(view === "list" && hover >= 0 && sel === null);

  // Otros componentes abren un proyecto disparando este evento.
  useEffect(() => {
    const onOpen = (e: Event) => setSel((e as CustomEvent<number>).detail);
    addEventListener("project:open", onOpen);
    return () => removeEventListener("project:open", onOpen);
  }, []);

  return (
    <section id="proyectos" className="relative z-[2] bg-sand px-gutter py-[clamp(90px,11vw,160px)]">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-6">
          <div data-reveal="0">
            <div className="eyebrow mb-5 text-orange-deep">03 {"// proyectos"}</div>
            <h2 className="m-0 flex items-start gap-3 text-[clamp(44px,6.4vw,96px)] leading-[.95] font-bold tracking-[-0.05em]">
              Proyectos
              <span className="mt-[.5em] font-mono text-sm font-medium tracking-normal text-muted">
                ({String(list.length).padStart(2, "0")})
              </span>
            </h2>
          </div>
          {AVAILABLE.length > 2 && <div data-reveal="1" role="group" aria-label="Filtrar proyectos" className="flex flex-wrap gap-2">
            {AVAILABLE.map((f) => {
              const active = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => { setFilter(f); setHover(-1); }}
                  className={`h-10 rounded-full border px-4 font-mono text-[13px] font-medium transition-colors duration-250 ${active ? "border-ink bg-ink text-paper" : "border-line-2 text-ink hover:border-ink"}`}
                >
                  {f}
                </button>
              );
            })}
          </div>}
        </div>

        {view === "list" ? (
          <ul className="m-0 list-none border-b border-line p-0" onMouseLeave={() => setHover(-1)}>
            {list.map((p, i) => {
              const h = hover === i;
              return (
                <li key={p.name}>
                  <button
                    type="button"
                    onClick={() => { setSel(p.gi); setHover(-1); }}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(-1)}
                    className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-5 border-t border-line px-[clamp(8px,1.4vw,20px)] py-[clamp(20px,2.6vw,32px)] text-left text-ink transition-colors duration-300 ${h ? "bg-paper" : ""}`}
                  >
                    <span
                      className={`flex min-w-0 items-baseline gap-[clamp(14px,2.4vw,36px)] transition-transform duration-450 ease-snap ${h ? "translate-x-3.5" : ""}`}
                    >
                      <span className="font-mono text-[13px] font-medium text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="truncate text-[clamp(28px,4vw,58px)] leading-[1.05] font-medium tracking-[-0.04em]">{p.name}</span>
                    </span>
                    <span className="flex items-center gap-[clamp(12px,2.4vw,40px)] font-mono text-[13px] font-medium text-ink-2">
                      <span className="hidden md:inline">{p.type}</span>
                      <span>{p.year}</span>
                      <span
                        aria-hidden
                        className={`grid size-10 place-items-center rounded-full text-base transition-[transform,background-color,color] duration-450 ease-snap ${h ? "-rotate-45 bg-ink text-paper" : "text-ink"}`}
                      >
                        →
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-[clamp(16px,2vw,28px)]">
            {list.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setSel(p.gi)}
                className="flex flex-col gap-4 rounded-3xl bg-paper p-3 text-left text-ink transition-[transform,box-shadow] duration-400 ease-snap hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-24px_rgba(18,18,18,.35)]"
              >
                <span className="stripes-light relative box-border flex aspect-[4/3] w-full items-end overflow-hidden rounded-2xl border border-line p-4 font-mono text-xs font-medium text-muted">
                  {p.images?.[0] ? (
                    <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="(min-width: 760px) 33vw, 100vw" className="object-cover object-top" />
                  ) : (
                    "// captura del proyecto"
                  )}
                </span>
                <span className="flex w-full items-baseline justify-between gap-3 px-1.5 pb-1.5">
                  <span className="text-[26px] leading-[1.15] font-medium tracking-[-0.03em]">{p.name}</span>
                  <span className="font-mono text-xs font-medium whitespace-nowrap text-muted">
                    {p.type} · {p.year}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vista previa flotante que sigue al cursor sobre la lista (solo dispositivos con puntero). */}
      <div
        ref={previewRef}
        aria-hidden
        className="stripes-light pointer-events-none fixed top-0 left-0 z-60 box-border flex aspect-[4/3] w-[300px] flex-col justify-between overflow-hidden rounded-[18px] border border-line p-4 opacity-0 shadow-[0_30px_60px_-20px_rgba(18,18,18,.4)] will-change-[transform,opacity]"
      >
        {cover ? (
          <Image src={cover.src} alt="" fill sizes="300px" className="object-cover object-top" />
        ) : (
          <>
            <span className="font-mono text-xs font-medium text-muted">{"// captura del proyecto"}</span>
            <span className="flex items-center gap-2.5 text-[22px] leading-[1.1] font-medium tracking-[-0.03em] text-ink">
              <span className="size-2.5 rounded-full bg-orange" />
              {hovered?.name}
            </span>
          </>
        )}
      </div>

      {sel !== null && (
        <ProjectModal
          key={sel}
          project={PROJECTS[sel]}
          onClose={() => setSel(null)}
          onNext={PROJECTS.length > 1 ? () => setSel((s) => ((s ?? 0) + 1) % PROJECTS.length) : undefined}
        />
      )}
    </section>
  );
}

/** Conserva el último valor definido para que la vista previa no quede vacía mientras se desvanece. */
function useLastDefined<T>(value: T | undefined) {
  const [last, setLast] = useState(value);
  if (value !== undefined && value !== last) setLast(value);
  return value ?? last;
}

/** Sigue al mouse con un resorte y una leve inclinación; aparece mientras `active` sea true. */
function useCursorPreview(active: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const state = useRef({ mx: 0, my: 0, x: 0, y: 0, o: 0, raf: 0 });

  useEffect(() => {
    const s = state.current;
    s.mx = s.x = innerWidth / 2;
    s.my = s.y = innerHeight / 2;
    const onMove = (e: MouseEvent) => { s.mx = e.clientX; s.my = e.clientY; };
    addEventListener("mousemove", onMove);
    return () => { removeEventListener("mousemove", onMove); cancelAnimationFrame(s.raf); };
  }, []);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (min-width: 47.5rem)").matches;
    activeRef.current = active && canHover;
    const s = state.current;
    if (!activeRef.current && s.o < 0.001) return;
    if (prefersReducedMotion()) { s.x = s.mx; s.y = s.my; }

    const tick = () => {
      const el = ref.current;
      if (!el) return;
      const on = activeRef.current ? 1 : 0;
      const ox = s.x;
      s.x += (s.mx - s.x) * 0.14;
      s.y += (s.my - s.y) * 0.14;
      s.o += (on - s.o) * 0.16;
      const rot = Math.max(-10, Math.min(10, (s.x - ox) * 0.35));
      el.style.opacity = s.o.toFixed(3);
      el.style.transform = `translate(${s.x + 24}px,${s.y}px) translate(0,-50%) rotate(${rot}deg) scale(${0.85 + s.o * 0.15})`;
      // Corta el loop cuando terminó de desvanecerse.
      s.raf = on || s.o > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    cancelAnimationFrame(s.raf);
    s.raf = requestAnimationFrame(tick);
  }, [active]);

  return ref;
}
