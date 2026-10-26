import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Bots de buscadores con IA y asistentes (GEO): se los deja pasar explícitamente para que el estudio
// aparezca citado en ChatGPT, Claude, Perplexity, Gemini, Copilot, etc.
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "meta-externalagent",
  "MistralAI-User",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Next sirve los JS/CSS desde /_next: no bloquearlos, Google los necesita para renderizar la página.
      { userAgent: "*", allow: "/" },
      { userAgent: AI_BOTS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
