"use client";

import { useRef, useState } from "react";
import { SERVICES } from "@/lib/content";
import { at } from "@/lib/motion";
import { Burst } from "./burst";
import { InView } from "./in-view";

/** Momento (ms) en que entra cada fila; los botones estallan cuando terminó la cascada. */
const ROW = (i: number) => 100 + i * 160;
const BUTTON = (i: number) => ROW(SERVICES.length) + 100 + i * 140;

export function Services() {
  const [open, setOpen] = useState(-1); // arrancan todos cerrados
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Con mouse se abren al pasar por encima (con un pequeño retraso, para no abrir las que se cruzan de paso);
  // queda abierta la última hasta que se pasa por otra. Con touch o teclado siguen abriendo con clic.
  const hoverOpen = (i: number) => {
    if (!matchMedia("(hover: hover)").matches) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(i), 120);
  };

  return (
    <section id="servicios" className="relative z-[2] bg-paper px-gutter py-[clamp(90px,11vw,160px)]">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[clamp(40px,5vw,72px)] flex flex-wrap items-end justify-between gap-6">
          <div data-reveal="0">
            <div className="eyebrow mb-5 text-orange-deep">02 {"// qué hacemos"}</div>
            <h2 className="m-0 text-[clamp(44px,6.4vw,96px)] leading-[.95] font-bold tracking-[-0.05em]">Lo que hacemos</h2>
          </div>
          <p data-reveal="1" className="m-0 max-w-[380px] text-[17px] leading-[1.55] text-pretty text-muted">
            Cada proyecto arranca con una charla para entender cómo trabaja tu negocio. Después diseñamos, programamos y
            lo dejamos andando.
          </p>
        </div>

        {/* Filas en cascada (línea que se dibuja + contenido desde la derecha); después estallan los botones. */}
        <InView className="relative" amount={0.25}>
          <div onMouseLeave={() => clearTimeout(hoverTimer.current)}>
            {SERVICES.map((s, i) => {
              const isOpen = open === i;
              return (
                <div key={s.n} className="relative" onMouseEnter={() => hoverOpen(i)}>
                  <span aria-hidden className="in-line absolute inset-x-0 top-0 h-px origin-left bg-line" style={at(ROW(i))} />
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`svc-${s.n}`}
                    className="group grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[clamp(16px,3vw,56px)] py-[clamp(22px,3vw,38px)] text-left text-ink transition-[padding] duration-350 ease-snap hover:pl-3.5"
                  >
                    <span className="in-item font-mono text-[13px] font-medium text-orange-deep" style={at(ROW(i) + 80)}>
                      {s.n}
                    </span>
                    <span className="in-item text-[clamp(26px,3.8vw,56px)] leading-[1.05] font-medium tracking-[-0.035em]" style={at(ROW(i) + 140)}>
                      {s.t}
                    </span>
                    {/* Un "+" de dos trazos finos: al abrir gira media vuelta y el vertical se recoge (queda un menos naranja). */}
                    <Burst at={BUTTON(i)} w={36} h={36} tone="light">
                      <span
                        aria-hidden
                        className={`relative grid size-9 place-items-center transition-transform duration-600 ease-snap ${isOpen ? "rotate-180" : ""}`}
                      >
                        <span
                          className={`absolute h-0.5 w-7 rounded-full transition-colors duration-350 ${isOpen ? "bg-orange" : "bg-ink group-hover:bg-orange"}`}
                        />
                        <span
                          className={`absolute h-7 w-0.5 rounded-full transition-[scale,background-color] duration-450 ease-snap ${isOpen ? "scale-y-0 bg-orange" : "bg-ink group-hover:bg-orange"}`}
                        />
                      </span>
                    </Burst>
                  </button>
                  <div
                    id={`svc-${s.n}`}
                    className={`grid transition-[grid-template-rows] duration-550 ease-snap ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="min-h-0 overflow-hidden" inert={!isOpen}>
                      <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-5 pb-[clamp(26px,3vw,40px)] pl-[clamp(40px,5.2vw,86px)]">
                        <p className="m-0 max-w-[560px] text-lg leading-[1.55] text-pretty text-ink-2">{s.d}</p>
                        <div className="flex flex-wrap gap-2">
                          {s.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-2 rounded-full bg-sand px-3 py-2 font-mono text-xs font-medium text-ink-2"
                            >
                              <span aria-hidden className="size-1.5 rounded-full bg-orange" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <span aria-hidden className="in-line absolute inset-x-0 bottom-0 h-px origin-left bg-line" style={at(ROW(SERVICES.length))} />
        </InView>
      </div>
    </section>
  );
}
