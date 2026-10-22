import { IntroBall } from "./intro-ball";

/** Cuándo empieza a subir el telón (mantener sincronizado con el delay de `.intro` en globals.css). */
export const INTRO_MS = 1500;

// Hilos de la red colgando de la mitad delantera del aro (unidades del viewBox, aro centrado en 170,70).
const NET =
  "M145 70L156 104M195 70L184 104" +
  "M145 70L162 104M155 74.8L156 104M155 74.8L167 104M165 75.9L162 104" +
  "M165 75.9L173 104M175 75.9L167 104M175 75.9L178 104M185 74.8L173 104" +
  "M185 74.8L184 104M195 70L178 104" +
  "M150 87Q170 93 190 87M156 104Q170 107 184 104";

/**
 * Intro de carga: la pelota entra limpia en el aro, sube el telón y la pelota rebota hasta el título del hero.
 * El telón y el aro son CSS puro (clases en globals.css) para que corran antes de hidratar; la pelota vive
 * en una capa encima del telón para poder seguir volando sobre el hero. Se oculta con reduced motion.
 */
export function Intro() {
  return (
    <>
      {/* `hidden` por defecto; globals.css los muestra solo cuando se permite movimiento. */}
      <div aria-hidden className="intro hidden fixed inset-0 z-[100] bg-ink">
        <span className="intro-caption absolute inset-x-0 bottom-8 text-center font-mono text-xs font-medium tracking-[.04em] text-subtle uppercase">
          {"// dunk code"}
        </span>
      </div>

      <div aria-hidden className="intro-layer pointer-events-none hidden fixed inset-0 z-[101] items-center justify-center">
        <div className="relative h-[18em] w-[24em] text-[clamp(11px,2.6vw,20px)]">
          <svg viewBox="0 0 240 180" className="intro-hoop absolute inset-0 size-full overflow-visible">
            <rect x="128" y="12" width="84" height="56" rx="3" className="fill-ink-3 stroke-subtle" strokeWidth="2" />
            <rect x="154" y="40" width="32" height="24" className="fill-none stroke-subtle" strokeWidth="2" />
            <path d="M145 70A25 6 0 0 1 195 70" className="fill-none stroke-subtle" strokeWidth="3.2" strokeLinecap="round" />
          </svg>

          <IntroBall />

          <svg viewBox="0 0 240 180" className="intro-hoop absolute inset-0 size-full overflow-visible">
            <path d={NET} className="intro-net fill-none stroke-line" strokeWidth="1.4" strokeLinecap="round" opacity=".75" />
            <path d="M145 70A25 6 0 0 0 195 70" className="fill-none stroke-paper" strokeWidth="3.2" strokeLinecap="round" />
          </svg>

          <span className="intro-score absolute top-[2.4em] left-[20.6em] font-mono text-[1.3em] font-medium text-orange opacity-0">
            +2
          </span>
        </div>
      </div>
    </>
  );
}
