import { z } from "zod";

/**
 * El CONTRATO con el modelo. Todo lo que la IA devuelve pasa por aca antes de
 * tocar una vista: no escribe HTML, emite datos que los mismos componentes del
 * CV publico renderizan.
 */

const trimmed = z.string().trim().min(1);

/** Lo que se entendio de la oferta. Paso 1. */
export const jobSpecSchema = z.object({
  company: trimmed,
  role: trimmed,
  /** Idioma en el que esta escrita la oferta: decide en que idioma sale el CV. */
  locale: z.enum(["en", "es"]),
  /** El foco que la vacante pide. Manda sobre el rotulo y sobre el correo. */
  focus: z.enum(["backend", "fullstack", "frontend"]),
  seniority: trimmed.nullable(),
  location: trimmed.nullable(),
  /** Modalidad tal como la oferta la declara; `null` si no la declara. */
  workMode: z.enum(["remote", "hybrid", "onsite"]).nullable(),
  /**
   * LAS PALABRAS CLAVE, en el orden en que la oferta las prioriza. Es el insumo
   * de todo lo demas: lo que se resalta, lo que se ordena y lo que se limpia.
   */
  mustHave: z.array(trimmed).max(30),
  niceToHave: z.array(trimmed).max(30),
  responsibilities: z.array(trimmed).max(20),
  /** Lo que el reclutador remarco y conviene responder en el correo. */
  emphasis: z.array(trimmed).max(10),
});
export type JobSpec = z.infer<typeof jobSpecSchema>;

const workEntrySchema = z.object({
  company: trimmed,
  link: z.string().url().optional(),
  badges: z.array(trimmed),
  title: trimmed,
  start: trimmed,
  end: trimmed.nullable(),
  description: trimmed,
  highlights: z.array(trimmed).optional(),
});

const projectSchema = z.object({
  title: trimmed,
  techStack: z.array(trimmed),
  description: trimmed,
  link: z.string().url().optional(),
});

const educationSchema = z.object({
  school: trimmed,
  degree: trimmed,
  start: trimmed.optional(),
  end: trimmed.nullable().optional(),
});

/** El CV adaptado: la MISMA forma que el CV escrito a mano, sin un campo nuevo. */
export const tailoredContentSchema = z.object({
  name: trimmed,
  location: trimmed,
  locationLink: z.string().url(),
  about: trimmed,
  summary: trimmed,
  siteUrl: z.string().url(),
  personalWebsiteUrl: z.string().url().optional(),
  contact: z.object({
    email: trimmed,
    tel: trimmed,
    social: z.array(
      z.object({
        name: trimmed,
        url: z.string().url(),
        icon: z.enum(["github", "linkedin", "x", "leetcode"]),
      })
    ),
  }),
  education: z.array(educationSchema),
  work: z.array(workEntrySchema),
  skills: z.array(trimmed),
  projects: z.array(projectSchema),
});

export const tailoredResumeSchema = z.object({
  resume: tailoredContentSchema,
  /**
   * Las competencias que la oferta pide Y el CV ya tenia. Se renderizan
   * RESALTADAS. ⛔ Tienen que ser un subconjunto de `resume.skills`: resaltar
   * algo que no esta en la lista seria afirmarlo dos veces y tenerlo cero.
   */
  highlighted: z.array(trimmed).max(20),
  /** Un renglon por cambio, en lenguaje llano, para poder aceptarlo o tirarlo. */
  changelog: z.array(
    z.object({
      field: trimmed,
      change: trimmed,
      reason: trimmed,
    })
  ),
  /**
   * ⭐ Lo que la oferta pide y el CV NO tiene. Se muestra DE FRENTE: sirve para
   * preparar la entrevista, y esconderlo seria el antipatron del producto.
   */
  gaps: z.array(trimmed).max(15),
  matchScore: z.number().int().min(0).max(100),
});
export type TailoredResume = z.infer<typeof tailoredResumeSchema>;

/** El correo. Paso 2. */
export const applicationEmailSchema = z.object({
  subject: trimmed,
  body: trimmed,
  /** Marcadores que quedaron sin rellenar y los tiene que completar la PERSONA. */
  pendingPlaceholders: z.array(trimmed),
});
export type ApplicationEmail = z.infer<typeof applicationEmailSchema>;
