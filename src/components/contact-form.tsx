"use client";

import { useState, useTransition } from "react";
import { sendContact } from "@/app/actions";
import { TIPOS, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact-schema";
import { Ball } from "./ball";

const EMPTY: ContactInput = { name: "", email: "", tipo: "Sitio web", msg: "" };

const fieldClass = (hasError: boolean) =>
  `border-0 border-b bg-transparent py-2.5 text-paper outline-none transition-colors duration-250 focus:border-paper ${hasError ? "border-orange" : "border-muted"}`;

export function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

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
        <span className="label-mono text-subtle">Nombre</span>
        <input
          type="text"
          name="name"
          autoComplete="name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="¿Cómo te llamás?"
          aria-invalid={!!errors.name}
          className={`text-[22px] leading-[1.3] ${fieldClass(!!errors.name)}`}
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </label>

      <label className="flex flex-col gap-2">
        <span className="label-mono text-subtle">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="vos@tunegocio.com"
          aria-invalid={!!errors.email}
          className={`text-[22px] leading-[1.3] ${fieldClass(!!errors.email)}`}
        />
        {errors.email && <FieldError>{errors.email}</FieldError>}
      </label>

      <fieldset className="m-0 flex flex-col gap-3 border-0 p-0">
        <legend className="label-mono mb-3 p-0 text-subtle">¿Qué necesitás?</legend>
        <div className="flex flex-wrap gap-2">
          {TIPOS.map((t) => {
            const active = form.tipo === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => set("tipo", t)}
                className={`h-10 rounded-full border px-4 font-mono text-[13px] font-medium transition-colors duration-250 ${active ? "border-paper bg-paper text-ink" : "border-muted text-paper hover:border-paper"}`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="label-mono text-subtle">Mensaje</span>
        <textarea
          name="msg"
          rows={4}
          value={form.msg}
          onChange={(e) => set("msg", e.target.value)}
          placeholder="Contanos un poco sobre tu proyecto"
          aria-invalid={!!errors.msg}
          className={`resize-y text-xl leading-[1.45] ${fieldClass(!!errors.msg)}`}
        />
        {errors.msg && <FieldError>{errors.msg}</FieldError>}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-[58px] items-center gap-3.5 self-start rounded-full bg-paper px-7 text-[17px] font-medium text-ink transition-[transform,background-color] duration-250 hover:-translate-y-0.5 hover:bg-white disabled:cursor-wait"
      >
        <span className={`inline-block size-3.5 rounded-full bg-orange ${pending ? "animate-[spin_.6s_linear_infinite]" : ""}`} />
        {pending ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-xs font-medium text-orange">{children}</span>;
}
