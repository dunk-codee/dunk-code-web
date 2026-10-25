import { NAV } from "@/lib/content";
import { FooterBall } from "./footer-ball";
import { OverscrollColor } from "./overscroll-color";

export function SiteFooter() {
  return (
    <footer className="relative z-[2] border-t border-ink-2 bg-ink px-gutter pb-7 text-paper">
      <OverscrollColor />
      <div
        aria-label="Dunk Code"
        className="flex items-baseline justify-center py-[clamp(40px,6vw,90px)] pb-[clamp(24px,3vw,40px)] text-[clamp(60px,16vw,290px)] leading-none"
      >
        <span className="font-medium tracking-[-0.06em]">dunk</span>
        <FooterBall />
        <span className="font-mono text-[.9em] font-normal tracking-[-0.07em]">code</span>
      </div>
      {/* Tres columnas en escritorio (links al centro, sin cortarse); apilado en mobile, con los links en grilla pareja. */}
      <div className="flex flex-col gap-5 border-t border-ink-2 pt-5 font-mono text-xs font-medium text-subtle lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
        <span className="order-2 lg:order-none">
          © 2026 Dunk Code <span className="ml-2">{"// software a medida"}</span>
        </span>
        <nav aria-label="Secciones" className="order-1 lg:order-none">
          <ul className="m-0 grid list-none grid-cols-3 gap-x-6 gap-y-3 p-0 sm:flex sm:flex-nowrap">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <a href={`#${id}`} className="text-paper transition-colors duration-250 hover:text-orange">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#inicio" className="order-3 text-paper hover:text-orange lg:order-none lg:justify-self-end">
          Volver arriba ↑
        </a>
      </div>
    </footer>
  );
}
