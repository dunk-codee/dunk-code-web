export type ProjectCategory = "Web" | "App" | "Sistema";

export type Project = {
  name: string;
  cat: ProjectCategory;
  type: string;
  year: string;
  desc: string;
  stack: string[];
  url?: string;
  /** Capturas en /public/projects; la primera es la portada. */
  images?: { src: string; alt: string }[];
};

export const PROJECTS: Project[] = [
  {
    name: "Don Pancho & Burger",
    cat: "Sistema",
    type: "Sitio + sistema de gestión",
    year: "2026",
    desc: "Sitio para una hamburguesería con la carta completa y pedidos online para delivery o retiro, incluso programados cuando el local está cerrado. Detrás, un panel propio para el local: pedidos en vivo, venta de mostrador, caja, ventas, gastos y la carta con precios editables.",
    stack: ["Next.js", "Cloudinary"],
    url: "https://www.donpanchoyburger.com.ar/",
    images: [
      { src: "/projects/donpancho-hero.webp", alt: "Portada del sitio de Don Pancho & Burger" },
      { src: "/projects/donpancho-menu.webp", alt: "Carta online de Don Pancho & Burger" },
      { src: "/projects/donpancho-mostrador-admin.webp", alt: "Panel de administración: venta de mostrador" },
      { src: "/projects/donpancho-menu-admin.webp", alt: "Panel de administración: edición de la carta" },
    ],
  },
  {
    name: "CTI Gualeguaychú",
    cat: "Web",
    type: "Sitio institucional",
    year: "2026",
    desc: "Sitio para un centro terapéutico interdisciplinario: especialidades, un directorio de profesionales con buscador y página propia para cada uno, turnos directos por WhatsApp y un portal privado para el staff.",
    stack: ["Next.js"],
    url: "https://www.centroterapeuticointegral.com.ar/",
    images: [
      { src: "/projects/cti-hero.webp", alt: "Portada del sitio del Centro Terapéutico Integral" },
      { src: "/projects/cti-especialidades.webp", alt: "Especialidades del Centro Terapéutico Integral" },
      { src: "/projects/cti-profesionales.webp", alt: "Directorio de profesionales del Centro Terapéutico Integral con buscador" },
      { src: "/projects/cti-instalaciones.webp", alt: "Instalaciones y consultorios del Centro Terapéutico Integral" },
    ],
  },
];

export const SERVICES = [
  { n: "01", t: "Sitios y web apps", d: "Sitios rápidos y autoadministrables, y web apps que tus clientes usan desde cualquier dispositivo.", tags: ["Next.js", "React", "CMS"] },
  { n: "02", t: "Software a medida", d: "Sistemas internos, paneles y herramientas pensadas para la forma en que trabaja tu negocio.", tags: ["Gestión", "Paneles", "Reportes"] },
  { n: "03", t: "Integraciones y automatización", d: "Conectamos las herramientas que ya usás y automatizamos las tareas repetitivas.", tags: ["APIs", "Pagos", "WhatsApp"] },
];

export const ABOUT =
  "Somos Dunk Code, un estudio de desarrollo formado por dos amigos. Diseñamos y programamos software a medida para negocios que necesitan una herramienta propia.";
/** Palabras de ABOUT que se resaltan en naranja al encenderse. */
export const ABOUT_ACCENT = "software a medida";

export const NAV = [
  { id: "nosotros", label: "Nosotros" },
  { id: "servicios", label: "Servicios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
] as const;

export const FILTERS = ["Todos", "Web", "App", "Sistema"] as const;
export type Filter = (typeof FILTERS)[number];

export type TeamMember = { name: string; role: string; photo?: string };

// Poné las fotos en /public/team y usá `photo: "/team/mateo.jpg"`.
export const TEAM: TeamMember[] = [
  { name: "Mateo del Valle", role: "[CARGO]" },
  { name: "[TU NOMBRE]", role: "[CARGO]" },
];

export const CHANNELS = [
  { k: "Email", v: "[EMAIL]", href: "#" },
  { k: "WhatsApp", v: "[TELÉFONO]", href: "#" },
  { k: "Instagram", v: "[USUARIO]", href: "#" },
];
