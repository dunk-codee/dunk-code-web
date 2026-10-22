import { CHANNELS } from "@/lib/content";
import { ContactForm } from "./contact-form";
import { SpinBall } from "./spin-ball";

export function Contact() {
  return (
    <section
      id="contacto"
      className="relative z-[2] overflow-hidden bg-ink px-gutter pt-[clamp(90px,11vw,160px)] pb-[clamp(60px,8vw,100px)] text-paper"
    >
      <SpinBall className="-bottom-[calc(clamp(220px,26vw,420px)*0.5)] -left-[calc(clamp(220px,26vw,420px)*0.5)] size-[clamp(220px,26vw,420px)]" />
      <div className="relative mx-auto max-w-[1240px]">
        <div data-reveal="0" className="eyebrow mb-6 text-orange">04 {"// contacto"}</div>
        <h2
          data-reveal="1"
          className="m-0 max-w-[1100px] text-[clamp(44px,7.6vw,124px)] leading-[.93] font-bold tracking-[-0.055em] text-balance"
        >
          ¿Tenés un proyecto en mente?
        </h2>
        <div className="mt-[clamp(56px,7vw,96px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-[clamp(48px,7vw,120px)]">
          <div data-reveal="0">
            <ContactForm />
          </div>
          <div data-reveal="1" className="flex flex-col">
            {CHANNELS.map((c) => (
              <a
                key={c.k}
                href={c.href}
                className="flex items-center justify-between gap-4 border-t border-ink-2 py-6 text-paper transition-[padding,color] duration-350 ease-snap hover:pl-3 hover:text-orange"
              >
                <span className="flex flex-col gap-1.5">
                  <span className="label-mono text-subtle">{c.k}</span>
                  <span className="text-[clamp(20px,2vw,26px)] font-medium tracking-[-0.02em]">{c.v}</span>
                </span>
                <span aria-hidden className="font-mono text-xl">↗</span>
              </a>
            ))}
            <div className="border-t border-ink-2" />
          </div>
        </div>
      </div>
    </section>
  );
}
