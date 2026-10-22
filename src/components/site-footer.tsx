import { FooterBall } from "./footer-ball";

export function SiteFooter() {
  return (
    <footer className="relative z-[2] border-t border-ink-2 bg-ink px-gutter pb-7 text-paper">
      <div
        aria-label="Dunk Code"
        className="flex items-baseline justify-center py-[clamp(40px,6vw,90px)] pb-[clamp(24px,3vw,40px)] text-[clamp(60px,16vw,290px)] leading-none"
      >
        <span className="font-medium tracking-[-0.06em]">dunk</span>
        <FooterBall />
        <span className="font-mono text-[.9em] font-normal tracking-[-0.07em]">code</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink-2 pt-5 font-mono text-xs font-medium text-subtle">
        <span>© 2026 Dunk Code</span>
        <span>{"// software a medida"}</span>
        <a href="#inicio" className="text-paper hover:text-orange">
          Volver arriba ↑
        </a>
      </div>
    </footer>
  );
}
