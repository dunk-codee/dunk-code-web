"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/content";

export function Services() {
  const [open, setOpen] = useState(0);

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

        <div className="border-b border-line">
          {SERVICES.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={s.n} data-reveal={i} className="border-t border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={`svc-${s.n}`}
                  className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[clamp(16px,3vw,56px)] py-[clamp(22px,3vw,38px)] text-left text-ink transition-[padding] duration-350 ease-snap hover:pl-3.5"
                >
                  <span className="font-mono text-[13px] font-medium text-orange-deep">{s.n}</span>
                  <span className="text-[clamp(26px,3.8vw,56px)] leading-[1.05] font-medium tracking-[-0.035em]">{s.t}</span>
                  <span
                    aria-hidden
                    className={`grid size-12 place-items-center rounded-full border border-ink font-mono text-2xl leading-none transition-[transform,background-color,color] duration-450 ease-snap ${isOpen ? "rotate-45 bg-ink text-paper" : "text-ink"}`}
                  >
                    +
                  </span>
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
                          <span key={tag} className="rounded-full bg-sand px-3 py-2 font-mono text-xs font-medium text-ink-2">
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
      </div>
    </section>
  );
}
