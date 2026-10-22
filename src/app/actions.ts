"use server";

import { validateContact, type ContactErrors, type ContactInput } from "@/lib/contact-schema";

export type ContactResult = { ok: true } | { ok: false; errors: ContactErrors };

export async function sendContact(input: ContactInput): Promise<ContactResult> {
  const { data, errors } = validateContact(input);
  if (!data) return { ok: false, errors };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    // Todavía no hay proveedor de mail configurado: se loguea para que el desarrollo local funcione igual.
    console.info("[contacto]", data);
    return { ok: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "Dunk Code <onboarding@resend.dev>",
      to,
      reply_to: data.email,
      subject: `Nuevo contacto: ${data.name} (${data.tipo})`,
      text: `${data.name} <${data.email}>\nNecesita: ${data.tipo}\n\n${data.msg}`,
    }),
  });
  if (!res.ok) {
    console.error("[contacto] Resend error", res.status, await res.text());
    return { ok: false, errors: { msg: "No pudimos enviar el mensaje. Probá de nuevo en un rato." } };
  }
  return { ok: true };
}
