import { z } from "zod";

export const TIPOS = ["Sitio web", "App", "Sistema", "Otro"] as const;

// Shared by the client (instant feedback) and the Server Action (source of truth).
export const contactSchema = z.object({
  name: z.string().trim().min(1, "Contanos tu nombre."),
  email: z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Revisá el email."),
  tipo: z.enum(TIPOS),
  msg: z.string().trim().min(10, "Contanos un poco más (mínimo 10 caracteres)."),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export function validateContact(data: ContactInput) {
  const result = contactSchema.safeParse(data);
  if (result.success) return { data: result.data, errors: null };
  const fieldErrors = z.flattenError(result.error).fieldErrors;
  const errors: ContactErrors = {};
  for (const [k, v] of Object.entries(fieldErrors)) if (v?.[0]) errors[k as keyof ContactInput] = v[0];
  return { data: null, errors };
}
