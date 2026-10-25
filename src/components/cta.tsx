import type { ReactNode } from "react";

type Icon = "right" | "up-right" | "long";

/** Flechas en SVG (centradas de verdad, a diferencia de los caracteres "→"/"↗" de la tipografía mono). */
export function ArrowIcon({ kind = "right", className = "" }: { kind?: Icon; className?: string }) {
  const svg = {
    right: { box: "0 0 14 12", d: "M1 6H13M8 1L13 6L8 11" },
    "up-right": { box: "0 0 12 12", d: "M2 10L10 2M3.5 2H10V8.5" },
    long: { box: "0 0 28 12", d: "M1 6H27M22 1L27 6L22 11" },
  }[kind];
  return (
    <svg
      aria-hidden
      viewBox={svg.box}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`block ${className}`}
    >
      <path d={svg.d} />
    </svg>
  );
}

/** Globo de internet: va adelante de los botones que llevan al sitio en vivo. En hover (dentro de un `group`) gira apenas. */
export function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      className={`block transition-transform duration-600 ease-snap group-hover:rotate-[25deg] ${className}`}
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M1.5 8H14.5M8 1.5C6.2 3.4 5.3 5.6 5.3 8S6.2 12.6 8 14.5M8 1.5C9.8 3.4 10.7 5.6 10.7 8S9.8 12.6 8 14.5" />
    </svg>
  );
}

const nudge: Record<Icon, string> = {
  right: "group-hover:translate-x-0.5",
  "up-right": "group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
  long: "group-hover:translate-x-1",
};

/** `globe`: link al sitio en vivo; lleva el globo adelante en lugar de la flecha. */
type Action = { href?: string; onClick?: () => void; children: ReactNode; icon?: Icon; globe?: boolean; className?: string };

/** `<a>` si hay `href` (siempre externo: abre en otra pestaña), si no `<button>`. */
function Clickable({ href, onClick, className, children }: { href?: string; onClick?: () => void; className: string; children: ReactNode }) {
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

/**
 * Acción principal: texto en negrita subrayado con la flecha en un círculo naranja.
 * En hover la línea se llena de naranja, el círculo crece apenas y la flecha avanza.
 */
export function PrimaryCta({ href, onClick, children, icon = "right", className = "" }: Action) {
  return (
    <Clickable
      href={href}
      onClick={onClick}
      className={`group relative inline-flex items-center gap-3 pb-2 text-[clamp(19px,1.6vw,22px)] leading-none font-bold tracking-[-0.03em] text-ink focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-orange ${className}`}
    >
      {children}
      <span aria-hidden className="grid size-8 place-items-center rounded-full bg-orange text-ink transition-transform duration-500 ease-snap group-hover:scale-105">
        <ArrowIcon kind={icon} className={`${icon === "up-right" ? "w-3" : "w-3.5"} transition-transform duration-500 ease-snap ${nudge[icon]}`} />
      </span>
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-line-2" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-orange transition-transform duration-600 ease-snap group-hover:scale-x-100" />
    </Clickable>
  );
}

/** Acción secundaria: texto mono con flecha, que se pone naranja y avanza en hover. */
export function TextCta({ href, onClick, children, icon = "up-right", globe = false, className = "" }: Action) {
  return (
    <Clickable
      href={href}
      onClick={onClick}
      className={`group inline-flex items-center gap-2 font-mono text-[13px] font-medium text-ink-2 transition-colors duration-250 hover:text-orange-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange ${className}`}
    >
      {globe && <GlobeIcon className="w-3.5" />}
      {children}
      {!globe && (
        <ArrowIcon
          kind={icon}
          className={`${icon === "long" ? "w-6" : icon === "up-right" ? "w-2.5" : "w-3"} transition-transform duration-450 ease-snap ${nudge[icon]}`}
        />
      )}
    </Clickable>
  );
}

/**
 * Píldora con el efecto de "Hablemos" del nav: en hover sube un relleno naranja de borde curvo desde abajo.
 * `solid` (tinta) para la acción principal, `outline` (borde) para las demás. Se usa en el modal de proyectos y demos.
 */
export function PillCta({
  href,
  onClick,
  children,
  icon,
  globe = false,
  variant = "solid",
}: Omit<Action, "className" | "icon"> & { icon?: "right" | "up-right"; variant?: "solid" | "outline" }) {
  return (
    <Clickable
      href={href}
      onClick={onClick}
      className={`group relative isolate inline-flex h-12 items-center gap-2.5 overflow-hidden rounded-full px-[22px] text-[15px] font-medium transition-colors duration-450 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange ${
        variant === "solid" ? "bg-ink text-paper" : "border border-ink text-ink hover:border-orange"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-full -z-10 h-[160%] rounded-t-[50%] bg-orange transition-transform duration-500 ease-snap group-hover:-translate-y-full"
      />
      {globe && <GlobeIcon className="w-4" />}
      {children}
      {icon && <ArrowIcon kind={icon} className={`${icon === "up-right" ? "w-2.5" : "w-3"} transition-transform duration-450 ease-snap ${nudge[icon]}`} />}
    </Clickable>
  );
}
