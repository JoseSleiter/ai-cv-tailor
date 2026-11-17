import type { ResumeData } from "@/lib/types";

/**
 * Lo que NO cambia entre idiomas ni entre postulaciones.
 *
 * ⛔ La guarda anti-invencion trata estos campos como INMUTABLES: la IA no puede tocarlos.
 */

// TODO(sleiter): reemplazar por el dominio propio cuando este desplegado.
export const SITE_URL = "https://ai-cv-tailor.vercel.app";

export const CONTACT: ResumeData["contact"] = {
  email: "sleiter.js@gmail.com",
  tel: "+573217529305",
  social: [
    {
      name: "GitHub",
      url: "https://github.com/JoseSleiter",
      icon: "github",
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/jose-sleiter-rios/",
      icon: "linkedin",
    },
  ],
};
