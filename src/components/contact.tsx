import { Fragment } from "react";
import { at } from "@/lib/motion";
import { ContactChannels } from "./contact-channels";
import { ContactForm } from "./contact-form";
import { InView } from "./in-view";

const TITLE = "¿Tenés un proyecto en mente?";

export function Contact() {
  return (
    <section
      id="contacto"
      className="relative z-[2] overflow-hidden bg-ink px-gutter pt-[clamp(90px,11vw,160px)] pb-[clamp(60px,8vw,100px)] text-paper"
    >
      <div className="relative mx-auto max-w-[1240px]">
        <InView amount={0.5}>
          <div className="in-rise eyebrow mb-6 text-orange">04 {"// contacto"}</div>
          <h2 className="m-0 max-w-[1100px] text-[clamp(44px,7.6vw,124px)] leading-[.93] font-bold tracking-[-0.055em] text-balance">
            <span className="sr-only">{TITLE}</span>
            {/* Cada palabra sube desde atrás de una máscara, girando y enfocándose. */}
            <span aria-hidden>
              {TITLE.split(" ").map((w, i) => (
                <Fragment key={i}>
                  <span className="-mb-[.12em] inline-block overflow-clip pb-[.12em] align-top">
                    <span className="in-word inline-block" style={at(120 + i * 90)}>
                      {w}
                    </span>
                  </span>{" "}
                </Fragment>
              ))}
            </span>
          </h2>
        </InView>
        <div className="mt-[clamp(56px,7vw,96px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-[clamp(48px,7vw,120px)]">
          <InView>
            <ContactForm />
          </InView>
          <InView className="flex flex-col">
            <ContactChannels />
          </InView>
        </div>
      </div>
    </section>
  );
}
