import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_LOCATION, SITE_NAME } from "@/lib/site";

// Imagen que se ve al compartir el link (WhatsApp, LinkedIn, X, etc.). Replica el hero: título grande con la pelota.
export const alt = `${SITE_NAME} · Software a tu medida`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Los hex son los tokens de globals.css (paper, ink, muted, line, orange): ImageResponse no lee CSS.
const PAPER = "#f6f5f1";
const INK = "#121212";
const MUTED = "#5c5b57";
const LINE = "#d9d7cf";
const ORANGE = "#ff4d1c";

const BALL = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><clipPath id="c"><circle cx="50" cy="50" r="50"/></clipPath><g clip-path="url(#c)"><circle cx="50" cy="50" r="50" fill="${ORANGE}"/><g fill="none" stroke="${INK}" stroke-width="5"><path d="M50 0V100"/><path d="M0 50H100"/><path d="M20 6C40 30 40 70 20 94"/><path d="M80 6C60 30 60 70 80 94"/></g></g></svg>`,
)}`;

export default function Image() {
  // Lectura síncrona a propósito: con Cache Components, la asíncrona hace que la imagen se genere en cada pedido en vez de en el build.
  const grotesk = readFileSync(join(process.cwd(), "src/assets/space-grotesk-700.ttf"));
  const mono = readFileSync(join(process.cwd(), "src/assets/jetbrains-mono-500.ttf"));

  const label = { fontFamily: "Mono", fontSize: 22, letterSpacing: 1, textTransform: "uppercase", color: MUTED } as const;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          background: PAPER,
          color: INK,
          fontFamily: "Grotesk",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", ...label }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {"// software a medida"}
            <div style={{ width: 13, height: 26, marginLeft: 8, background: ORANGE }} />
          </div>
          <div>Estudio de desarrollo</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 700, lineHeight: 0.9, letterSpacing: -8 }}>
          <div>Software</div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            a tu medida
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse no usa next/image */}
            <img src={BALL} width={30} height={30} alt="" style={{ marginLeft: 8, marginBottom: 14 }} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 28, borderTop: `2px solid ${LINE}` }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 44, fontWeight: 700, letterSpacing: -1.5 }}>
            {SITE_NAME}
            <div style={{ width: 14, height: 14, marginLeft: 6, marginTop: 14, borderRadius: 999, background: ORANGE }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", ...label }}>
            <div>Sitios · Apps · Sistemas</div>
            <div>{`${SITE_LOCATION.region}, ${SITE_LOCATION.countryName}`}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Grotesk", data: grotesk, weight: 700, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
