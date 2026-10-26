import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Ícono para iOS (agregar a inicio) y el manifest: el mismo dibujo que icon.svg, en PNG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  // Síncrona para que se genere en el build (ver opengraph-image.tsx).
  const grotesk = readFileSync(join(process.cwd(), "src/assets/space-grotesk-700.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 0 34px 34px",
          background: "#121212",
          color: "#f6f5f1",
          fontFamily: "Grotesk",
          fontSize: 138,
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        d
        <div style={{ width: 30, height: 30, marginLeft: 8, marginBottom: 12, borderRadius: 999, background: "#ff4d1c" }} />
      </div>
    ),
    { ...size, fonts: [{ name: "Grotesk", data: grotesk, weight: 700, style: "normal" }] },
  );
}
