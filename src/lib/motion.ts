import type { CSSProperties } from "react";

/** Delay de animación en ms (para las clases `in-*` dentro de un `InView`). */
export const at = (ms: number, extra?: CSSProperties): CSSProperties => ({ animationDelay: `${ms}ms`, ...extra });
