"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/lib/content";
import { useBodyLock, useEscape, useScrollFrame } from "@/lib/hooks";

export function SiteHeader() {
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useScrollFrame(() => {
    let act = "";
    for (const { id } of NAV) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top < innerHeight * 0.45) act = id;
    }
    setActive(act);
  });
  useBodyLock(menuOpen);
  useEscape(() => setMenuOpen(false));

  // The overlay is mobile-only; close it if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 47.5rem)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-3.5 z-50 flex justify-center px-3.5">
        <nav className="pointer-events-auto flex w-full max-w-[1240px] items-center justify-between gap-4 rounded-full border border-line bg-paper/85 py-2 pr-2 pl-[22px] backdrop-blur-[14px]">
          <a href="#inicio" aria-label="Dunk Code, ir al inicio" className="flex items-baseline text-[22px] leading-none text-ink">
            <span className="font-medium tracking-[-0.045em]">dunk</span>
            <span className="mx-[.07em] ml-[.05em] inline-block size-[.3em] rounded-full bg-orange" />
            <span className="font-mono text-[.9em] tracking-[-0.05em]">code</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active === id ? "location" : undefined}
                className="flex items-center gap-2 rounded-full px-3.5 py-2.5 font-mono text-[13px] leading-none font-medium text-ink transition-colors duration-200 hover:bg-sand"
              >
                <span
                  className={`size-[7px] rounded-full bg-orange transition-[opacity,transform] duration-300 ${active === id ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                />
                {label}
              </a>
            ))}
            <a
              href="#contacto"
              className="ml-2 flex h-[42px] items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors duration-200 hover:bg-ink-2"
            >
              Hablemos
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="h-[42px] rounded-full bg-ink px-[18px] font-mono text-[13px] font-medium text-paper md:hidden"
          >
            {menuOpen ? "Cerrar" : "Menú"}
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-45 flex animate-fade flex-col justify-center gap-1.5 bg-ink p-8 text-paper md:hidden"
        >
          {NAV.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="text-[52px] leading-[1.1] font-bold tracking-[-0.045em] hover:text-orange"
            >
              {label}
            </a>
          ))}
          <div className="mt-8 font-mono text-[13px] font-medium text-subtle">{"// software a medida"}</div>
        </div>
      )}
    </>
  );
}
