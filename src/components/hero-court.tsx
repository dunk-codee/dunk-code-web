import type { Ref } from "react";
import { afterIntro } from "./intro";

// Media cancha FIBA en centímetros: 15 m de ancho, 14 m hasta la mitad; línea de fondo arriba.
// Cada trazo con su orden de dibujo (el aro y el tablero primero, la cancha hacia afuera).
const LINES: { d: string; at: number; accent?: boolean }[] = [
  { d: "M660 120H840", at: 0 }, // tablero
  { d: "M727.5 157.5a22.5 22.5 0 1 0 45 0a22.5 22.5 0 1 0 -45 0", at: 80, accent: true }, // aro
  { d: "M625 120V157.5A125 125 0 0 0 875 157.5V120", at: 180 }, // zona restringida
  { d: "M505 0V580H995V0", at: 260 }, // llave
  { d: "M570 580A180 180 0 0 0 930 580A180 180 0 0 0 570 580", at: 380 }, // círculo de libre
  { d: "M90 0V299A675 675 0 0 0 1410 299V0", at: 480 }, // triple
  { d: "M0 0H1500V1400H0Z", at: 620 }, // fondo, laterales y mitad
  { d: "M570 1400A180 180 0 0 1 930 1400", at: 760 }, // círculo central
];

/**
 * Fondo del hero: media cancha de básquet en líneas finas a la derecha, que se traza al cargar
 * (`.court-line`, con stroke-dashoffset) y se funde hacia el título. El hero le aplica un leve parallax.
 */
export function HeroCourt({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-[-6%] -z-10 w-[min(62vw,980px)] [mask-image:linear-gradient(to_right,transparent,black_45%)] will-change-transform max-md:opacity-50"
    >
      <svg viewBox="-20 -20 1540 1440" preserveAspectRatio="xMaxYMin slice" className="size-full overflow-visible">
        {LINES.map(({ d, at, accent }) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            fill="none"
            vectorEffect="non-scaling-stroke"
            strokeWidth={accent ? 2 : 1.25}
            className={`court-line ${accent ? "stroke-orange" : "stroke-line-2"}`}
            style={{ animationDelay: afterIntro(150 + at) }}
          />
        ))}
      </svg>
    </div>
  );
}
