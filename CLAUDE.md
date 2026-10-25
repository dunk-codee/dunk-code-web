@AGENTS.md

# Dunk Code — sitio web del estudio

Landing de una sola página para **Dunk Code**, estudio de desarrollo de software a medida (dos socios). Todo el contenido visible está en **español rioplatense con voseo** ("Contanos", "Probá", "¿Qué necesitás?"); mantener ese tono en cualquier texto nuevo, incluidos errores de validación.

## Stack

- **Next.js 16.4** (App Router, Turbopack) — ver `AGENTS.md`: las APIs pueden diferir de lo conocido; consultar `node_modules/next/dist/docs/` antes de usar algo de Next.
  - `next.config.ts` activa `cacheComponents` y `partialPrefetching`.
  - Tipos globales generados como `LayoutProps<"/">` (usado en `layout.tsx`).
- **React 19.3** — se usa `useEffectEvent` y `useSyncExternalStore`.
- **Tailwind CSS v4** cargado con el loader `@tailwindcss/turbopack` (no hay `postcss.config`). Tema definido con `@theme` en `src/app/globals.css`, no hay `tailwind.config`.
- **Zod 4** (`z.flattenError`, `z.input`).
- TypeScript estricto, alias `@/*` → `src/*`.
- Sin tests. Sin librerías de animación: todo es CSS + `requestAnimationFrame` a mano.

## Comandos

```bash
npm run dev     # servidor de desarrollo (localhost:3000)
npm run build   # build de producción — usar para verificar tipos
npm run lint    # eslint (config next core-web-vitals + typescript)
```

## Estructura

```
src/
  app/
    layout.tsx     # fuentes (Space Grotesk / JetBrains Mono como CSS vars), metadata, lang="es"
    page.tsx       # compone las secciones en orden
    actions.ts     # Server Action sendContact → Resend
    globals.css    # tokens de diseño, keyframes, utilidades custom
    icon.svg       # favicon
  components/      # una sección o pieza por archivo (kebab-case, export con nombre)
  lib/
    content.ts         # TODO el contenido editable (proyectos, servicios, equipo, canales, nav)
    contact-schema.ts  # schema Zod compartido cliente/servidor
    hooks.ts           # hooks de cliente compartidos
```

Orden de la página (`page.tsx`): `Intro` → `SiteHeader` → `Hero` → `About` (#nosotros) → `Services` (#servicios) → `Projects` (#proyectos) → `Demos` (#demos) → `Contact` (#contacto) → `SiteFooter` + `RevealObserver`.

Los ids de sección deben coincidir con `NAV` en `lib/content.ts` (el header calcula la sección activa con ellos).

## Contenido

Todo el texto/datos de proyectos, servicios, equipo y canales vive en `src/lib/content.ts`. Para cambiar contenido, editar ahí, no en los componentes.

`DEMOS` son sitios de muestra por rubro (publicados en Vercel), **no clientes**: en la web siempre llevan la etiqueta "Demo" y no se mezclan con `PROJECTS`. Capturas en `/public/demos/` (1920×960 WebP). `also` lista otros rubros a los que se adapta el mismo modelo.

Pendientes de completar (placeholders): los `url` de `PROJECTS` (sin `url`, el botón "Visitar sitio" queda deshabilitado). Las capturas de proyectos son placeholders con rayas (`stripes-light`).

Fotos del equipo: `/public/profiles/` en WebP, recortadas 4:5 (760×950) con la cara al mismo tamaño y altura en las dos (≈30% del ancho, centro a ≈42% de la altura) para que las cards queden parejas.

## Formulario de contacto

- `contact-form.tsx` (cliente) valida con `validateContact` para feedback inmediato y llama a la Server Action `sendContact` dentro de `useTransition`.
- `actions.ts` revalida (fuente de verdad) y envía por la API REST de Resend con `fetch` (sin SDK).
- Variables de entorno: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` (opcional). Si faltan las dos primeras, solo hace `console.info` y devuelve `ok` — útil en local.
- Resultado tipado `ContactResult = { ok: true } | { ok: false; errors }`; los errores son por campo (`ContactErrors`).

## Sistema de diseño (`globals.css`)

- Colores (usar siempre los tokens, nunca hex sueltos): `ink`, `ink-2..4`, `dim`, `muted`, `subtle`, `line`, `line-2`, `sand`, `paper`, `orange` (#FF4D1C, marca), `orange-deep`. Excepción: `ball.tsx` tiene los hex hardcodeados en el SVG.
- Breakpoint `md` = 47.5rem (760px), redefinido.
- Easing de marca: `ease-snap` / `var(--ease-snap)`.
- Utilidades custom: `px-gutter`, `eyebrow`, `label-mono`, `stripes-dark`, `stripes-light`.
- Animaciones Tailwind: `animate-fade`, `animate-modal-up`, `animate-hint`, `animate-thanks-drop`.
- Clases de intro (`intro*`, `ball-drop`, `ball-roll`) son CSS plano dentro de `prefers-reduced-motion: no-preference` para que corran antes de la hidratación.
- **Comentarios del código en español** (los nombres de variables, funciones y componentes quedan en inglés).
- Estilo de código: tamaños fluidos con `clamp()` en clases arbitrarias de Tailwind; secciones con `max-w-[1240px] mx-auto`; los rótulos tipo `01 {"// quiénes somos"}` usan comentarios estilo código como recurso visual.

## Patrones de interacción / animación

- **Server components por defecto**; `"use client"` solo donde hay estado o efectos. Patrón habitual: sección server (`about.tsx`, `contact.tsx`) + pieza interactiva cliente (`about-words.tsx`, `contact-form.tsx`).
- `lib/hooks.ts`:
  - `useScrollFrame(fn)` — corre `fn` como máximo una vez por frame en scroll/resize. Usarlo para cualquier efecto ligado al scroll.
  - `prefersReducedMotion()` / `useReducedMotion()` — **toda animación debe respetar reduced motion** (los componentes existentes lo chequean siempre).
  - `useBodyLock(locked)`, `useEscape(fn)` — para menú y modal.
- Las animaciones por scroll mutan `element.style` directamente vía refs (no setState) para evitar re-renders.
- `RevealObserver`: cualquier elemento con `data-reveal="N"` aparece con fade+lift al entrar en viewport, con delay N×100ms. Solo afecta elementos debajo del fold al cargar.
- `InView` (`in-view.tsx`) + clases `in-*` de `globals.css` (`in-word`, `in-rise`, `in-line`, `in-item`, `in-dot`, `in-spark`, `in-burst`): animaciones de entrada más elaboradas que `data-reveal`. Arrancan pausadas en su primer cuadro y corren cuando el `InView` ancestro entra en pantalla (marca `data-in`); el escalonado va con `at(ms)` de `lib/motion.ts` (no se puede importar desde un módulo `"use client"` en un server component). Las usan `About` (cards del equipo: se abren de abajo, sube un telón naranja y la foto se enfoca con `in-clip`/`in-wipe`/`in-zoom`) y `Contact`: título palabra por palabra detrás de una máscara, líneas de los inputs que se dibujan, canales en cascada y botones que aparecen como un punto que estalla en chispas (`Burst`, en `burst.tsx`, compartido; `tone="light"` para fondos claros). `Services` también: filas en cascada con su línea y después estallan los "+"; los ítems se abren con hover (120ms de intención, queda abierto el último) y con clic en touch/teclado. En `contact-channels.tsx` el email además se copia al portapapeles al hacer clic (muestra "¡Copiado!"), porque `mailto:` no hace nada sin un programa de correo configurado.
- `Intro` (`intro.tsx`): pantalla de carga — tiro en parábola al aro, swish de la red, "+2" y un telón que sube. El telón y el aro son CSS puro; la pelota (`intro-ball.tsx`) vive en una capa encima del telón: CSS juega el tiro antes de hidratar y después JS (Web Animations, anclado al mismo reloj) sigue el vuelo — pica abajo de la pantalla, hace un arco y aterriza con rebotes amortiguados sobre la pelota del título (`[data-hero-ball]`), que recién ahí se hace visible. Las constantes de `intro-ball.tsx` deben coincidir con los keyframes `shot-*` de `globals.css`. Si la hidratación llega tarde, queda el fallback CSS (la pelota cae y la del título hace su `ball-drop`). `INTRO_MS` marca cuándo arranca el telón; las entradas del hero se calculan desde ahí (y `.intro-header` en `globals.css` tiene ese valor + 300ms escrito a mano: mantenerlos sincronizados). No se muestra con reduced motion. Se muestra **una vez por sesión**: `INTRO_SEEN_SCRIPT` (inline en el `<head>` de `layout.tsx`, corre antes de pintar) usa `sessionStorage["dc-intro"]`; si ya se vio, marca `html[data-intro-seen]` (el CSS oculta telón y aro) y pone `--intro: 0ms` en el `<html>`. Los delays de entrada del hero y del header usan `afterIntro(ms)` = `calc(var(--intro, INTRO_MS) + ms)`, así arrancan enseguida al refrescar. En ese caso la pelota del título no usa `ball-drop` (el CSS la desactiva y la oculta) sino `gravityDrop()` desde `hero.tsx`, sincronizada a los 650ms. La variable se setea desde JS porque Tailwind descarta las declaradas en CSS.
- `SiteHeader`: sin caja; logo y "Hablemos" en las puntas, links al centro sobre un degradé del color de la sección de abajo. Queda siempre fijo (no se esconde al scrollear). Se pone claro sobre secciones oscuras (`data-dark`, por luminancia del fondo). Hover de links: línea que se dibuja abajo (sin texto que rueda). La sección activa la marca la pelota: `bounce()` (en `lib/bounce.ts`, compartido con `FooterBall`, que usa `gravityDrop()`: caída con gravedad real y piques con restitución) genera keyframes con física (parábola, estiramiento, aplastamiento en impulso y contactos, giro, piques amortiguados) para saltar entre links (`hop`) o caer la primera vez (`drop`). Entrada escalonada después de la intro (`.intro-header` con delay inline).
- `Hero`: letras que se paran una a una (`Chars`, flip 3D + blur), rótulos tipeados (`Typed`), párrafo palabra por palabra. Botones: `UnderLink`, texto grande subrayado como el de enviar en contacto (línea gris que se dibuja al entrar con `.intro-line`, se llena de naranja en hover y la flecha avanza). Ya se probaron y descartaron la píldora y un círculo con texto girando. `RollText` sigue exportado desde `hero.tsx` (lo usa el botón de enviar). Al scrollear la pelota solo gira (sin zoom).
- Tailwind 4.3 descarta custom properties propias declaradas en `globals.css` (`:root { --x }`, incluso dentro de `@theme`): para tiempos/valores compartidos usar constantes TS, no variables CSS.
- `HeroConnect` (`hero-connect.tsx`): animación a la derecha del título (solo ≥1100px; va en fila flex con el `h1` y toma el ancho que sobra, máx. 660px — no posicionarlo en absoluto, porque el título ocupa ~64% del ancho hasta su tope de 204px y en notebooks se pisaban): una notebook y un celular se conectan por líneas de puntos a un local (toldo a rayas, vidriera, puerta, maceta), viajan paquetes de ida y vuelta (SMIL `animateMotion` + `animate` del radio con los mismos `keyTimes`, arrancados por JS después de la entrada) y del cartel salen globitos con íconos (gestión, precios, información, turnos, stock) que quedan flotando; en hover crecen, su hilo se pone naranja y muestran el nombre. Línea fina, minimalista; el dibujo usa las clases `.hc-*` de `globals.css`.
- A la derecha del título va `HeroConnect`; el fondo del hero queda liso. Ya se probaron y descartaron ahí (y en el fondo del hero: un resplandor naranja que seguía al cursor con grano, una media cancha de básquet en líneas y una grilla de puntos con lupa): un mazo de capturas, una grilla de recortes, una consola de código y una trayectoria punteada con etiqueta de disponibilidad.
- Chrome no anima elementos dentro de `<mask>`/`<defs>` de SVG: animar elementos visibles.
- En pantallas chicas (`max-width: 47.5rem`) las entradas con `filter: blur` usan variantes `*-lite` sin desenfoque (al final de `globals.css`): con densidad 2x–3x el blur de decenas de letras trababa la carga. Si se agrega una animación con blur, sumarle su variante lite.
- Evento `project:open` (detail = índice en `PROJECTS`): `Projects` lo escucha para abrir el modal desde cualquier parte de la página.
- Evento `contact:prefill` (detail = `{ tipo, msg }`): lo dispara "Quiero uno así" en `Demos`; `ContactForm` precarga el pedido (sin pisar un mensaje que la persona ya escribió) y enfoca el nombre.
- Botones compartidos en `cta.tsx`: `PrimaryCta` (texto en negrita subrayado + círculo naranja con flecha: "Ver el caso", "Quiero uno así"), `TextCta` (mono con flecha: "Visitar sitio", "Ver en vivo"), `PillCta` (píldora con el relleno naranja que sube de "Hablemos"; `solid`/`outline`, la usa el modal) y `ArrowIcon` (flechas SVG; no usar los caracteres →/↗ de la mono, no quedan centrados).
- `ProjectModal`: sin barra de scroll visible (sigue scrolleando); la X de cerrar es un círculo naranja que va en una capa `sticky` de alto cero, así queda fija aunque se scrollee el modal (en mobile se scrollea mucho). Recibe un `ModalItem` genérico (`meta`, `tags`) más `urlLabel`/`nextLabel` y acciones extra como `children`: lo usan `Projects` y `Demos`.
- `Demos`: selector "¿qué negocio tenés?" en vez de cards. A la izquierda los rubros (filas con punto naranja que cambian con clic, no con hover; en mobile, `RubroTabs`: pestañas de texto numeradas que se deslizan de costado, con barra naranja deslizante y degradé que avisa que hay más) y a la derecha un solo visor con forma de navegador (`Viewer`: dirección real de la demo, capturas 2:1 rotando con indicadores; tocar la pantalla abre `ProjectModal`). Debajo del visor: nombre, pitch, features, `also`, "Quiero uno así" (baja a contacto precargado) y "Ver en vivo". La sección mide lo que una card (~1100px en mobile).
- Capturas de proyectos: sacarlas con Edge headless a 2x (`msedge --headless=new --force-device-scale-factor=2 --window-size=1440,900 --screenshot=… URL`; las mobile NO con Edge headless: no arma la página a menos de ~500px de ancho y con 390 recorta el costado derecho; usar Playwright emulando un iPhone, viewport 393×852, `device_scale_factor=3`, `is_mobile=True`, y guardar a 786×1704 para que el celular de la maqueta muestre solo el hero) y recortar/exportar con PIL; las capturas del navegador de Claude salen a baja resolución y en JPEG, y se ven pixeladas. Para sitios con intro o animaciones por scroll (las demos) conviene Playwright con `channel="msedge"`, viewport 1440×720 a 2x: esperar la intro, recorrer la página para disparar las apariciones y después scrollear a la sección.
- `Projects`: cada proyecto es un caso (`CaseStudy`), alternando de lado: maqueta de notebook + celular (`Devices`) con las capturas reales (las de escritorio rotan cada 3.8s con fundido; debajo, flechas ← → e indicadores que se llenan; pasar una a mano reinicia el tiempo; solo se detiene fuera de pantalla. La mobile va en un iPhone con isla dinámica y botones laterales). Entrada de la maqueta: aparece la base, la tapa se abre desde la bisagra (`in-lid`), la pantalla se enciende como una tele (`in-screen`, línea de luz que se abre) y el iPhone sube, se pasa y se acomoda (`in-phone`). Sin `clip-path` en el contenedor: la base sobresale a los costados y se cortaba y al lado nombre, `pitch`, `features` y botones "Ver el caso" (abre `ProjectModal`) y "Visitar sitio". Campos en `PROJECTS`: `pitch`, `features`, `images` (escritorio) y `mobile` (captura del hero en iPhone, 393×852). Ya no hay filtros ni vista lista/grilla.
- Accesibilidad cuidada: `aria-pressed`, `aria-expanded`/`aria-controls`, `inert` en acordeones cerrados, `role="dialog"` + `aria-modal`, decorativos con `aria-hidden`. Mantener ese nivel.

## Estado del repo

Remoto: https://github.com/dunk-codee/dunk-code-web (rama `main`). Lo trabajan dos personas en paralelo: hacer `git pull` antes de empezar.

**Todos los datos son mockup** (proyectos, textos del equipo, canales de contacto, servicios): se van a ir reemplazando por los reales. No asumir que ningún dato de `content.ts` es definitivo. Por ahora no hay `README.md` (se borró el default).
