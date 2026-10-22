export type ProjectCategory = "Web" | "App" | "Sistema";

export type Project = {
  name: string;
  cat: ProjectCategory;
  type: string;
  year: string;
  desc: string;
  stack: string[];
  url?: string;
};

export const PROJECTS: Project[] = [
  { name: "Agenda Norte", cat: "Sistema", type: "Sistema de turnos", year: "2026", desc: "Turnos online y recordatorios automáticos para un consultorio con tres profesionales.", stack: ["React", "Node.js", "PostgreSQL"] },
  { name: "Liga Barrial", cat: "App", type: "App mobile", year: "2025", desc: "App para organizar el fixture, los resultados y la tabla de posiciones de una liga de básquet amateur.", stack: ["React Native", "Firebase"] },
  { name: "Pampa Café", cat: "Web", type: "Sitio + tienda", year: "2025", desc: "Sitio institucional con tienda online y pedidos para retirar en el local.", stack: ["Next.js", "Mercado Pago"] },
  { name: "Stockeo", cat: "Sistema", type: "Panel interno", year: "2024", desc: "Panel de stock y ventas para una distribuidora, con reportes semanales automáticos.", stack: ["Vue", "Laravel", "MySQL"] },
  { name: "Estudio Ribera", cat: "Web", type: "Sitio web", year: "2024", desc: "Sitio para un estudio de arquitectura, con portfolio administrable.", stack: ["Astro", "Sanity"] },
];

export const SERVICES = [
  { n: "01", t: "Sitios y web apps", d: "Sitios rápidos y autoadministrables, y web apps que tus clientes usan desde cualquier dispositivo.", tags: ["Next.js", "React", "CMS"] },
  { n: "02", t: "Software a medida", d: "Sistemas internos, paneles y herramientas pensadas para la forma en que trabaja tu negocio.", tags: ["Gestión", "Paneles", "Reportes"] },
  { n: "03", t: "Integraciones y automatización", d: "Conectamos las herramientas que ya usás y automatizamos las tareas repetitivas.", tags: ["APIs", "Pagos", "WhatsApp"] },
];

export const ABOUT =
  "Somos Dunk Code, un estudio de desarrollo formado por dos amigos. Diseñamos y programamos software a medida para negocios que necesitan una herramienta propia.";
/** Words of ABOUT highlighted in orange once lit. */
export const ABOUT_ACCENT = "software a medida";

export const NAV = [
  { id: "nosotros", label: "Nosotros" },
  { id: "servicios", label: "Servicios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
] as const;

export const FILTERS = ["Todos", "Web", "App", "Sistema"] as const;
export type Filter = (typeof FILTERS)[number];

export const MARQUEE = ["Sitios web", "Web apps", "Sistemas a medida", "Apps mobile", "Integraciones", "Automatizaciones"];

export type TeamMember = { name: string; role: string; photo?: string };

// Drop photos into /public/team and set `photo: "/team/mateo.jpg"`.
export const TEAM: TeamMember[] = [
  { name: "Mateo del Valle", role: "[CARGO]" },
  { name: "[TU NOMBRE]", role: "[CARGO]" },
];

export const CHANNELS = [
  { k: "Email", v: "[EMAIL]", href: "#" },
  { k: "WhatsApp", v: "[TELÉFONO]", href: "#" },
  { k: "Instagram", v: "[USUARIO]", href: "#" },
];
