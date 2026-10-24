"use client";

import Image from "next/image";
import { useState } from "react";
import { DEMOS, type Demo } from "@/lib/content";
import { ProjectModal } from "./project-modal";

const LIST = new Intl.ListFormat("es", { type: "conjunction" });

/** Precarga el formulario de contacto con la demo elegida y baja hasta él. */
function wantOne(d: Demo) {
  const msg = `Hola, vi la demo de ${d.name} (${d.rubro.toLowerCase()}) y me interesa algo así para mi negocio.`;
  dispatchEvent(new CustomEvent("contact:prefill", { detail: { tipo: "Sitio web", msg } }));
  document.getElementById("contacto")?.scrollIntoView();
}

export function Demos() {
  const [sel, setSel] = useState<number | null>(null);
  const demo = sel === null ? null : DEMOS[sel];

  return (
    <section id="demos" className="relative z-[2] bg-paper px-gutter py-[clamp(90px,11vw,160px)]">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[clamp(40px,5vw,64px)] flex flex-wrap items-end justify-between gap-6">
          <div data-reveal="0">
            <div className="eyebrow mb-5 text-orange-deep">04 {"// demos"}</div>
            {/* El contador va en línea (no flex) y pegado a "rubro", para que pasen juntos de renglón. */}
            <h2 className="m-0 text-[clamp(44px,6.4vw,96px)] leading-[.95] font-bold tracking-[-0.05em]">
              Demos por{" "}
              <span className="whitespace-nowrap">
                rubro
                <span className="ml-3 inline-block align-top font-mono text-sm font-medium tracking-normal text-muted">
                  ({String(DEMOS.length).padStart(2, "0")})
                </span>
              </span>
            </h2>
          </div>
          <p data-reveal="1" className="m-0 max-w-[380px] text-[17px] leading-[1.55] text-pretty text-muted">
            Sitios de muestra que armamos para distintos rubros. Probalos funcionando y, si alguno te sirve, lo adaptamos a
            tu negocio.
          </p>
        </div>

        {/* La primera demo ocupa todo el ancho; el resto va de a dos. */}
        <ul className="m-0 grid list-none gap-[clamp(16px,2vw,28px)] p-0 md:grid-cols-2">
          {DEMOS.map((d, i) => (
            <li key={d.name} data-reveal={i === 0 ? 0 : 2 - (i % 2)} className={i === 0 ? "md:col-span-2" : ""}>
              <DemoCard demo={d} featured={i === 0} onOpen={() => setSel(i)} />
            </li>
          ))}
        </ul>
      </div>

      {demo && (
        <ProjectModal
          key={sel}
          project={{ ...demo, meta: `Demo · ${demo.rubro}`, tags: demo.features }}
          urlLabel="Ver demo"
          nextLabel="Siguiente demo"
          onClose={() => setSel(null)}
          onNext={DEMOS.length > 1 ? () => setSel((s) => ((s ?? 0) + 1) % DEMOS.length) : undefined}
        >
          <button
            type="button"
            onClick={() => {
              setSel(null);
              // Espera a que el modal libere el scroll de la página.
              requestAnimationFrame(() => wantOne(demo));
            }}
            className="h-12 rounded-full border border-ink px-[22px] text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Quiero uno así
          </button>
        </ProjectModal>
      )}
    </section>
  );
}

function DemoCard({ demo: d, featured, onOpen }: { demo: Demo; featured: boolean; onOpen: () => void }) {
  const cover = d.images[0];
  return (
    <article className="group flex h-full flex-col rounded-3xl bg-sand p-3 transition-shadow duration-400 hover:shadow-[0_24px_48px_-24px_rgba(18,18,18,.35)]">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver capturas de ${d.name}`}
        className={`relative block w-full overflow-hidden rounded-2xl border border-line bg-paper ${featured ? "aspect-[2/1] md:aspect-[12/5]" : "aspect-[2/1]"}`}
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={featured ? "(min-width: 1264px) 1216px, 100vw" : "(min-width: 1264px) 600px, (min-width: 760px) 50vw, 100vw"}
          className="object-cover object-top transition-transform duration-700 ease-snap motion-safe:group-hover:scale-[1.03]"
        />
      </button>
      <div className="flex flex-1 flex-col gap-3 px-[clamp(6px,1vw,14px)] pt-5 pb-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="m-0 text-[clamp(26px,2.6vw,34px)] leading-[1.1] font-medium tracking-[-0.03em]">{d.name}</h3>
          <span className="flex items-center gap-2.5 font-mono text-xs font-medium text-muted">
            <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] tracking-[.08em] text-paper uppercase">Demo</span>
            {d.rubro} · {d.type}
          </span>
        </div>
        <p className="m-0 max-w-[560px] text-base leading-[1.5] text-pretty text-ink-2">{d.pitch}</p>
        {d.also && (
          <p className="m-0 font-mono text-xs leading-[1.6] text-muted">
            También para {LIST.format(d.also.map((a) => a.toLowerCase()))}.
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-2.5 pt-3">
          <a
            href={d.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center rounded-full bg-ink px-5 text-[15px] font-medium text-paper hover:bg-ink-2"
          >
            Ver demo ↗
          </a>
          <button
            type="button"
            onClick={() => wantOne(d)}
            className="h-11 rounded-full border border-ink px-5 text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Quiero uno así →
          </button>
        </div>
      </div>
    </article>
  );
}
