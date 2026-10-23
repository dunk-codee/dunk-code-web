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

Orden de la página (`page.tsx`): `Intro` → `SiteHeader` → `Hero` → `About` (#nosotros) → `Services` (#servicios) → `Projects` (#proyectos) → `Contact` (#contacto) → `SiteFooter` + `RevealObserver`.

Los ids de sección deben coincidir con `NAV` en `lib/content.ts` (el header calcula la sección activa con ellos).

## Contenido

Todo el texto/datos de proyectos, servicios, equipo y canales vive en `src/lib/content.ts`. Para cambiar contenido, editar ahí, no en los componentes.

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
- `InView` (`in-view.tsx`) + clases `in-*` de `globals.css` (`in-word`, `in-rise`, `in-line`, `in-item`, `in-dot`, `in-spark`, `in-burst`): animaciones de entrada más elaboradas que `data-reveal`. Arrancan pausadas en su primer cuadro y corren cuando el `InView` ancestro entra en pantalla (marca `data-in`); el escalonado va con `at(ms)` de `lib/motion.ts` (no se puede importar desde un módulo `"use client"` en un server component). Las usan `About` (cards del equipo: se abren de abajo, sube un telón naranja y la foto se enfoca con `in-clip`/`in-wipe`/`in-zoom`) y `Contact`: título palabra por palabra detrás de una máscara, líneas de los inputs que se dibujan, canales en cascada y botones que aparecen como un punto que estalla en chispas (`Burst` en `contact-form.tsx`). En `contact-channels.tsx` el email además se copia al portapapeles al hacer clic (muestra "¡Copiado!"), porque `mailto:` no hace nada sin un programa de correo configurado.
- `Intro` (`intro.tsx`): pantalla de carga — tiro en parábola al aro, swish de la red, "+2" y un telón que sube. El telón y el aro son CSS puro; la pelota (`intro-ball.tsx`) vive en una capa encima del telón: CSS juega el tiro antes de hidratar y después JS (Web Animations, anclado al mismo reloj) sigue el vuelo — pica abajo de la pantalla, hace un arco y aterriza con rebotes amortiguados sobre la pelota del título (`[data-hero-ball]`), que recién ahí se hace visible. Las constantes de `intro-ball.tsx` deben coincidir con los keyframes `shot-*` de `globals.css`. Si la hidratación llega tarde, queda el fallback CSS (la pelota cae y la del título hace su `ball-drop`). `INTRO_MS` marca cuándo arranca el telón; las entradas del hero se calculan desde ahí (y `.intro-header` en `globals.css` tiene ese valor + 300ms escrito a mano: mantenerlos sincronizados). No se muestra con reduced motion.
- `SiteHeader`: sin caja; logo y "Hablemos" en las puntas, links al centro sobre un degradé del color de la sección de abajo. Queda siempre fijo (no se esconde al scrollear). Se pone claro sobre secciones oscuras (`data-dark`, por luminancia del fondo). Hover de links: línea que se dibuja abajo (sin texto que rueda). La sección activa la marca la pelota: `bounce()` genera keyframes con física (parábola, estiramiento, aplastamiento en impulso y contactos, giro, piques amortiguados) para saltar entre links (`hop`) o caer la primera vez (`drop`). Entrada escalonada después de la intro (`.intro-header` con delay inline).
- `Hero`: letras que se paran una a una (`Chars`, flip 3D + blur), rótulos tipeados (`Typed`), párrafo palabra por palabra y botones que se abren como píldora. Botones con texto que rueda en hover (`RollText`). Al scrollear la pelota solo gira (sin zoom).
- Tailwind 4.3 descarta custom properties propias declaradas en `globals.css` (`:root { --x }`, incluso dentro de `@theme`): para tiempos/valores compartidos usar constantes TS, no variables CSS.
- El espacio a la derecha del título del hero queda en blanco a propósito. Ya se probaron y descartaron ahí: un mazo de capturas, una grilla de recortes, una consola de código y una trayectoria punteada con etiqueta de disponibilidad.
- Chrome no anima elementos dentro de `<mask>`/`<defs>` de SVG: animar elementos visibles.
- Evento `project:open` (detail = índice en `PROJECTS`): `Projects` lo escucha para abrir el modal desde cualquier parte de la página.
- Capturas de proyectos: sacarlas con Edge headless a 2x (`msedge --headless=new --force-device-scale-factor=2 --window-size=1440,900 --screenshot=… URL`) y recortar/exportar con PIL; las capturas del navegador de Claude salen a baja resolución y en JPEG, y se ven pixeladas.
- `Projects`: filtro por categoría (solo categorías con proyectos; se oculta si hay una sola), vista `"list"` (usada) o `"grid"` (disponible, no usada), preview flotante que sigue al cursor (solo dispositivos con hover y ≥760px) y `ProjectModal` con foco gestionado, Escape y "Siguiente proyecto".
- Accesibilidad cuidada: `aria-pressed`, `aria-expanded`/`aria-controls`, `inert` en acordeones cerrados, `role="dialog"` + `aria-modal`, decorativos con `aria-hidden`. Mantener ese nivel.

## Estado del repo

Remoto: https://github.com/dunk-codee/dunk-code-web (rama `main`). Lo trabajan dos personas en paralelo: hacer `git pull` antes de empezar.

**Todos los datos son mockup** (proyectos, textos del equipo, canales de contacto, servicios): se van a ir reemplazando por los reales. No asumir que ningún dato de `content.ts` es definitivo. Por ahora no hay `README.md` (se borró el default).
