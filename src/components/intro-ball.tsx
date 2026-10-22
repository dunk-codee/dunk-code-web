"use client";

import { useEffect, useRef } from "react";
import { Ball } from "./ball";
import { prefersReducedMotion } from "@/lib/hooks";

// Física en em del escenario, tiempo en ms desde el inicio del tiro. Debe coincidir con los keyframes `shot-*` del CSS.
const DELAY = 200;
const G = 165; // em/s², la gravedad que implica el tiro en CSS
const SPIN = -600 / 1100; // grados/ms, la velocidad del backspin en CSS
const OUT = "cubic-bezier(.33,.67,.67,1)"; // ease-out cuadrático: subiendo contra la gravedad
const IN = "cubic-bezier(.33,0,.67,.33)"; // ease-in cuadrático: cayendo desde el reposo
const T_RIM = 770;
const T_EXIT = 924;
const NET_X = 17.2;
const NET_Y = 11.5;

/** Tiempo para caer `h` em desde el reposo (o subir `h` em hasta frenar). */
const air = (h: number) => Math.sqrt((2 * Math.max(h, 0.01)) / G) * 1000;

type Key = [t: number, value: string, easing?: string];

function track(prop: string, keys: Key[], end: number): Keyframe[] {
  return keys.map(([t, value, easing = "linear"]) => ({ offset: Math.min(1, t / end), [prop]: value, easing }));
}

/** Tiro → swish → pique contra el borde inferior → arco hasta la pelota del hero, frenando con piques amortiguados. */
function flight(stage: DOMRect, fs: number, target: DOMRect) {
  const tx = (target.left + target.width / 2 - stage.left) / fs;
  const ty = (target.top + target.height / 2 - stage.top) / fs;
  const size = target.width / (2.6 * fs);
  const floor = (innerHeight - stage.top) / fs - 1.3;
  const apex = Math.min(ty, floor) - 3;

  const tFloor = T_EXIT + air(floor - NET_Y);
  const tApex = tFloor + air(floor - apex);
  const tLand = tApex + air(ty - apex);

  const y: Key[] = [
    [0, "0 19em", OUT],
    [478.5, "0 0em", IN],
    [T_RIM, "0 7em", "cubic-bezier(.3,.5,.5,1)"],
    [T_EXIT, `0 ${NET_Y}em`, IN],
    [tFloor, `0 ${floor}em`, OUT],
    [tApex, `0 ${apex}em`, IN],
  ];
  const contacts = [tFloor, tLand];
  let t = tLand;
  let h = ty - apex;
  for (let i = 0; i < 3; i++) {
    h *= 0.25; // restitución 0.5 → cada pique llega a un cuarto de la altura anterior
    const up = air(h);
    y.push([t, `0 ${ty}em`, OUT], [t + up, `0 ${ty - h}em`, IN]);
    t += 2 * up;
    contacts.push(t);
  }
  const end = t;
  y.push([end, `0 ${ty}em`]);

  const squash: Key[] = [[0, "1 1"]];
  [0.22, 0.18, 0.1, 0.05].forEach((a, i) => {
    const c = contacts[i];
    squash.push([c - 30, "1 1"], [c, `${1 + a} ${1 - a}`], [c + 50, "1 1"]);
  });
  squash.push([end, "1 1"]);

  const landAngle = SPIN * tLand;
  const finalAngle = -Math.ceil((-landAngle + 90) / 360) * 360; // vueltas completas, para que coincida con la pelota del hero en reposo

  return {
    end,
    x: track("translate", [[0, "-3em 0"], [T_RIM, "17em 0", "ease-out"], [T_EXIT, `${NET_X}em 0`], [tLand, `${tx}em 0`], [end, `${tx}em 0`]], end),
    fade: track("opacity", [[0, "0"], [66, "1"], [end, "1"]], end),
    y: track("translate", y, end),
    size: track("scale", [[0, "1.5"], [T_RIM, "1"], [tFloor, "1", "ease-in-out"], [tLand, `${size}`], [end, `${size}`]], end),
    squash: track("scale", squash, end),
    spin: track("rotate", [[0, "0deg"], [tLand, `${landAngle}deg`, "ease-out"], [end, `${finalAngle}deg`]], end),
  };
}

/**
 * La pelota de la intro. CSS juega el tiro antes de hidratar; al hidratar, JS toma el vuelo
 * (con el mismo reloj) para aterrizar en la pelota del título. Si la hidratación llega tarde,
 * el fallback CSS la deja caer y la pelota del hero baja sola.
 */
export function IntroBall() {
  const xRef = useRef<HTMLDivElement>(null);
  const yRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef<HTMLDivElement>(null);
  const squashRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const [x, y, size, squash, spin] = [xRef, yRef, sizeRef, squashRef, spinRef].map((r) => r.current!);
    const hero = document.querySelector<HTMLElement>("[data-hero-ball]");
    if (!hero) return;

    if (startRef.current === null) {
      const shot = x.getAnimations()[0];
      const now = shot?.currentTime;
      if (prefersReducedMotion() || typeof now !== "number" || now > DELAY + T_EXIT + 100) return;
      startRef.current = (document.timeline.currentTime as number) - now;
      for (const el of [x, y, spin]) el.style.animation = "none";
      hero.querySelectorAll<HTMLElement>(".ball-drop, .ball-roll").forEach((el) => (el.style.animation = "none"));
      hero.style.opacity = "0";
    }
    const start = startRef.current;

    let anims: Animation[] = [];
    let alive = true;
    const run = () => {
      if (!alive) return;
      anims.forEach((a) => a.cancel());
      const box = x.parentElement!;
      const f = flight(box.getBoundingClientRect(), parseFloat(getComputedStyle(box).fontSize), hero.getBoundingClientRect());
      const opts: KeyframeAnimationOptions = { duration: f.end, delay: DELAY, fill: "both" };
      anims = [
        x.animate(f.x, opts),
        x.animate(f.fade, opts),
        y.animate(f.y, opts),
        size.animate(f.size, opts),
        squash.animate(f.squash, opts),
        spin.animate(f.spin, opts),
      ];
      anims.forEach((a) => (a.startTime = start));
      anims[0].finished
        .then(() => {
          hero.style.opacity = "";
          x.style.visibility = "hidden";
        })
        .catch(() => {});
    };

    run();
    document.fonts?.ready.then(run);
    addEventListener("resize", run);
    return () => {
      alive = false;
      removeEventListener("resize", run);
      anims.forEach((a) => a.cancel());
    };
  }, []);

  return (
    <div ref={xRef} className="intro-ball-x absolute top-0 left-0">
      <div ref={yRef} className="intro-ball-y">
        <div ref={sizeRef} className="-mt-[1.3em] -ml-[1.3em] size-[2.6em]">
          <div ref={squashRef} className="size-full origin-bottom">
            <div ref={spinRef} className="intro-ball-spin size-full">
              <Ball />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
