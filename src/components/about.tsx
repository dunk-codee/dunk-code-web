import Image from "next/image";
import { ABOUT, ABOUT_ACCENT, TEAM } from "@/lib/content";
import { at } from "@/lib/motion";
import { AboutWords } from "./about-words";
import { InView } from "./in-view";

export function About() {
  const words = ABOUT.split(" ");
  const accentStart = words.indexOf(ABOUT_ACCENT.split(" ")[0]);
  const accentLen = ABOUT_ACCENT.split(" ").length;

  return (
    <section
      id="nosotros"
      className="relative z-[2] overflow-hidden bg-ink px-gutter pt-[clamp(90px,12vw,170px)] pb-[clamp(80px,10vw,140px)] text-paper"
    >
      <div className="relative mx-auto max-w-[1240px]">
        <InView amount={0.35}>
          <div className="in-rise eyebrow mb-10 text-orange">01 {"// quiénes somos"}</div>
          <AboutWords
            words={words.map((t, i) => ({ t, accent: i >= accentStart && i < accentStart + accentLen }))}
          />
        </InView>

        <div className="group/team mt-[clamp(80px,10vw,140px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-end gap-[clamp(24px,3vw,40px)]">
          <div data-reveal="0" className="flex flex-col gap-[18px] self-start pb-2">
            <div className="eyebrow text-subtle">{"// el equipo"}</div>
            <p className="m-0 max-w-[360px] text-lg leading-[1.55] text-pretty text-line">
              Trabajamos directo con cada cliente: quien te escucha es quien programa. Las decisiones son rápidas y nada
              se pierde en el camino.
            </p>
          </div>
          {TEAM.map((m, i) => {
            const d = i * 180;
            return (
              <InView key={m.name} amount={0.3}>
                {/* Hover: la card sube y se resalta en naranja; la otra se apaga. */}
                <article className="group flex flex-col gap-4 transition-[translate,opacity] duration-500 ease-snap group-has-[article:hover]/team:opacity-45 hover:-translate-y-3 hover:opacity-100!">
                  {/* La card se abre de abajo hacia arriba, un telón naranja sube y la foto se enfoca mientras se aleja. */}
                  <div className="in-clip stripes-dark relative aspect-[4/5] w-full overflow-hidden rounded-[20px] ring-2 ring-transparent transition-[box-shadow] duration-500 ease-snap group-hover:ring-orange" style={at(d)}>
                    <div className="in-zoom absolute inset-0" style={at(d)}>
                      {m.photo ? (
                        <Image
                          src={m.photo}
                          alt={m.name}
                          fill
                          sizes="(min-width: 760px) 33vw, 100vw"
                          className="object-cover transition-[scale] duration-700 ease-snap group-hover:scale-[1.07]"
                        />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center font-mono text-xs text-subtle">
                          {`// foto de ${m.name}`}
                        </span>
                      )}
                    </div>
                    <span aria-hidden className="in-wipe absolute inset-0 hidden origin-top bg-orange" style={at(d + 350)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="in-rise m-0 text-[26px] leading-[1.2] font-medium tracking-[-0.02em] transition-colors duration-350 group-hover:text-orange" style={at(d + 650)}>
                      {m.name}
                    </h3>
                    <div className="in-rise flex flex-wrap items-baseline justify-between gap-3" style={at(d + 750)}>
                      <span className="font-mono text-[13px] font-medium text-subtle">{m.role}</span>
                      {m.linkedin && (
                        <a
                          href={m.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`LinkedIn de ${m.name}`}
                          className="group/in inline-flex items-center gap-2.5 font-mono text-[13px] font-medium text-paper transition-colors duration-250 hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
                        >
                          <span
                            aria-hidden
                            className="grid size-7 place-items-center rounded-md bg-orange font-sans text-sm font-bold text-ink transition-transform duration-350 ease-snap group-hover/in:-rotate-6 group-hover/in:scale-110"
                          >
                            in
                          </span>
                          <span className="relative">
                            LinkedIn
                            <span
                              aria-hidden
                              className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-orange transition-transform duration-350 ease-snap group-hover/in:scale-x-100"
                            />
                          </span>
                          <span aria-hidden className="transition-transform duration-350 ease-snap group-hover/in:translate-x-0.5 group-hover/in:-translate-y-0.5">
                            ↗
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </InView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
