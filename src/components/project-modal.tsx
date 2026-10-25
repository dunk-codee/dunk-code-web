"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyLock, useEscape } from "@/lib/hooks";
import { PillCta } from "./cta";

/** Lo que muestra el modal; lo usan tanto los proyectos como las demos. */
export type ModalItem = {
  name: string;
  meta: string;
  desc: string;
  tags: string[];
  url?: string;
  images?: { src: string; alt: string }[];
};

export function ProjectModal({
  project,
  onClose,
  onNext,
  nextLabel = "Siguiente proyecto",
  urlLabel = "Visitar sitio",
  children,
}: {
  project: ModalItem;
  onClose: () => void;
  onNext?: () => void;
  nextLabel?: string;
  urlLabel?: string;
  /** Acciones extra al lado de los botones. */
  children?: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const images = project.images ?? [];
  const [shot, setShot] = useState(0);
  useBodyLock(true);
  useEscape(onClose);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => prev?.focus();
  }, []);

  // Portal a <body> para que el stacking context de la sección de proyectos no lo deje debajo de las secciones siguientes.
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-80 flex animate-fade items-center justify-center bg-ink/60 p-4 backdrop-blur-[8px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[calc(100vh-32px)] w-full max-w-[980px] animate-modal-up overflow-auto rounded-[28px] bg-paper [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Capa pegajosa de alto cero: la X queda fija arriba aunque se scrollee el modal (en mobile se scrollea mucho). */}
        <div className="pointer-events-none sticky top-0 z-[2] h-0">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="group pointer-events-auto absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-orange text-ink shadow-[0_6px_18px_-6px_color-mix(in_srgb,var(--color-ink)_50%,transparent)] transition-transform duration-500 ease-snap hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange"
          >
            {/* Como el círculo de "Ver el caso": naranja con el ícono en tinta; en hover la X gira un cuarto de vuelta. */}
            <svg aria-hidden viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" className="block w-3.5 transition-transform duration-500 ease-snap group-hover:rotate-90">
              <path d="M2 2L12 12M12 2L2 12" />
            </svg>
          </button>
        </div>
        {images.length ? (
          <div className="border-b border-line bg-sand">
            <div className="relative aspect-[16/8]">
              <Image
                key={images[shot].src}
                src={images[shot].src}
                alt={images[shot].alt}
                fill
                sizes="(min-width: 1012px) 980px, 100vw"
                className="animate-fade object-cover object-top"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 p-3">
                {images.map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={`Ver captura ${i + 1}: ${img.alt}`}
                    aria-pressed={shot === i}
                    className={`relative aspect-[16/8] w-24 overflow-hidden rounded-lg border-2 transition-colors ${shot === i ? "border-ink" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <Image src={img.src} alt="" fill sizes="96px" className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="box-border flex aspect-[16/8] items-end border-b border-line bg-[repeating-linear-gradient(135deg,var(--color-sand)_0_14px,var(--color-paper)_14px_28px)] p-5 font-mono text-xs font-medium text-muted">
            {`// captura de ${project.name}`}
          </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-12 gap-y-8 p-[clamp(24px,4vw,48px)]">
          <div className="flex flex-col gap-3.5">
            <span className="eyebrow text-orange-deep">
              {project.meta}
            </span>
            <h3 id="project-title" className="m-0 text-[clamp(36px,5vw,64px)] leading-[.95] font-bold tracking-[-0.05em]">
              {project.name}
            </h3>
            {/* Acciones debajo del título, para que se vean sin scrollear el modal: píldoras con el efecto de
                "Hablemos" del nav. Si hay una acción propia (las demos: "Quiero uno así") esa es la llena. */}
            <div className="mt-4 flex flex-wrap gap-2.5">
              {children}
              {project.url && (
                <PillCta href={project.url} globe variant={children ? "outline" : "solid"}>
                  {urlLabel}
                </PillCta>
              )}
              {onNext && (
                <PillCta onClick={onNext} icon="right" variant="outline">
                  {nextLabel}
                </PillCta>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <p className="m-0 text-lg leading-[1.55] text-pretty text-ink-2">{project.desc}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((st) => (
                <span key={st} className="rounded-full bg-sand px-3 py-2 font-mono text-xs font-medium text-ink-2">
                  {st}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
