import type { Locale, LocaleLabels, ResumeData } from "@/lib/types";
import avatar from "./avatar.jpg";
import { RESUME_EN } from "./resume-data.en";
import { RESUME_ES } from "./resume-data.es";
import {
  DEFAULT_FOCUS,
  orderSkillsFor,
  ROLE_FOCUS,
  type RoleFocus,
} from "./role-focus";

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
    ui: {
      language: "Language",
      theme: {
        system: "Theme: follow the system",
        light: "Theme: light",
        dark: "Theme: dark",
      },
    },
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
    ui: {
      language: "Idioma",
      theme: {
        system: "Tema: seguir al sistema",
        light: "Tema: claro",
        dark: "Tema: oscuro",
      },
    },
  },
};

/** Devuelve el CV de un idioma con el avatar enganchado, listo para renderizar. */
export const resumeFor = (locale: Locale): ResumeData => ({
  ...RESUME_BY_LOCALE[locale],
  avatar,
});

/** El CV por defecto. Es lo que renderizan la home publica y los exportes de texto. */
export const RESUME_DATA: ResumeData = resumeFor(DEFAULT_LOCALE);

/**
 * ⚠ Compatibilidad con los componentes del template, que todavia importan los rotulos
 * directamente. La Fase 1 del plan hace que el idioma viaje por parametro y esto se va.
 */
export const SECTION_TITLES = LABELS[DEFAULT_LOCALE].sections;

/**
 * El CV visto desde el FOCO que pide la vacante.
 *
 * ⛔ No fabrica nada: cambia el rotulo, el parrafo de perfil y el ORDEN de las
 * competencias. Las empresas, fechas, titulos y tecnologias son las mismas, asi
 * que `assertNoFabrication` lo ve como un subconjunto valido del original.
 */
export const resumeWithFocus = (
  locale: Locale,
  focus: RoleFocus = DEFAULT_FOCUS
): ResumeData => {
  const base = resumeFor(locale);
  const profile = ROLE_FOCUS[locale][focus];
  return {
    ...base,
    about: `${profile.headline} · ${base.about.split(" · ").at(-1)}`,
    summary: profile.summary,
    skills: orderSkillsFor(base.skills, profile),
  };
};
