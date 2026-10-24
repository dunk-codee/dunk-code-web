"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyLock, useEscape } from "@/lib/hooks";

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
        className="relative max-h-[calc(100vh-32px)] w-full max-w-[980px] animate-modal-up overflow-auto rounded-[28px] bg-paper"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-[2] size-11 rounded-full bg-ink font-mono text-lg text-paper"
        >
          ✕
        </button>
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
            {/* Botones debajo del título para que se vean sin scrollear el modal. */}
            <div className="mt-3 flex flex-wrap gap-2.5">
              <a
                href={project.url ?? "#"}
                target={project.url ? "_blank" : undefined}
                rel="noreferrer"
                aria-disabled={!project.url}
                className="flex h-12 items-center rounded-full bg-ink px-[22px] text-[15px] font-medium text-paper hover:bg-ink-2 aria-disabled:pointer-events-none aria-disabled:opacity-60"
              >
                {urlLabel} ↗
              </a>
              {children}
              {onNext && (
                <button
                  type="button"
                  onClick={onNext}
                  className="h-12 rounded-full border border-ink px-[22px] text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  {nextLabel} →
                </button>
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
