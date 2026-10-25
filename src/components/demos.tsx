"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DEMOS, type Demo } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/hooks";
import { at } from "@/lib/motion";
import { GlobeIcon, PillCta, PrimaryCta, TextCta } from "./cta";
import { InView } from "./in-view";
import { ProjectModal } from "./project-modal";

const LIST = new Intl.ListFormat("es", { type: "conjunction" });

/** Cada cuánto cambia la captura del visor (ms). */
const SHOT_MS = 3600;

/** Precarga el formulario de contacto con la demo elegida y baja hasta él. */
function wantOne(d: Demo) {
  const msg = `Hola, vi la demo de ${d.name} (${d.rubro.toLowerCase()}) y me interesa algo así para mi negocio.`;
  dispatchEvent(new CustomEvent("contact:prefill", { detail: { tipo: "Sitio web", msg } }));
  document.getElementById("contacto")?.scrollIntoView();
}

/**
 * Demos como un selector "¿Qué negocio tenés?": a la izquierda los rubros (en mobile, píldoras que se
 * deslizan de costado) y a la derecha un solo visor con forma de navegador para la demo elegida, con sus
 * capturas rotando. Así la sección mide lo que una tarjeta, no cinco.
 */
export function Demos() {
  const [active, setActive] = useState(0);
  const [modal, setModal] = useState<number | null>(null);
  const d = DEMOS[active];

  return (
    <section id="demos" className="relative z-[2] bg-paper px-gutter py-[clamp(90px,11vw,160px)]">
      <div className="mx-auto max-w-[1240px]">
        <InView amount={0.5} className="mb-[clamp(40px,5vw,72px)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="in-rise eyebrow mb-5 text-orange-deep">04 {"// demos"}</div>
            <h2 className="m-0 text-[clamp(44px,6.4vw,96px)] leading-[.95] font-bold tracking-[-0.05em]">
              {["Demos", "por", "rubro"].map((w, i) => (
                <span key={w}>
                  <span className="-mx-[.08em] -my-[.12em] inline-block overflow-clip px-[.08em] py-[.12em] align-top">
                    <span className="in-word inline-block" style={at(120 + i * 90)}>
                      {w}
                    </span>
                  </span>{" "}
                </span>
              ))}
            </h2>
          </div>
          <p className="in-rise m-0 max-w-[380px] text-[17px] leading-[1.55] text-pretty text-muted" style={at(350)}>
            Sitios de muestra que armamos para distintos rubros. Probalos funcionando y, si alguno te sirve, lo adaptamos a
            tu negocio.
          </p>
        </InView>

        <InView amount={0.2} className="grid grid-cols-[minmax(0,1fr)] items-start gap-[clamp(28px,4vw,72px)] md:grid-cols-[minmax(0,.75fr)_minmax(0,1.6fr)]">
          {/* Rubros */}
          <div>
            <div className="in-rise mb-4 font-mono text-[13px] font-medium text-muted md:mb-2" style={at(0)}>
              {"// ¿qué negocio tenés?"}
            </div>

            {/* Mobile: pestañas de texto que se deslizan de costado, con la barra naranja debajo de la elegida */}
            <RubroTabs active={active} onPick={setActive} />

            {/* Escritorio: filas grandes que cambian con clic (no con hover); la elegida con el punto naranja */}
            <ul role="group" aria-label="Elegí un rubro" className="m-0 hidden list-none p-0 md:block">
              {DEMOS.map((x, i) => {
                const on = active === i;
                return (
                  <li key={x.name} className="relative">
                    <span aria-hidden className="in-line absolute inset-x-0 top-0 h-px origin-left bg-line" style={at(80 + i * 90)} />
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActive(i)}
                      className="in-item group flex w-full items-center gap-4 py-[clamp(14px,1.6vw,22px)] text-left"
                      style={at(140 + i * 90)}
                    >
                      <span
                        aria-hidden
                        className={`size-2.5 shrink-0 rounded-full bg-orange transition-[scale,opacity] duration-450 ease-snap ${on ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                      />
                      <span className={`flex min-w-0 flex-col gap-1 transition-[translate] duration-450 ease-snap ${on ? "" : "-translate-x-6.5"}`}>
                        <span
                          className={`text-[clamp(22px,2.2vw,32px)] leading-[1.1] font-medium tracking-[-0.03em] transition-colors duration-300 ${on ? "text-ink" : "text-muted group-hover:text-ink"}`}
                        >
                          {x.rubro}
                        </span>
                        <span className="font-mono text-xs font-medium text-subtle">
                          {x.name} · {x.type}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
              <span aria-hidden className="in-line block h-px origin-left bg-line" style={at(80 + DEMOS.length * 90)} />
            </ul>
          </div>

          {/* Visor de la demo elegida */}
          <div className="in-rise" style={at(250)}>
            <Viewer demo={d} onZoom={() => setModal(active)} />
            {/* Detalle: entra de nuevo cada vez que cambia el rubro */}
            <div key={d.name} className="mt-[clamp(22px,2.6vw,34px)] flex animate-[hero-fade_.6s_var(--ease-snap)_both] flex-col gap-4 motion-reduce:animate-none">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h3 className="m-0 text-[clamp(28px,2.8vw,40px)] leading-[1.05] font-bold tracking-[-0.04em]">{d.name}</h3>
                <span className="flex items-center gap-2.5 font-mono text-xs font-medium text-muted">
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] tracking-[.08em] text-paper uppercase">Demo</span>
                  {d.type}
                </span>
              </div>
              <p className="m-0 max-w-[600px] text-[clamp(17px,1.4vw,19px)] leading-[1.5] text-pretty text-ink-2">{d.pitch}</p>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {d.features.map((f) => (
                  <li key={f} className="inline-flex items-center gap-2 rounded-full bg-sand px-3 py-2 font-mono text-xs font-medium text-ink-2">
                    <span aria-hidden className="size-1.5 rounded-full bg-orange" />
                    {f}
                  </li>
                ))}
              </ul>
              {d.also && (
                <p className="m-0 font-mono text-xs leading-[1.6] text-muted">
                  También sirve para {LIST.format(d.also.map((a) => a.toLowerCase()))}.
                </p>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-x-8 gap-y-4">
                <PrimaryCta onClick={() => wantOne(d)}>Quiero uno así</PrimaryCta>
                <TextCta href={d.url} globe>
                  Ver en vivo
                </TextCta>
              </div>
            </div>
          </div>
        </InView>
      </div>

      {modal !== null && (
        <ProjectModal
          key={modal}
          project={{ ...DEMOS[modal], meta: `Demo · ${DEMOS[modal].rubro}`, tags: DEMOS[modal].features }}
          urlLabel="Ver sitio en vivo"
          nextLabel="Siguiente demo"
          onClose={() => setModal(null)}
          onNext={DEMOS.length > 1 ? () => setModal((s) => ((s ?? 0) + 1) % DEMOS.length) : undefined}
        >
          <PillCta
            icon="right"
            onClick={() => {
              const demo = DEMOS[modal];
              setModal(null);
              // Espera a que el modal libere el scroll de la página.
              requestAnimationFrame(() => wantOne(demo));
            }}
          >
            Quiero uno así
          </PillCta>
        </ProjectModal>
      )}
    </section>
  );
}

/**
 * Ventana de navegador con la dirección real de la demo y sus capturas rotando (fundido + leve zoom,
 * indicadores que se llenan). Al cambiar de demo vuelve a la primera captura. Rota solo mientras se ve.
 * Tocar la pantalla abre las capturas en grande.
 */
function Viewer({ demo: d, onZoom }: { demo: Demo; onZoom: () => void }) {
  const [shot, setShot] = useState(0);
  const [shown, setShown] = useState(d.name);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cambió la demo: arranca desde la portada (ajuste durante el render, sin efecto).
  if (shown !== d.name) {
    setShown(d.name);
    setShot(0);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && d.images.length > 1;
  useEffect(() => {
    if (!running || prefersReducedMotion()) return;
    const id = setTimeout(() => setShot((s) => (s + 1) % d.images.length), SHOT_MS);
    return () => clearTimeout(id);
  }, [running, shot, d.images.length]);

  const host = new URL(d.url).host;

  return (
    <div ref={ref}>
      {/* Con el mouse sobre la pantalla, el visor se resalta (solo el borde naranja): se puede tocar para verla en detalle. */}
      <div className="overflow-hidden rounded-[clamp(12px,1.4vw,18px)] border border-line bg-sand shadow-[0_18px_36px_-30px_color-mix(in_srgb,var(--color-ink)_30%,transparent)] transition-[border-color] duration-400 has-[[data-screen]:hover]:border-orange">
        {/* Barra del navegador */}
        <div className="flex items-center gap-3 border-b border-line px-[clamp(10px,1.2vw,16px)] py-[clamp(8px,.9vw,11px)]">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-orange" />
            <span className="size-2.5 rounded-full bg-line-2" />
            <span className="size-2.5 rounded-full bg-line-2" />
          </span>
          <a
            href={d.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-0 flex-1 items-center justify-center truncate rounded-full bg-paper px-3 py-1 font-mono text-[11px] font-medium text-muted transition-colors duration-250 hover:text-ink"
          >
            <GlobeIcon className="mr-1.5 w-3 shrink-0" />
            <span className="truncate">{host}</span>
          </a>
          <span aria-hidden className="w-[46px]" />
        </div>
        {/* Pantalla */}
        <button
          type="button"
          data-screen
          onClick={onZoom}
          aria-label={`Ver las capturas de ${d.name} en grande`}
          className="group/screen relative block aspect-[2/1] w-full cursor-pointer overflow-hidden bg-paper"
        >
          <span
            key={d.name}
            className="absolute inset-0 animate-[fade_.5s_both] transition-[scale] duration-700 ease-snap group-hover/screen:scale-[1.025] motion-reduce:animate-none"
          >
            {d.images.map((s, k) => (
              <Image
                key={s.src}
                src={s.src}
                alt={s.alt}
                fill
                sizes="(min-width: 1264px) 760px, (min-width: 760px) 60vw, 100vw"
                aria-hidden={k !== shot}
                className={`object-cover object-top transition-[opacity,scale] duration-[1100ms] ease-snap ${k === shot ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
              />
            ))}
          </span>
          {/* Aviso de que se abre en grande (con mouse encima o foco de teclado) */}
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors duration-400 group-hover/screen:bg-ink/15 group-focus-visible/screen:bg-ink/15"
          >
            <span className="flex translate-y-2 items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-sm font-medium text-ink opacity-0 shadow-[0_8px_22px_-10px_color-mix(in_srgb,var(--color-ink)_50%,transparent)] transition-[opacity,translate] duration-400 ease-snap group-hover/screen:translate-y-0 group-hover/screen:opacity-100 group-focus-visible/screen:translate-y-0 group-focus-visible/screen:opacity-100">
              Ver en detalle
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="block w-3">
                <path d="M7 1.5H10.5V5M5 10.5H1.5V7M10.5 1.5L7 5M1.5 10.5L5 7" />
              </svg>
            </span>
          </span>
        </button>
      </div>

      {/* Indicadores: la barra activa se llena mientras dura la captura */}
      {d.images.length > 1 && (
        <div className="mt-4 flex gap-2">
          {d.images.map((s, k) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setShot(k)}
              aria-label={`Captura ${k + 1} de ${d.images.length}: ${s.alt}`}
              aria-current={k === shot}
              className="relative h-6 w-[clamp(28px,3vw,44px)] cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-line">
                <span
                  key={k === shot ? `${d.name}-${shot}-${running}` : "off"}
                  className={`absolute inset-0 origin-left rounded-full bg-orange motion-reduce:animate-none motion-reduce:scale-x-100 ${k === shot ? (running ? "animate-[shot-fill_linear_both]" : "scale-x-100") : "scale-x-0"}`}
                  style={k === shot && running ? { animationDuration: `${SHOT_MS}ms` } : undefined}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Rubros en mobile: pestañas de texto con número (sin caja), en una fila que se desliza de costado.
 * La barra naranja se desliza hasta la elegida y la fila se acomoda para mostrarla entera; el degradé
 * del borde derecho avisa que hay más.
 */
function RubroTabs({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const row = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = row.current;
    const b = bar.current;
    const tab = el?.querySelectorAll<HTMLElement>("[data-tab]")[active];
    if (!el || !b || !tab) return;
    b.style.left = `${tab.offsetLeft}px`;
    b.style.width = `${tab.offsetWidth}px`;
    // Centra la pestaña elegida si quedó cortada (sin mover la página, solo la fila).
    const left = tab.offsetLeft - (el.clientWidth - tab.offsetWidth) / 2;
    el.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [active]);

  return (
    <div className="relative -mx-[clamp(20px,4vw,56px)] md:hidden">
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-line" />
      <div
        ref={row}
        role="group"
        aria-label="Elegí un rubro"
        className="relative flex gap-6 overflow-x-auto px-[clamp(20px,4vw,56px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {DEMOS.map((x, i) => {
          const on = active === i;
          return (
            <button
              key={x.name}
              data-tab
              type="button"
              aria-pressed={on}
              onClick={() => onPick(i)}
              className="flex shrink-0 items-baseline gap-1.5 pt-1 pb-3 whitespace-nowrap"
            >
              <span className={`font-mono text-[11px] font-medium transition-colors duration-300 ${on ? "text-orange-deep" : "text-subtle"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-[19px] font-medium tracking-[-0.02em] transition-colors duration-300 ${on ? "text-ink" : "text-muted"}`}>
                {x.rubro}
              </span>
            </button>
          );
        })}
        <span ref={bar} aria-hidden className="absolute bottom-0 left-0 h-0.5 w-0 bg-orange transition-[left,width] duration-500 ease-snap" />
      </div>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-paper to-transparent" />
    </div>
  );
}
