"use client";

import { useEffect, useRef, useState, useTransition, type CSSProperties, type ReactNode } from "react";
import { sendContact } from "@/app/actions";
import { TIPOS, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact-schema";
import { at } from "@/lib/motion";
import { Ball } from "./ball";
import { RollText } from "./hero";

const EMPTY: ContactInput = { name: "", email: "", tipo: "Sitio web", msg: "" };

const fieldClass = "peer block w-full border-0 bg-transparent py-2.5 text-paper outline-none";

/** Momento (ms) en que entra cada parte del formulario. */
const T = { name: 0, email: 140, tipo: 280, msg: 380 + TIPOS.length * 90, send: 560 + TIPOS.length * 90 };

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();
  const tipoList = useRef<HTMLDivElement>(null);
  const tipoBar = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const prefilled = useRef("");

  // "Quiero uno así" en las demos precarga el pedido; no pisa un mensaje que la persona ya escribió.
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const { tipo, msg } = (e as CustomEvent<Pick<ContactInput, "tipo" | "msg">>).detail;
      const prev = prefilled.current;
      prefilled.current = msg;
      setSent(false);
      setErrors({});
      setForm((f) => ({ ...f, tipo, msg: !f.msg.trim() || f.msg === prev ? msg : f.msg }));
      requestAnimationFrame(() => nameRef.current?.focus({ preventScroll: true }));
    };
    addEventListener("contact:prefill", onPrefill);
    return () => removeEventListener("contact:prefill", onPrefill);
  }, []);

  // Lleva la barra naranja debajo de la opción elegida (con offsets: no los afectan las animaciones de entrada).
  useEffect(() => {
    const list = tipoList.current;
    const bar = tipoBar.current;
    if (!list || !bar) return;
    const place = () => {
      const btn = list.querySelector<HTMLElement>('[aria-pressed="true"]');
      if (!btn) return;
      let left = 0;
      for (let el: HTMLElement | null = btn; el && el !== list; el = el.offsetParent as HTMLElement | null) left += el.offsetLeft;
      bar.style.left = `${left}px`;
      bar.style.width = `${btn.offsetWidth}px`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(list);
    return () => ro.disconnect();
  }, [form.tipo, sent]);

  const set = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const local = validateContact(form);
    if (local.errors) return setErrors(local.errors);
    setErrors({});
    startTransition(async () => {
      const res = await sendContact(form);
      if (res.ok) setSent(true);
      else setErrors(res.errors);
    });
  };

  if (sent) {
    return (
      <div role="status" className="flex animate-fade flex-col gap-[22px] py-2">
        <div className="size-16 animate-thanks-drop motion-reduce:animate-none">
          <Ball />
        </div>
        <h3 className="m-0 text-[clamp(34px,4vw,52px)] leading-none font-bold tracking-[-0.045em]">
          ¡Gracias, {form.name.trim().split(" ")[0]}!
        </h3>
        <p className="m-0 max-w-[420px] text-lg leading-[1.55] text-line">
          Recibimos tu mensaje. Te escribimos a <span className="font-mono text-paper">{form.email}</span>.
        </p>
        <button
          type="button"
          onClick={() => { setForm(EMPTY); setSent(false); }}
          className="h-[46px] self-start rounded-full border border-muted px-5 font-mono text-[13px] font-medium text-paper hover:border-paper"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-[30px]">
      <label className="flex flex-col gap-2">
        <span className="in-rise label-mono text-subtle" style={at(T.name)}>Nombre</span>
        <Line at={T.name} error={!!errors.name}>
          <input
            ref={nameRef}
            type="text"
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="¿Cómo te llamás?"
            aria-invalid={!!errors.name}
            className={`in-rise text-[22px] leading-[1.3] ${fieldClass}`}
            style={at(T.name + 120)}
          />
        </Line>
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </label>

      <label className="flex flex-col gap-2">
        <span className="in-rise label-mono text-subtle" style={at(T.email)}>Email</span>
        <Line at={T.email} error={!!errors.email}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="vos@tunegocio.com"
            aria-invalid={!!errors.email}
            className={`in-rise text-[22px] leading-[1.3] ${fieldClass}`}
            style={at(T.email + 120)}
          />
        </Line>
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </label>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="in-rise label-mono mb-3 p-0 text-subtle" style={at(T.tipo)}>¿Qué necesitás?</legend>
        {/* Lista horizontal sobre una línea, como los inputs: la barra naranja se desliza hasta la opción elegida. */}
        <div ref={tipoList} className="relative flex w-fit max-w-full flex-wrap gap-x-7 gap-y-2 pb-2.5">
          {TIPOS.map((t, i) => {
            const active = form.tipo === t;
            return (
              <Burst key={t} at={T.tipo + 100 + i * 90} w={t.length * 12} h={30}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => set("tipo", t)}
                  className={`py-1 text-[clamp(20px,2vw,24px)] font-medium tracking-[-0.02em] whitespace-nowrap transition-colors duration-250 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange ${active ? "text-paper" : "text-subtle hover:text-paper"}`}
                >
                  {t}
                </button>
              </Burst>
            );
          })}
          <span aria-hidden className="in-line absolute inset-x-0 bottom-0 h-px origin-left bg-muted" style={at(T.tipo + 60)} />
          <span
            ref={tipoBar}
            aria-hidden
            className="in-line absolute bottom-0 left-0 h-0.5 w-0 origin-left bg-orange transition-[left,width] duration-500 ease-snap"
            style={at(T.tipo + 200 + TIPOS.length * 90)}
          />
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="in-rise label-mono text-subtle" style={at(T.msg)}>Mensaje</span>
        <Line at={T.msg} error={!!errors.msg}>
          <textarea
            name="msg"
            rows={4}
            value={form.msg}
            onChange={(e) => set("msg", e.target.value)}
            placeholder="Contanos un poco sobre tu proyecto"
            aria-invalid={!!errors.msg}
            className={`in-rise resize-none text-xl leading-[1.45] ${fieldClass}`}
            style={at(T.msg + 120)}
          />
        </Line>
        {errors.msg && <FieldError>{errors.msg}</FieldError>}
      </label>

      <Burst at={T.send} w={340} h={64} className="self-start">
        {/* Texto grande sin caja: la línea de abajo (como la de los inputs) se llena de naranja en hover y la flecha avanza. */}
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex items-center gap-[.5em] pt-1 pb-3 text-[clamp(30px,3.4vw,44px)] leading-none font-bold tracking-[-0.045em] text-paper outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-orange disabled:cursor-wait"
        >
          <RollText alt={pending ? "Enviando…" : "Hagámoslo"}>{pending ? "Enviando…" : "Enviar mensaje"}</RollText>
          <span aria-hidden className="grid w-[1.4em] place-items-center">
            {pending ? (
              <span className="size-[.5em] animate-spin rounded-full border-2 border-orange border-t-transparent" />
            ) : (
              <span className="font-mono font-medium text-orange transition-transform duration-500 ease-snap group-hover:translate-x-[.35em]">⟶</span>
            )}
          </span>
          <span aria-hidden className="in-line absolute inset-x-0 bottom-0 h-0.5 origin-left bg-muted" style={at(T.send + 300)} />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-orange transition-transform duration-600 ease-snap group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
        </button>
      </Burst>
    </form>
  );
}

/** Línea inferior del campo: se dibuja de izquierda a derecha al entrar y se enciende en blanco con el foco. */
function Line({ at: ms, error, children }: { at: number; error: boolean; children: ReactNode }) {
  return (
    <span className="relative block">
      {children}
      <span
        aria-hidden
        className={`in-line absolute inset-x-0 bottom-0 h-px origin-left transition-colors duration-250 ${error ? "bg-orange" : "bg-muted"}`}
        style={at(ms + 60)}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-paper transition-transform duration-500 ease-snap peer-focus:scale-x-100"
      />
    </span>
  );
}

const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];

/**
 * Aparición tipo explosión: un punto naranja late, estalla en chispas
 * y el botón se abre en círculo desde el centro. `w`/`h` = tamaño aproximado del botón,
 * para que las chispas salgan por fuera del borde.
 */
function Burst({ at: ms, w, h, className = "", children }: { at: number; w: number; h: number; className?: string; children: ReactNode }) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <span className="in-burst inline-flex" style={at(ms + 160)}>
        {children}
      </span>
      <span aria-hidden className="in-dot pointer-events-none absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5 hidden size-3 rounded-full bg-orange" style={at(ms)} />
      {SPARKS.map((a, i) => {
        const r = (a * Math.PI) / 180;
        const style = {
          "--x": `${Math.round(Math.cos(r) * (w / 2 + 16))}px`,
          "--y": `${Math.round(Math.sin(r) * (h / 2 + 14))}px`,
        } as CSSProperties;
        return (
          <span
            key={a}
            aria-hidden
            className={`in-spark pointer-events-none absolute top-1/2 left-1/2 -mt-[3px] -ml-[3px] hidden size-1.5 rounded-full ${i % 2 ? "bg-paper" : "bg-orange"}`}
            style={at(ms + 200, style)}
          />
        );
      })}
    </span>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-xs font-medium text-orange">{children}</span>;
}
