import type { ResumeData, SocialLink } from "@/lib/types";

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

/**
 * Perfiles OPCIONALES: viven en la web y NUNCA en el PDF.
 *
 * ⛔ Estan FUERA de `CONTACT.social` a proposito, no con una clase de CSS: todo
 * lo que entra ahi lo imprime `PrintContact` y lo exporta `getContactLinks`. Un
 * enlace que solo se mira en pantalla se decide en la ESTRUCTURA del dato, que
 * es lo unico que no se olvida al tocar una vista.
 *
 * ⚠ Y por lo mismo quedan fuera de lo que viaja a la IA: no son parte del CV.
 */
export const PROFILE_LINKS: readonly SocialLink[] = [
  {
    name: "LeetCode",
    url: "https://leetcode.com/u/josesleiter/",
    icon: "leetcode",
  },
];
