import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import { DEMOS, PROJECTS, TEAM } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

// Es una sola página: las secciones (#nosotros, #servicios…) no van, Google ignora los fragmentos.
// Las capturas sí, como sitemap de imágenes, para que aparezcan en Google Imágenes.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const images = [
    "/opengraph-image",
    ...PROJECTS.flatMap((p) => [...(p.images ?? []), ...(p.mobile ? [p.mobile] : [])].map((i) => i.src)),
    ...DEMOS.flatMap((d) => d.images.map((i) => i.src)),
    ...TEAM.flatMap((m) => (m.photo ? [m.photo] : [])),
  ].map((src) => absoluteUrl(src));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: await buildDate(),
      changeFrequency: "monthly",
      priority: 1,
      images,
    },
  ];
}

/** Fecha del último deploy: cacheada para que el sitemap se genere en el build (un `new Date()` suelto lo haría dinámico). */
async function buildDate() {
  "use cache";
  cacheLife("max");
  return new Date().toISOString();
}
