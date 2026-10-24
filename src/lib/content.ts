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

export type Demo = {
  name: string;
  rubro: string;
  type: string;
  /** Una línea para la card; `desc` va completa en el modal. */
  pitch: string;
  desc: string;
  features: string[];
  /** Otros rubros a los que se adapta el mismo modelo. */
  also?: string[];
  url: string;
  /** Capturas en /public/demos; la primera es la portada. */
  images: { src: string; alt: string }[];
};

// Sitios de muestra (no son clientes): en la web siempre se marcan como "Demo".
export const DEMOS: Demo[] = [
  {
    name: "Nómade",
    rubro: "Indumentaria",
    type: "Tienda online",
    pitch: "Catálogo, carrito con talle y color, y el pedido directo al WhatsApp del local.",
    desc: "Tienda para una marca de ropa: novedades destacadas, catálogo con filtros por categoría y orden, carrito con talle y color, y el pedido ya armado que llega al WhatsApp del local para coordinar pago y entrega.",
    features: ["Catálogo con filtros", "Carrito", "Talles y colores", "Pedido por WhatsApp"],
    url: "https://nomade-three.vercel.app/",
    images: [
      { src: "/demos/nomade-hero.webp", alt: "Portada de la tienda Nómade" },
      { src: "/demos/nomade-novedades.webp", alt: "Novedades de la tienda Nómade" },
      { src: "/demos/nomade-catalogo.webp", alt: "Catálogo de Nómade con filtros por categoría" },
      { src: "/demos/nomade-como-comprar.webp", alt: "Cómo comprar en Nómade: el pedido se envía por WhatsApp" },
    ],
  },
  {
    name: "Florería La Celia",
    rubro: "Florerías",
    type: "Tienda online",
    pitch: "Catálogo con filtros y carrito, arreglos por ocasión y envíos a domicilio.",
    desc: "Tienda para una florería boutique: catálogo con filtros por categoría y precio, carrito, arreglos pensados para cada ocasión, flores de temporada, información de envíos y consultas por WhatsApp con el producto ya elegido.",
    features: ["Catálogo con filtros", "Carrito", "Ocasiones", "Envíos"],
    url: "https://floreria-la-celia.vercel.app/",
    images: [
      { src: "/demos/celia-hero.webp", alt: "Portada de Florería La Celia" },
      { src: "/demos/celia-productos.webp", alt: "Catálogo de Florería La Celia con carrito" },
      { src: "/demos/celia-ocasiones.webp", alt: "Arreglos por ocasión de Florería La Celia" },
      { src: "/demos/celia-producto.webp", alt: "Ficha de producto de Florería La Celia" },
    ],
  },
  {
    name: "Bougie Velas",
    rubro: "Productos artesanales",
    type: "Tienda online",
    pitch: "Colección, guía de aromas y piezas personalizadas, con pedido por WhatsApp.",
    desc: "Tienda para una marca de velas artesanales: colección por categoría, una guía de aromas con sus notas, una sección de velas personalizadas para casamientos y eventos, y pedidos directos por WhatsApp.",
    features: ["Colección", "Guía de aromas", "Personalizados", "Pedido por WhatsApp"],
    url: "https://velas-bougie.vercel.app/",
    images: [
      { src: "/demos/bougie-hero.webp", alt: "Portada de Bougie Velas" },
      { src: "/demos/bougie-coleccion.webp", alt: "Colección de Bougie Velas por categoría" },
      { src: "/demos/bougie-aromas.webp", alt: "Guía de aromas de Bougie Velas" },
      { src: "/demos/bougie-personalizados.webp", alt: "Velas personalizadas para eventos de Bougie Velas" },
    ],
  },
  {
    name: "Rayuela Libros",
    rubro: "Librerías",
    type: "Sitio + catálogo",
    pitch: "Buscador por título, autor o ISBN, agenda cultural y cómo llegar al local.",
    desc: "Sitio para una librería de barrio: buscador por título, autor o ISBN, catálogo con categorías y colecciones, agenda de presentaciones y actividades, y horarios con mapa para llegar al local.",
    features: ["Buscador", "Catálogo", "Agenda cultural", "Ubicación"],
    url: "https://rayuela-libros-sandy.vercel.app/",
    images: [
      { src: "/demos/rayuela-hero.webp", alt: "Portada de Rayuela Libros con buscador" },
      { src: "/demos/rayuela-libros.webp", alt: "Catálogo de libros de Rayuela" },
      { src: "/demos/rayuela-nosotros.webp", alt: "Página Nosotros de Rayuela Libros" },
      { src: "/demos/rayuela-visitanos.webp", alt: "Horarios y mapa de Rayuela Libros" },
    ],
  },
  {
    name: "Patricia Fontán",
    rubro: "Profesionales",
    type: "Sitio profesional",
    pitch: "Presentación, especialidades, preguntas frecuentes y turnos por WhatsApp.",
    desc: "Sitio para una kinesióloga: presentación profesional, especialidades con el detalle de cada tratamiento, cómo pedir turno, preguntas frecuentes y reserva directa por WhatsApp. El mismo modelo sirve para cualquier profesional independiente.",
    features: ["Presentación", "Especialidades", "Turnos por WhatsApp", "Preguntas frecuentes"],
    also: ["Contadores", "Abogados", "Psicólogos", "Nutricionistas"],
    url: "https://kinesiologia-fontan.vercel.app/",
    images: [
      { src: "/demos/fontan-hero.webp", alt: "Portada del sitio de Patricia Fontán, kinesióloga" },
      { src: "/demos/fontan-profesional.webp", alt: "Presentación profesional de Patricia Fontán" },
      { src: "/demos/fontan-especialidades.webp", alt: "Especialidades de kinesiología de Patricia Fontán" },
      { src: "/demos/fontan-turno.webp", alt: "Cómo pedir turno por WhatsApp con Patricia Fontán" },
    ],
  },
];

export const SERVICES = [
  { n: "01", t: "Sitios y web apps", d: "Sitios rápidos y autoadministrables, y web apps que tus clientes usan desde cualquier dispositivo.", tags: ["Next.js", "React", "CMS"] },
  { n: "02", t: "Software a medida", d: "Sistemas internos, paneles y herramientas pensadas para la forma en que trabaja tu negocio.", tags: ["Gestión", "Paneles", "Reportes"] },
  { n: "03", t: "Integraciones y automatización", d: "Conectamos las herramientas que ya usás y automatizamos las tareas repetitivas.", tags: ["APIs", "Pagos", "WhatsApp"] },
];

export const ABOUT = "Dos amigos que diseñan y programan software a medida.";
/** Palabras de ABOUT que se resaltan en naranja al encenderse. */
export const ABOUT_ACCENT = "software a medida";

export const NAV = [
  { id: "nosotros", label: "Nosotros" },
  { id: "servicios", label: "Servicios" },
  { id: "proyectos", label: "Proyectos" },
  { id: "demos", label: "Demos" },
  { id: "contacto", label: "Contacto" },
] as const;

export const FILTERS = ["Todos", "Web", "App", "Sistema"] as const;
export type Filter = (typeof FILTERS)[number];

export type TeamMember = { name: string; role: string; photo?: string; linkedin?: string };

// Fotos en /public/profiles (WebP, recorte 4:5). Sin `linkedin` no se muestra el link.
export const TEAM: TeamMember[] = [
  {
    name: "Mateo del Valle",
    role: "Analista de Sistemas",
    photo: "/profiles/mateo-del-valle.webp",
    linkedin: "https://www.linkedin.com/in/mateo-del-valle-03aa40359/",
  },
  {
    name: "Alex Alvez",
    role: "Analista de Sistemas",
    photo: "/profiles/alex-alvez.webp",
    linkedin: "https://www.linkedin.com/in/alex-alvez-31b980365",
  },
];

export const CHANNELS = [
  { k: "Email", v: "dunk.codee@gmail.com", href: "mailto:dunk.codee@gmail.com" },
  { k: "WhatsApp", v: "+54 9 3442 66-8413", href: "https://wa.me/5493442668413" },
];
