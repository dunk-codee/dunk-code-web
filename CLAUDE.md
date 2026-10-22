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

Orden de la página (`page.tsx`): `SiteHeader` → `Hero` → `Marquee` → `About` (#nosotros) → `Services` (#servicios) → `Projects` (#proyectos) → `Contact` (#contacto) → `SiteFooter` + `RevealObserver`.

Los ids de sección deben coincidir con `NAV` en `lib/content.ts` (el header calcula la sección activa con ellos).

## Contenido

Todo el texto/datos de proyectos, servicios, equipo y canales vive en `src/lib/content.ts`. Para cambiar contenido, editar ahí, no en los componentes.

Pendientes de completar (placeholders): `TEAM` (`[TU NOMBRE]`, `[CARGO]`, fotos en `/public/team/…` vía `photo`), `CHANNELS` (`[EMAIL]`, `[TELÉFONO]`, `[USUARIO]`, `href: "#"`), y los `url` de `PROJECTS` (sin `url`, el botón "Visitar sitio" queda deshabilitado). Las capturas de proyectos son placeholders con rayas (`stripes-light`).

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
- Clases de intro (`intro-line`, `intro-fade`, `intro-clip`, `ball-drop`, `ball-roll`) son CSS plano dentro de `prefers-reduced-motion: no-preference` para que corran antes de la hidratación.
- Estilo de código: tamaños fluidos con `clamp()` en clases arbitrarias de Tailwind; secciones con `max-w-[1240px] mx-auto`; los rótulos tipo `01 {"// quiénes somos"}` usan comentarios estilo código como recurso visual.

## Patrones de interacción / animación

- **Server components por defecto**; `"use client"` solo donde hay estado o efectos. Patrón habitual: sección server (`about.tsx`, `contact.tsx`) + pieza interactiva cliente (`about-words.tsx`, `contact-form.tsx`).
- `lib/hooks.ts`:
  - `useScrollFrame(fn)` — corre `fn` como máximo una vez por frame en scroll/resize. Usarlo para cualquier efecto ligado al scroll.
  - `prefersReducedMotion()` / `useReducedMotion()` — **toda animación debe respetar reduced motion** (los componentes existentes lo chequean siempre).
  - `useBodyLock(locked)`, `useEscape(fn)` — para menú y modal.
- Las animaciones por scroll mutan `element.style` directamente vía refs (no setState) para evitar re-renders.
- `RevealObserver`: cualquier elemento con `data-reveal="N"` aparece con fade+lift al entrar en viewport, con delay N×100ms. Solo afecta elementos debajo del fold al cargar.
- `Hero`: la pelota hace zoom hasta cubrir la pantalla al scrollear (`ballZoom`), y los elementos `data-herofade` se desvanecen.
- `Marquee`: loop rAF continuo cuya velocidad sube con la velocidad de scroll.
- `Projects`: filtro por categoría, vista `"list"` (usada) o `"grid"` (disponible, no usada), preview flotante que sigue al cursor (solo dispositivos con hover y ≥760px) y `ProjectModal` con foco gestionado, Escape y "Siguiente proyecto".
- Accesibilidad cuidada: `aria-pressed`, `aria-expanded`/`aria-controls`, `inert` en acordeones cerrados, `role="dialog"` + `aria-modal`, decorativos con `aria-hidden`. Mantener ese nivel.

## Estado del repo

Git con un solo commit (el de create-next-app); todo el trabajo actual está sin commitear. El `README.md` es el default de create-next-app.
