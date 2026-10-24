"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PROJECTS, type Project } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/hooks";
import { at } from "@/lib/motion";
import { InView } from "./in-view";
import { ProjectModal } from "./project-modal";

/** Cuándo empieza a abrirse la tapa: después de que la base terminó de aparecer (todo lo demás se cuenta desde acá). */
const T_LID = 380;

/** Cada cuánto cambia la captura de la notebook. */
const SHOT_MS = 3800;

export function Projects() {
  const [sel, setSel] = useState<number | null>(null);

  // Otros componentes abren un proyecto disparando este evento.
  useEffect(() => {
    const onOpen = (e: Event) => setSel((e as CustomEvent<number>).detail);
    addEventListener("project:open", onOpen);
    return () => removeEventListener("project:open", onOpen);
  }, []);

  return (
    <section id="proyectos" className="relative z-[2] bg-sand px-gutter py-[clamp(90px,11vw,160px)]">
      <div className="mx-auto max-w-[1240px]">
        <InView amount={0.5} className="mb-[clamp(48px,6vw,88px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="in-rise eyebrow mb-5 text-orange-deep">03 {"// proyectos"}</div>
            {/* El título sube desde atrás de una máscara, como los de Nosotros y Contacto. */}
            <h2 className="m-0 text-[clamp(44px,6.4vw,96px)] leading-[.95] font-bold tracking-[-0.05em]">
              <span className="-mx-[.08em] -my-[.12em] inline-block overflow-clip px-[.08em] py-[.12em] align-top">
                <span className="in-word inline-block" style={at(120)}>
                  Proyectos
                </span>
              </span>
            </h2>
          </div>
          <p className="in-rise m-0 max-w-[380px] text-[17px] leading-[1.55] text-pretty text-muted" style={at(300)}>
            Sitios y sistemas que hoy usan negocios reales, todos los días.
          </p>
        </InView>

        <div className="flex flex-col gap-[clamp(72px,9vw,140px)]">
          {PROJECTS.map((p, i) => (
            <CaseStudy key={p.name} project={p} index={i} onOpen={() => setSel(i)} />
          ))}
        </div>
      </div>

      {sel !== null && (
        <ProjectModal
          key={sel}
          project={{ ...PROJECTS[sel], meta: `${PROJECTS[sel].type} · ${PROJECTS[sel].year}`, tags: PROJECTS[sel].features }}
          onClose={() => setSel(null)}
          onNext={PROJECTS.length > 1 ? () => setSel((s) => ((s ?? 0) + 1) % PROJECTS.length) : undefined}
        />
      )}
    </section>
  );
}

/**
 * Un proyecto como caso: notebook + celular con las capturas reales (la de la notebook va rotando)
 * y al lado qué se resolvió, qué hace y los botones. Alterna de lado; entra con las clases `in-*`.
 */
function CaseStudy({ project: p, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const flip = index % 2 === 1;
  const n = String(index + 1).padStart(2, "0");

  return (
    <InView amount={0.2}>
      <article className="group/case">
        <div className="relative mb-[clamp(24px,3vw,40px)] flex items-center gap-4 pt-5 font-mono text-[13px] font-medium text-muted">
          <span aria-hidden className="in-line absolute inset-x-0 top-0 h-px origin-left bg-line-2" style={at(0)} />
          <span className="in-rise text-orange-deep" style={at(120)}>
            {n}
          </span>
          <span className="in-rise" style={at(180)}>
            {p.type} · {p.year}
          </span>
        </div>

        {/* La columna ancha es siempre la de la maqueta: al alternar de lado se invierten los anchos. */}
        <div
          className={`grid items-center gap-[clamp(36px,5vw,80px)] ${flip ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]" : "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"}`}
        >
          <div className={flip ? "md:order-2" : ""}>
            <Devices project={p} />
          </div>

          <div className="flex flex-col gap-[clamp(18px,2vw,26px)]">
            <h3 className="in-rise m-0 text-[clamp(34px,4.4vw,64px)] leading-[1] font-bold tracking-[-0.045em]" style={at(300)}>
              {p.name}
            </h3>
            <p className="in-rise m-0 max-w-[460px] text-[clamp(18px,1.5vw,21px)] leading-[1.5] text-pretty text-ink-2" style={at(400)}>
              {p.pitch}
            </p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {p.features.map((f, j) => (
                <li
                  key={f}
                  className="in-rise inline-flex items-center gap-2 rounded-full bg-paper px-3 py-2 font-mono text-xs font-medium text-ink-2"
                  style={at(500 + j * 80)}
                >
                  <span aria-hidden className="size-1.5 rounded-full bg-orange" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="in-rise mt-2 flex flex-wrap items-center gap-x-8 gap-y-4" style={at(560 + p.features.length * 80)}>
              <button
                type="button"
                onClick={onOpen}
                className="group relative inline-flex items-center gap-3 pb-2 text-[clamp(19px,1.6vw,22px)] leading-none font-bold tracking-[-0.03em] text-ink focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-orange"
              >
                Ver el caso
                <span aria-hidden className="grid size-8 place-items-center rounded-full bg-orange text-ink transition-transform duration-500 ease-snap group-hover:scale-105">
                  <ArrowIcon className="w-3.5 transition-transform duration-500 ease-snap group-hover:translate-x-0.5" />
                </span>
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-line-2" />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-orange transition-transform duration-600 ease-snap group-hover:scale-x-100" />
              </button>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-mono text-[13px] font-medium text-ink-2 transition-colors duration-250 hover:text-orange-deep"
                >
                  Visitar sitio
                  <span aria-hidden className="transition-transform duration-450 ease-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </InView>
  );
}

/**
 * Maqueta: notebook con las capturas de escritorio rotando (fundido + leve zoom, indicadores que se llenan
 * y flechas para pasarlas a mano) y un iPhone adelante con la captura mobile del hero. Rota sola mientras se
 * ve (fuera de pantalla se detiene); pasar una a mano reinicia el tiempo de la siguiente.
 */
function Devices({ project: p }: { project: Project }) {
  const shots = p.images ?? [];
  const [shot, setShot] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && shots.length > 1;
  // Depende de `shot`: cada cambio (automático o a mano) arranca de cero el tiempo de la próxima.
  useEffect(() => {
    if (!running || prefersReducedMotion()) return;
    const id = setTimeout(() => setShot((s) => (s + 1) % shots.length), SHOT_MS);
    return () => clearTimeout(id);
  }, [running, shot, shots.length]);

  const go = (step: number) => setShot((s) => (s + step + shots.length) % shots.length); // -1 anterior, 1 siguiente

  return (
    <div ref={ref}>
      <div className="relative pr-[9%] pb-[7%]">
        {/* Notebook: aparece la base, la tapa se abre desde la bisagra y la pantalla se enciende */}
        <div>
          <div className="in-lid rounded-[clamp(10px,1.2vw,16px)] bg-ink p-[1.3%] pb-[2%]" style={at(T_LID)}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[clamp(4px,.5vw,7px)] bg-ink-3">
              <div className="in-screen absolute inset-0 bg-paper" style={at(T_LID + 950)}>
                {shots.map((s, k) => (
                  <Image
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    fill
                    sizes="(min-width: 760px) 50vw, 90vw"
                    aria-hidden={k !== shot}
                    className={`object-cover object-top transition-[opacity,scale] duration-[1100ms] ease-snap ${k === shot ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="in-base relative mx-[-5%] h-[clamp(9px,1.1vw,15px)] rounded-b-[clamp(10px,1.2vw,16px)] bg-ink-2" style={at(0)}>
            <span aria-hidden className="absolute top-0 left-1/2 h-[45%] w-[14%] -translate-x-1/2 rounded-b-md bg-ink" />
          </div>
        </div>

        {/* iPhone adelante: marco fino, botones laterales e isla dinámica sobre la captura del hero */}
        {p.mobile && (
          <div
            className="in-phone absolute right-0 bottom-0 w-[23%] transition-[translate] duration-600 ease-snap group-hover/case:-translate-y-2"
            style={at(T_LID + 750)}
          >
            <div className="relative rounded-[clamp(14px,2.1vw,30px)] bg-ink p-[3.5%] shadow-[0_24px_40px_-18px_color-mix(in_srgb,var(--color-ink)_45%,transparent)]">
              <span aria-hidden className="absolute top-[19%] -left-[2px] h-[7%] w-[3px] rounded-l-sm bg-ink" />
              <span aria-hidden className="absolute top-[29%] -left-[2px] h-[11%] w-[3px] rounded-l-sm bg-ink" />
              <span aria-hidden className="absolute top-[25%] -right-[2px] h-[14%] w-[3px] rounded-r-sm bg-ink" />
              <div className="relative aspect-[393/852] overflow-hidden rounded-[clamp(11px,1.7vw,26px)] bg-ink-3">
                <div className="in-screen absolute inset-0" style={at(T_LID + 1500)}>
                  <Image src={p.mobile.src} alt={p.mobile.alt} fill sizes="(min-width: 760px) 12vw, 22vw" className="object-cover object-top" />
                </div>
                <span aria-hidden className="absolute top-[1.8%] left-1/2 h-[3.6%] w-[31%] -translate-x-1/2 rounded-full bg-ink" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controles: flechas para pasar a mano e indicadores (la barra activa se llena mientras dura la captura) */}
      {shots.length > 1 && (
        <div className="in-rise mt-5 flex items-center gap-2" style={at(T_LID + 1300)}>
          {shots.map((s, k) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setShot(k)}
              aria-label={`Captura ${k + 1} de ${shots.length}: ${s.alt}`}
              aria-current={k === shot}
              className="relative h-6 w-[clamp(28px,3vw,44px)] cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-line-2">
                <span
                  key={k === shot ? `${shot}-${running}` : "off"}
                  className={`absolute inset-0 origin-left rounded-full bg-orange motion-reduce:animate-none motion-reduce:scale-x-100 ${k === shot ? (running ? "animate-[shot-fill_linear_both]" : "scale-x-100") : "scale-x-0"}`}
                  style={k === shot && running ? { animationDuration: `${SHOT_MS}ms` } : undefined}
                />
              </span>
            </button>
          ))}
          <span className="mr-1 ml-auto font-mono text-xs font-medium text-muted tabular-nums">
            {String(shot + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
          </span>
          <Arrow dir={-1} onClick={() => go(-1)} />
          <Arrow dir={1} onClick={() => go(1)} />
        </div>
      )}
    </div>
  );
}

/** Flecha larga de línea fina para pasar las capturas a mano: en hover se pone naranja y avanza hacia su lado. */
function Arrow({ dir, onClick }: { dir: -1 | 1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir < 0 ? "Captura anterior" : "Captura siguiente"}
      className="group grid h-9 w-11 place-items-center text-ink transition-colors duration-300 hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
    >
      <ArrowIcon
        long
        className={`w-7 transition-transform duration-450 ease-snap ${dir < 0 ? "-scale-x-100 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
      />
    </button>
  );
}

/** Flecha hacia la derecha en SVG (centrada de verdad, a diferencia del carácter "→" de la tipografía mono). */
function ArrowIcon({ long = false, className = "" }: { long?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={long ? "0 0 28 12" : "0 0 14 12"}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`block ${className}`}
    >
      <path d={long ? "M1 6H27M22 1L27 6L22 11" : "M1 6H13M8 1L13 6L8 11"} />
    </svg>
  );
}
