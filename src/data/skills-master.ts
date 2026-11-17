import type { ResumeContent } from "@/lib/types";
import { RESUME_EN } from "./resume-data.en";
import { RESUME_ES } from "./resume-data.es";

/**
 * ⛔ LA FRONTERA DE LA GUARDA ANTI-INVENCION.
 *
 * `assertNoFabrication` rechaza cualquier skill, badge o tecnologia que la IA ponga en el CV
 * adaptado y que NO este en esta lista. Agregar algo aca es afirmar que se sabe; es la unica
 * decision del repo que puede convertirse en una mentira en una entrevista.
 *
 * No se escribe a mano: se DERIVA de lo que el CV ya dice, en los dos idiomas. Asi no puede
 * desincronizarse del contenido.
 */

const techOf = (r: ResumeContent): string[] => [
  ...r.skills,
  ...r.work.flatMap((w) => w.badges),
  ...r.projects.flatMap((p) => p.techStack),
];

/**
 * Tecnologias que se dominan pero que el CV no lista, y sinonimos que una oferta puede usar.
 *
 * ⚠ PENDIENTE DE DECISION (17-11-2026): la plantilla de correo que se venia usando declara
 * "Go, Java, Spring Boot", y el CV de 2026 NO los lista en ninguna parte. Hasta que Sleiter
 * confirme, NO entran: la guarda es mas util estricta que generosa, y el costo de un falso
 * negativo (la IA no puede nombrar algo que si sabes) es muchisimo menor que el de un falso
 * positivo (el CV afirma algo que no sostenes en la entrevista).
 */
const EXTRA_APPROVED: readonly string[] = [];

export const SKILLS_MASTER: readonly string[] = [
  ...new Set([...techOf(RESUME_EN), ...techOf(RESUME_ES), ...EXTRA_APPROVED]),
]
  .filter((t) => !/^Remot[eo]/.test(t))
  .sort((a, b) => a.localeCompare(b));

const normalize = (t: string) => t.toLowerCase().replace(/[\s._/-]/g, "");

const MASTER_SET = new Set(SKILLS_MASTER.map(normalize));

/** True si la IA puede nombrar esta tecnologia en el CV adaptado. */
export const isApprovedSkill = (tech: string): boolean =>
  MASTER_SET.has(normalize(tech));
