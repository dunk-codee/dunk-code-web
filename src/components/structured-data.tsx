import { ABOUT, CHANNELS, DEMOS, PROJECTS, SERVICES, TEAM } from "@/lib/content";
import {
  absoluteUrl,
  SITE_DESCRIPTION,
  SITE_FOUNDED,
  SITE_KEYWORDS,
  SITE_LOCATION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/site";

const id = (frag: string) => `${SITE_URL}/#${frag}`;
const channel = (k: string) => CHANNELS.find((c) => c.k === k)?.v;
const email = channel("Email");
const phone = channel("WhatsApp")?.replace(/[^\d+]/g, "");

/**
 * Datos estructurados (schema.org) de la página: el estudio como negocio local, el sitio, el equipo,
 * los servicios y los trabajos. Los usan Google (resultados enriquecidos, panel de empresa) y los
 * buscadores con IA para entender y citar quiénes somos. Todo sale de content.ts y site.ts.
 */
export function StructuredData() {
  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": id("organization"),
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: absoluteUrl("/apple-icon"), width: 180, height: 180 },
      image: absoluteUrl("/opengraph-image"),
      description: SITE_DESCRIPTION,
      slogan: "Software a tu medida",
      disambiguatingDescription: ABOUT,
      foundingDate: SITE_FOUNDED,
      email,
      telephone: phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: SITE_LOCATION.locality,
        addressRegion: SITE_LOCATION.region,
        addressCountry: SITE_LOCATION.country,
      },
      areaServed: [
        ...[SITE_LOCATION.locality, ...SITE_LOCATION.nearby].map((name) => ({ "@type": "City", name })),
        { "@type": "State", name: SITE_LOCATION.region },
        { "@type": "Country", name: SITE_LOCATION.countryName },
      ],
      founder: TEAM.map((_, i) => ({ "@id": id(`person-${i}`) })),
      employee: TEAM.map((_, i) => ({ "@id": id(`person-${i}`) })),
      knowsAbout: SITE_KEYWORDS,
      knowsLanguage: "es",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email,
        telephone: phone,
        url: absoluteUrl("/#contacto"),
        availableLanguage: ["Spanish"],
        areaServed: SITE_LOCATION.country,
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            "@id": id(`service-${s.n}`),
            name: s.t,
            description: s.d,
            serviceType: s.t,
            keywords: s.tags.join(", "),
            provider: { "@id": id("organization") },
            areaServed: { "@type": "Country", name: SITE_LOCATION.countryName },
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": id("website"),
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "es-AR",
      publisher: { "@id": id("organization") },
    },
    {
      "@type": "WebPage",
      "@id": id("webpage"),
      url: absoluteUrl("/"),
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      inLanguage: "es-AR",
      isPartOf: { "@id": id("website") },
      about: { "@id": id("organization") },
      primaryImageOfPage: { "@type": "ImageObject", url: absoluteUrl("/opengraph-image"), width: 1200, height: 630 },
      mainEntity: { "@id": id("organization") },
      hasPart: [{ "@id": id("projects") }, { "@id": id("demos") }],
    },
    ...TEAM.map((m, i) => ({
      "@type": "Person",
      "@id": id(`person-${i}`),
      name: m.name,
      jobTitle: m.role,
      image: m.photo ? absoluteUrl(m.photo) : undefined,
      sameAs: m.linkedin ? [m.linkedin] : undefined,
      worksFor: { "@id": id("organization") },
    })),
    {
      "@type": "ItemList",
      "@id": id("projects"),
      name: "Proyectos de Dunk Code",
      itemListElement: PROJECTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: p.name,
          headline: p.pitch,
          description: p.desc,
          genre: p.type,
          url: p.url,
          dateCreated: p.year,
          image: p.images?.[0] ? absoluteUrl(p.images[0].src) : undefined,
          keywords: p.features.join(", "),
          creator: { "@id": id("organization") },
        },
      })),
    },
    {
      "@type": "ItemList",
      "@id": id("demos"),
      name: "Demos por rubro",
      description: "Sitios de muestra (no son clientes) que se adaptan a cada tipo de negocio.",
      itemListElement: DEMOS.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: `${d.name} (demo para ${d.rubro.toLowerCase()})`,
          headline: d.pitch,
          description: d.desc,
          genre: d.type,
          url: d.url,
          image: absoluteUrl(d.images[0].src),
          keywords: [d.rubro, ...d.features, ...(d.also ?? [])].join(", "),
          creator: { "@id": id("organization") },
        },
      })),
    },
  ];

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });

  return (
    <script
      type="application/ld+json"
      // `<` escapado para que ningún texto pueda cerrar el <script>.
      dangerouslySetInnerHTML={{ __html: json.replace(/</g, "\\u003c") }}
    />
  );
}
