/** Motor de piques de pelota para Web Animations (lo usan la pelota del nav y la del footer). */

/** `y0`: altura de partida (negativa = en el aire), para retomar un salto interrumpido. */
export type Arc = { dur: number; h: number; x0: number; x1: number; y0?: number; fall?: boolean };

/**
 * Keyframes de una pelota que pica, muestreados a 60fps: parábolas reales (x constante, y cuadrática),
 * estiramiento según la velocidad vertical, aplastamiento al tomar impulso y en cada contacto,
 * y giro proporcional al avance (redondeado a media vuelta: el dibujo es simétrico y no salta al terminar).
 */
export function bounce(arcs: Arc[], lead: number, impacts: number[]) {
  const total = lead + arcs.reduce((n, a) => n + a.dur, 0);
  const X0 = arcs[0].x0;
  const X1 = arcs[0].x1;
  const spin = Math.round(((X1 - X0) * 1.1) / 180) * 180;
  const hMax = Math.max(...arcs.map((a) => a.h));
  const pulses: [number, number][] = lead ? [[lead, 0.22]] : [];
  arcs.reduce((t, a, i) => {
    pulses.push([t + a.dur, impacts[i] ?? 0]);
    return t + a.dur;
  }, lead);

  const move: Keyframe[] = [];
  const shape: Keyframe[] = [];
  const turn: Keyframe[] = [];
  for (let ms = 0; ; ms = Math.min(ms + 1000 / 60, total)) {
    let x = X0;
    let y = 0;
    let stretch = 0;
    let start = lead;
    for (const a of arcs) {
      if (ms < start) break;
      const s = Math.min(1, (ms - start) / a.dur);
      x = a.x0 + (a.x1 - a.x0) * s;
      y = a.fall ? -a.h * (1 - s * s) : -4 * a.h * s * (1 - s) + (a.y0 ?? 0) * (1 - s);
      const v = a.fall ? s : Math.abs(2 * s - 1);
      stretch = s < 1 ? 0.14 * v * (a.h / hMax) : 0;
      start += a.dur;
    }
    const sq = Math.max(0, ...pulses.map(([pt, k]) => k * Math.max(0, 1 - Math.abs(ms - pt) / 60)));
    const offset = ms / total;
    const roll = X1 === X0 ? 0 : (spin * (x - X0)) / (X1 - X0);
    move.push({ offset, transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)` });
    shape.push({ offset, transform: `scale(${((1 + sq) * (1 - stretch * 0.6)).toFixed(3)}, ${((1 - sq) * (1 + stretch)).toFixed(3)})` });
    turn.push({ offset, transform: `rotate(${roll.toFixed(1)}deg)` });
    if (ms >= total) break;
  }
  return { move, shape, turn, duration: total };
}

/**
 * Caída libre desde `height` px con gravedad real (`g` en px/s²): cada pique conserva `restitution`
 * de la velocidad (la altura baja con su cuadrado) hasta que es menor a 1.5px.
 */
export function gravityDrop(height: number, g = 3200, restitution = 0.52) {
  const air = (h: number) => Math.sqrt((2 * h) / g) * 1000; // ms para caer h px desde el reposo
  const arcs: Arc[] = [{ dur: air(height), h: height, x0: 0, x1: 0, fall: true }];
  const impacts = [0.32];
  for (let h = height * restitution ** 2; h > 1.5 && arcs.length < 6; h *= restitution ** 2) {
    arcs.push({ dur: 2 * air(h), h, x0: 0, x1: 0 });
    impacts.push(0.32 * Math.sqrt(h / height) + 0.04);
  }
  return bounce(arcs, 0, impacts);
}
