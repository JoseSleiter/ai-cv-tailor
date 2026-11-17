import type { Locale, LocaleLabels, ResumeData } from "@/lib/types";
import avatar from "./avatar.jpg";
import { RESUME_EN } from "./resume-data.en";
import { RESUME_ES } from "./resume-data.es";

/**
 * El CV esta escrito a mano en DOS idiomas.
 *
 * ⛔ La IA NO traduce: elige el idioma segun la oferta y adapta sobre la redaccion que ya
 * existe. Traducir con IA teniendo las dos versiones propias pierde la voz del autor, y una
 * traduccion automatica de un CV se nota.
 */
export const RESUME_BY_LOCALE = {
  en: RESUME_EN,
  es: RESUME_ES,
} as const satisfies Record<Locale, unknown>;

export const DEFAULT_LOCALE: Locale = "en";

export const LABELS: Record<Locale, LocaleLabels> = {
  en: {
    sections: {
      summary: "About",
      work: "Work Experience",
      education: "Education",
      skills: "Skills",
      projects: "Side projects",
    },
    present: "Present",
  },
  es: {
    sections: {
      summary: "Perfil",
      work: "Experiencia profesional",
      education: "Formación",
      skills: "Competencias técnicas",
      projects: "Proyectos propios",
    },
    present: "Actualidad",
  },
};

/** El CV por defecto, con el avatar enganchado. Es lo que renderiza la home publica. */
export const RESUME_DATA: ResumeData = {
  ...RESUME_BY_LOCALE[DEFAULT_LOCALE],
  avatar,
};

/**
 * ⚠ Compatibilidad con los componentes del template, que todavia importan los rotulos
 * directamente. La Fase 1 del plan hace que el idioma viaje por parametro y esto se va.
 */
export const SECTION_TITLES = LABELS[DEFAULT_LOCALE].sections;
