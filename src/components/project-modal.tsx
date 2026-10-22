"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@/lib/content";
import { useBodyLock, useEscape } from "@/lib/hooks";

export function ProjectModal({ project, onClose, onNext }: { project: Project; onClose: () => void; onNext: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useBodyLock(true);
  useEscape(onClose);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => prev?.focus();
  }, []);

  return (
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
        <div className="box-border flex aspect-[16/8] items-end border-b border-line bg-[repeating-linear-gradient(135deg,var(--color-sand)_0_14px,var(--color-paper)_14px_28px)] p-5 font-mono text-xs font-medium text-muted">
          {`// captura de ${project.name}`}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-12 gap-y-8 p-[clamp(24px,4vw,48px)]">
          <div className="flex flex-col gap-3.5">
            <span className="eyebrow text-orange-deep">
              {project.type} · {project.year}
            </span>
            <h3 id="project-title" className="m-0 text-[clamp(36px,5vw,64px)] leading-[.95] font-bold tracking-[-0.05em]">
              {project.name}
            </h3>
          </div>
          <div className="flex flex-col gap-6">
            <p className="m-0 text-lg leading-[1.55] text-pretty text-ink-2">{project.desc}</p>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((st) => (
                <span key={st} className="rounded-full bg-sand px-3 py-2 font-mono text-xs font-medium text-ink-2">
                  {st}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2.5">
              <a
                href={project.url ?? "#"}
                target={project.url ? "_blank" : undefined}
                rel="noreferrer"
                aria-disabled={!project.url}
                className="flex h-12 items-center rounded-full bg-ink px-[22px] text-[15px] font-medium text-paper hover:bg-ink-2 aria-disabled:pointer-events-none aria-disabled:opacity-60"
              >
                Visitar sitio ↗
              </a>
              <button
                type="button"
                onClick={onNext}
                className="h-12 rounded-full border border-ink px-[22px] text-[15px] font-medium text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Siguiente proyecto →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
