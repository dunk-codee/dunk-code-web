import { ABOUT, CHANNELS, DEMOS, PROJECTS, SERVICES, TEAM } from "@/lib/content";
import { absoluteUrl, SITE_DESCRIPTION, SITE_LOCATION, SITE_NAME, SITE_URL } from "@/lib/site";

// GEO: resumen en Markdown del sitio para modelos de lenguaje (formato de llmstxt.org).
// Sale de content.ts, así se mantiene al día solo. Se genera en el build.
export function GET() {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${SITE_NAME} es un estudio de desarrollo de software a medida de ${SITE_LOCATION.locality}, ${SITE_LOCATION.region} (${SITE_LOCATION.countryName}). ${ABOUT}`,
    "",
    "## Servicios",
    "",
    ...SERVICES.map((s) => `- **${s.t}**: ${s.d} (${s.tags.join(", ")})`),
    "",
    "## Proyectos",
    "",
    ...PROJECTS.map(
      (p) =>
        `- ${p.url ? `[${p.name}](${p.url})` : p.name} — ${p.type}, ${p.year}. ${p.desc} Incluye: ${p.features.join(", ")}.`,
    ),
    "",
    "## Demos por rubro",
    "",
    "Sitios de muestra (no son clientes) que se adaptan a cada tipo de negocio.",
    "",
    ...DEMOS.map(
      (d) =>
        `- [${d.name}](${d.url}) — ${d.rubro}, ${d.type.toLowerCase()}. ${d.desc}${d.also ? ` También sirve para: ${d.also.join(", ")}.` : ""}`,
    ),
    "",
    "## Equipo",
    "",
    ...TEAM.map((m) => `- ${m.linkedin ? `[${m.name}](${m.linkedin})` : m.name} — ${m.role}, socio fundador`),
    "",
    "## Contacto",
    "",
    ...CHANNELS.map((c) => `- ${c.k}: [${c.v}](${c.href})`),
    `- Formulario: ${absoluteUrl("/#contacto")}`,
    "",
    "## Secciones del sitio",
    "",
    `- [Inicio](${SITE_URL}/)`,
    `- [Nosotros](${absoluteUrl("/#nosotros")})`,
    `- [Servicios](${absoluteUrl("/#servicios")})`,
    `- [Proyectos](${absoluteUrl("/#proyectos")})`,
    `- [Demos](${absoluteUrl("/#demos")})`,
    `- [Contacto](${absoluteUrl("/#contacto")})`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
