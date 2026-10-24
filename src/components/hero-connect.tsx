"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/hooks";
import { afterIntro, INTRO_MS } from "./intro";

type Pt = readonly [number, number];
type Curve = readonly [Pt, Pt, Pt, Pt];

// Conexiones (bezier en unidades del viewBox): notebook → local por arriba, celular → local por abajo.
const LINK_LAPTOP: Curve = [[118, 180], [190, 64], [338, 60], [406, 192]];
const LINK_PHONE: Curve = [[214, 240], [280, 160], [350, 162], [406, 246]];

const pathOf = (c: Curve) => `M${c[0]} C${c[1]} ${c[2]} ${c[3]}`;
const dotsOf = (c: Curve, n: number) =>
  Array.from({ length: n }, (_, k) => {
    const t = (k + 0.5) / n;
    const at = (i: 0 | 1) => (1 - t) ** 3 * c[0][i] + 3 * (1 - t) ** 2 * t * c[1][i] + 3 * (1 - t) * t ** 2 * c[2][i] + t ** 3 * c[3][i];
    return [at(0), at(1)] as const;
  });
const DOTS_LAPTOP = dotsOf(LINK_LAPTOP, 18);
const DOTS_PHONE = dotsOf(LINK_PHONE, 11);

// Cartel del local, de donde salen los hilos a los íconos.
const SIGN: Pt = [500, 112];

/** Íconos de lo que el negocio maneja desde el sistema, en globitos en abanico sobre el local. */
const BADGES: { x: number; y: number; label: string; accent?: boolean; icon: ReactNode }[] = [
  { x: 386, y: 70, label: "Gestión", icon: <path d="M-8 7H8M-5 7V1M0 7V-6M5 7V-2" /> },
  { x: 444, y: 28, label: "Precios", accent: true, icon: <path d="M3 -6.5C1.5 -8 -5.5 -8 -5.5 -3.5S5.5 -1 5.5 3.5S-1.5 8 -3.5 6.5M0 -9.5V9.5" /> },
  {
    x: 514,
    y: 16,
    label: "Información",
    icon: (
      <>
        <circle r={9} strokeWidth={1.25} />
        <path d="M0 -1V5M0 -4.5V-4" />
      </>
    ),
  },
  { x: 580, y: 38, label: "Turnos", icon: <path d="M-7 -5H7V7H-7ZM-7 -1H7M-3.5 -8V-3M3.5 -8V-3" /> },
  { x: 626, y: 90, label: "Stock", icon: <path d="M-7.5 -3.5L0 -7.5L7.5 -3.5V4L0 8L-7.5 4ZM-7.5 -3.5L0 0.5L7.5 -3.5M0 0.5V8" /> },
];

// Toldo: 8 franjas alternadas naranja / papel, con festón abajo.
const AWNING = Array.from({ length: 8 }, (_, i) => {
  const x = 410 + i * 22.5;
  return { d: `M${x} 150H${x + 22.5}V174Q${x + 11.25} 187 ${x} 174Z`, orange: i % 2 === 0 };
});

/**
 * Un viaje de ida y vuelta: aparece en el dispositivo, viaja acelerando y frenando, se achica al
 * llegar al local (entrega), vuelve y se apaga en el dispositivo. `radius` es relativo al tamaño del paquete.
 */
const PACKET_MS = 3800;
const TRIP = {
  // tramos: aparece · ida · entrega (se achica) · se recupera · vuelta · se apaga
  times: "0;.07;.43;.5;.57;.93;1",
  points: "0;0;1;1;1;0;0",
  radius: [0, 1, 1, 0.45, 1, 1, 0],
  splines: Array(6).fill(".45 0 .55 1").join(";"), // todos acelerando y frenando
};
/** Paquetes: dos por la línea de la notebook (desfasados, se cruzan) y uno por la del celular. */
const PACKETS = [
  { c: LINK_LAPTOP, r: 5, ink: false, offset: 0 },
  { c: LINK_LAPTOP, r: 3.5, ink: true, offset: 0.5 },
  { c: LINK_PHONE, r: 4.5, ink: false, offset: 0.25 },
];

/** Momentos (ms después del telón) de cada parte. */
const T = { laptop: 200, phone: 420, store: 380, awning: 1000, dots: 1150, packets: 2050, badges: 2100 };
const d = (ms: number): CSSProperties => ({ animationDelay: afterIntro(ms) });

/**
 * Animación a la derecha del título del hero: una notebook y un celular se conectan por líneas de puntos
 * a un local, viajan paquetes y del cartel salen los íconos de lo que se maneja con el sistema.
 * Todo en línea fina; el dibujo es CSS (`.hc-*` en globals.css) y los paquetes son SMIL (`animateMotion`),
 * que JS arranca cuando termina la entrada. Con reduced motion queda el dibujo quieto, sin paquetes.
 */
export function HeroConnect() {
  const packets = useRef<SVGGElement>(null);

  useEffect(() => {
    const g = packets.current;
    if (!g || prefersReducedMotion()) return;
    const seen = document.documentElement.hasAttribute("data-intro-seen");
    const wait = Math.max(0, (seen ? 0 : INTRO_MS) + T.packets - performance.now());
    const timers = [...g.children].map((packet, i) =>
      setTimeout(() => {
        (packet as SVGElement).style.opacity = "1";
        packet.querySelectorAll<SVGAnimationElement>("animateMotion, animate").forEach((m) => m.beginElement());
      }, wait + PACKETS[i].offset * PACKET_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-[clamp(170px,26vh,250px)] right-[clamp(20px,4vw,56px)] hidden w-[min(42vw,660px)] min-[1100px]:block"
    >
      <svg viewBox="0 0 650 310" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-full overflow-visible">
        <path d="M0 300H650" pathLength={1} strokeWidth={1} className="hc-draw stroke-line-2" style={d(0)} />

        {/* Notebook */}
        <g strokeWidth={1.5} className="stroke-ink">
          <rect x={24} y={186} width={150} height={100} rx={8} pathLength={1} className="hc-draw" style={d(T.laptop)} />
          <path d="M8 286H190L182 300H16Z" pathLength={1} className="hc-draw" style={d(T.laptop + 200)} />
          <path d="M86 293H112" pathLength={1} className="hc-draw" style={d(T.laptop + 350)} />
          <g className="stroke-line-2" strokeWidth={1.25}>
            <rect x={34} y={196} width={130} height={80} rx={3} pathLength={1} className="hc-draw" style={d(T.laptop + 250)} />
            <path d="M44 208H96" pathLength={1} className="hc-draw" style={d(T.laptop + 450)} />
            <rect x={44} y={218} width={50} height={48} rx={3} pathLength={1} className="hc-draw" style={d(T.laptop + 500)} />
            <path d="M104 222H146M104 232H140M104 242H146" pathLength={1} className="hc-draw" style={d(T.laptop + 550)} />
          </g>
        </g>
        <rect x={104} y={252} width={36} height={10} rx={5} className="hc-fade fill-orange" style={d(T.laptop + 800)} />

        {/* Celular, apoyado adelante de la notebook */}
        <g strokeWidth={1.5} className="stroke-ink">
          <rect x={152} y={200} width={58} height={100} rx={11} pathLength={1} className="hc-draw fill-paper" style={d(T.phone)} />
          <path d="M172 208H190M175 293H187" pathLength={1} className="hc-draw" style={d(T.phone + 200)} />
          <path d="M162 226H200M162 236H192" pathLength={1} strokeWidth={1.25} className="hc-draw stroke-line-2" style={d(T.phone + 300)} />
        </g>
        <rect x={162} y={272} width={38} height={10} rx={5} className="hc-fade fill-orange" style={d(T.phone + 600)} />

        {/* Local: cartel, cornisa, paredes, vidriera con productos, puerta y maceta */}
        <g strokeWidth={1.5} className="stroke-ink">
          <rect x={448} y={112} width={104} height={24} rx={4} pathLength={1} className="hc-draw" style={d(T.store)} />
          <path d="M470 124H530" pathLength={1} strokeWidth={1.25} className="hc-draw stroke-line-2" style={d(T.store + 300)} />
          <path d="M466 136V150M534 136V150" pathLength={1} strokeWidth={1.25} className="hc-draw" style={d(T.store + 80)} />
          <path d="M402 150H598M414 150V300M586 150V300" pathLength={1} className="hc-draw" style={d(T.store + 120)} />
          <rect x={426} y={198} width={84} height={66} rx={4} pathLength={1} className="hc-draw" style={d(T.store + 350)} />
          <path d="M426 244H510" pathLength={1} strokeWidth={1.25} className="hc-draw" style={d(T.store + 500)} />
          <rect x={524} y={198} width={48} height={102} rx={3} pathLength={1} className="hc-draw" style={d(T.store + 400)} />
          <rect x={533} y={208} width={30} height={32} rx={2} pathLength={1} strokeWidth={1.25} className="hc-draw stroke-line-2" style={d(T.store + 550)} />
          <path d="M598 300L602 284H618L622 300M610 284C608 272 600 268 595 266M610 284C612 270 620 266 627 263M610 284V268" pathLength={1} strokeWidth={1.25} className="hc-draw" style={d(T.store + 600)} />
        </g>
        {/* Productos en la vidriera y picaporte */}
        <g className="hc-fade" style={d(T.store + 800)}>
          <circle cx={446} cy={235} r={8} className="fill-orange" />
          <rect x={462} y={222} width={13} height={21} rx={2} strokeWidth={1.25} className="stroke-ink" />
          <rect x={482} y={228} width={18} height={15} rx={2} strokeWidth={1.25} className="stroke-ink" />
          <circle cx={531} cy={256} r={2.2} className="fill-ink" />
        </g>
        {/* Toldo a rayas: cada franja cae en cascada */}
        {AWNING.map((s, i) => (
          <path
            key={i}
            d={s.d}
            strokeWidth={1.25}
            className={`hc-drop stroke-ink ${s.orange ? "fill-orange" : "fill-paper"}`}
            style={d(T.awning + i * 55)}
          />
        ))}

        {/* Líneas de puntos que se arman de punta a punta */}
        {DOTS_LAPTOP.map(([x, y], k) => (
          <circle key={`l${k}`} cx={x} cy={y} r={2.2} className="hc-pop fill-subtle" style={d(T.dots + k * 40)} />
        ))}
        {DOTS_PHONE.map(([x, y], k) => (
          <circle key={`p${k}`} cx={x} cy={y} r={2.2} className="hc-pop fill-subtle" style={d(T.dots + 250 + k * 45)} />
        ))}

        {/* Paquetes (SMIL; los arranca el efecto): van y vuelven por la misma línea */}
        <g ref={packets}>
          {PACKETS.map(({ c, r, ink }, i) => (
            <circle key={i} r={0} className={ink ? "fill-ink" : "fill-orange"} style={{ opacity: 0 }}>
              <animateMotion
                begin="indefinite"
                dur={`${PACKET_MS}ms`}
                repeatCount="indefinite"
                path={pathOf(c)}
                calcMode="spline"
                keyTimes={TRIP.times}
                keyPoints={TRIP.points}
                keySplines={TRIP.splines}
              />
              <animate
                attributeName="r"
                begin="indefinite"
                dur={`${PACKET_MS}ms`}
                repeatCount="indefinite"
                calcMode="spline"
                keyTimes={TRIP.times}
                values={TRIP.radius.map((k) => k * r).join(";")}
                keySplines={TRIP.splines}
              />
            </circle>
          ))}
        </g>

        {/* Íconos que salen del cartel, con su hilo, y quedan flotando */}
        {BADGES.map((b, k) => (
          // Hover: el globito crece, su hilo se pone naranja y aparece el nombre abajo.
          <g key={b.label} className="group pointer-events-auto">
            <path
              d={`M${SIGN[0]} ${SIGN[1]}L${b.x} ${b.y}`}
              pathLength={1}
              strokeWidth={1}
              className="hc-draw stroke-line transition-[stroke] duration-300 group-hover:stroke-orange"
              style={d(T.badges + k * 140)}
            />
            <g transform={`translate(${b.x} ${b.y})`}>
              <g
                className="hc-emerge"
                style={{ ...d(T.badges + 90 + k * 140), "--dx": `${SIGN[0] - b.x}px`, "--dy": `${SIGN[1] - b.y}px` } as CSSProperties}
              >
                <g className="hc-float" style={{ animationDelay: `${-k * 0.8}s` }}>
                  <g className="origin-center transition-[scale] duration-450 ease-snap [transform-box:fill-box] group-hover:scale-125">
                    <circle
                      r={19}
                      strokeWidth={1.25}
                      className={`transition-[fill,stroke] duration-300 ${b.accent ? "fill-orange stroke-orange" : "fill-paper stroke-line-2 group-hover:stroke-orange"}`}
                    />
                    <g strokeWidth={1.5} className="stroke-ink">
                      {b.icon}
                    </g>
                  </g>
                  <text
                    y={40}
                    textAnchor="middle"
                    className="fill-ink font-mono text-[11px] font-medium tracking-[.04em] uppercase opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-y-[-3px] group-hover:opacity-100"
                  >
                    {b.label}
                  </text>
                </g>
              </g>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
