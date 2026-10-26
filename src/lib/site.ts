// Datos del sitio para SEO: metadatos, robots, sitemap, imagen para compartir, datos estructurados y llms.txt.

/**
 * URL pública canónica, sin barra final. Con dominio propio, setear `NEXT_PUBLIC_SITE_URL` (ej. https://dunkcode.com.ar).
 * En Vercel, si no está, usa el dominio de producción del proyecto.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://dunk-code-web.vercel.app")
).replace(/\/$/, "");

export const SITE_NAME = "Dunk Code";

/** Título de la home (≤60 caracteres para que no lo corte Google). */
export const SITE_TITLE = "Dunk Code · Software y páginas web a medida en Entre Ríos";

/** Descripción para buscadores (≈155 caracteres). */
export const SITE_DESCRIPTION =
  "Estudio de desarrollo en Entre Ríos, Argentina. Diseñamos y desarrollamos páginas web, tiendas online, apps y sistemas de gestión a medida para tu negocio.";

/** Versión corta para redes y el manifest. */
export const SITE_TAGLINE = "Software a tu medida: sitios, apps y sistemas para negocios que necesitan su propia herramienta.";

export const SITE_LOCALE = "es_AR";

/** Dónde está el estudio y a qué zona apunta (SEO local y datos estructurados). Verificar antes de publicar. */
export const SITE_LOCATION = {
  locality: "Concepción del Uruguay",
  region: "Entre Ríos",
  /** ISO 3166-2 de la provincia, para `geo.region`. */
  regionCode: "AR-E",
  country: "AR",
  countryName: "Argentina",
  /** Ciudades que se mencionan como zona de trabajo además de la propia. */
  nearby: ["Gualeguaychú"],
} as const;

export const SITE_KEYWORDS = [
  "desarrollo de software a medida",
  "software a medida",
  "diseño web",
  "desarrollo web",
  "páginas web para negocios",
  "tiendas online",
  "e-commerce",
  "sistemas de gestión",
  "web apps",
  "automatización",
  "integración con Mercado Pago",
  "integración con WhatsApp",
  `desarrollo web en ${SITE_LOCATION.region}`,
  `diseño web en ${SITE_LOCATION.locality}`,
  ...SITE_LOCATION.nearby.map((c) => `páginas web en ${c}`),
  "estudio de desarrollo Argentina",
];

/** Año de fundación (para `foundingDate`). */
export const SITE_FOUNDED = "2026";

/** Arma una URL absoluta a partir de un path del sitio. */
export const absoluteUrl = (path = "/") => new URL(path, `${SITE_URL}/`).toString();
