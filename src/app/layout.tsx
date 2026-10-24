import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { INTRO_SEEN_SCRIPT } from "@/components/intro";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Dunk Code · software a medida",
  description:
    "Somos Dunk Code. Diseñamos y desarrollamos sitios, apps y sistemas a medida para negocios que necesitan su propia herramienta.",
};

export const viewport: Viewport = {
  themeColor: "#F6F5F1",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script de la intro marca el <html> antes de hidratar.
    <html lang="es" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SEEN_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
