import Image from "next/image";
import { ABOUT, ABOUT_ACCENT, TEAM } from "@/lib/content";
import { AboutWords } from "./about-words";
import { SpinBall } from "./spin-ball";

export function About() {
  const words = ABOUT.split(" ");
  const accentStart = words.indexOf(ABOUT_ACCENT.split(" ")[0]);
  const accentLen = ABOUT_ACCENT.split(" ").length;

  return (
    <section
      id="nosotros"
      className="relative z-[2] overflow-hidden bg-ink px-gutter pt-[clamp(90px,12vw,170px)] pb-[clamp(80px,10vw,140px)] text-paper"
    >
      <SpinBall className="-top-[calc(clamp(240px,32vw,520px)*0.45)] -right-[calc(clamp(240px,32vw,520px)*0.45)] size-[clamp(240px,32vw,520px)]" />
      <div className="relative mx-auto max-w-[1240px]">
        <div className="eyebrow mb-10 text-orange">01 {"// quiénes somos"}</div>
        <AboutWords
          words={words.map((t, i) => ({ t, accent: i >= accentStart && i < accentStart + accentLen }))}
        />

        <div className="mt-[clamp(80px,10vw,140px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] items-end gap-[clamp(24px,3vw,40px)]">
          <div data-reveal="0" className="flex flex-col gap-[18px] self-start pb-2">
            <div className="eyebrow text-subtle">{"// el equipo"}</div>
            <p className="m-0 max-w-[360px] text-lg leading-[1.55] text-pretty text-line">
              Trabajamos directo con cada cliente: quien te escucha es quien programa. Las decisiones son rápidas y nada
              se pierde en el camino.
            </p>
          </div>
          {TEAM.map((m, i) => (
            <article key={m.name} data-reveal={i + 1} className="flex flex-col gap-4">
              <div className="stripes-dark relative aspect-[4/5] w-full overflow-hidden rounded-[20px]">
                {m.photo ? (
                  <Image src={m.photo} alt={m.name} fill sizes="(min-width: 760px) 33vw, 100vw" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-mono text-xs text-subtle">
                    {`// foto de ${m.name}`}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="m-0 text-[26px] leading-[1.2] font-medium tracking-[-0.02em]">{m.name}</h3>
                <span className="font-mono text-[13px] font-medium text-subtle">{m.role}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
