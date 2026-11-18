import { isApprovedSkill } from "@/data/skills-master";
import type { ResumeContent } from "@/lib/types";
import type { TailoredResume } from "./schemas";

/**
 * ⛔⛔ LA GUARDA ANTI-INVENCION.
 *
 * Es una VERIFICACION POSTERIOR, no una instruccion en el prompt. Un prompt
 * pide; esto comprueba. Si el CV adaptado afirma una empresa, una fecha, un
 * cargo o una tecnologia que el CV original no tiene, no se genera PDF.
 *
 * ⚠ LO QUE ESTA GUARDA NO VE, y hay que saberlo: una CIFRA. "redujo la latencia
 * un 40%" usa solo palabras aprobadas y es igual de inventado. Por eso el
 * changelog es revisable y el humano aprueba antes de exportar — la guarda es la
 * red, no el control de calidad.
 */

export class FabricationError extends Error {
  readonly violations: string[];
  constructor(violations: string[]) {
    super(
      `El CV adaptado afirma cosas que el original no dice:\n- ${violations.join("\n- ")}`
    );
    this.name = "FabricationError";
    this.violations = violations;
  }
}

const norm = (t: string) => t.toLowerCase().replace(/[\s._/-]/g, "");

/** Campos que la IA no puede tocar: son identidad, no contenido adaptable. */
const IMMUTABLE = [
  "name",
  "location",
  "locationLink",
  "siteUrl",
  "personalWebsiteUrl",
] as const;

export function collectViolations(
  original: ResumeContent,
  tailored: TailoredResume
): string[] {
  const out: string[] = [];
  const { resume } = tailored;

  for (const field of IMMUTABLE) {
    if (resume[field] !== original[field]) {
      out.push(`cambio \`${field}\`, que es inmutable`);
    }
  }
  if (
    resume.contact.email !== original.contact.email ||
    resume.contact.tel !== original.contact.tel
  ) {
    out.push("cambio el correo o el telefono de contacto");
  }

  const jobs = new Map(original.work.map((w) => [norm(w.company), w] as const));
  for (const job of resume.work) {
    const source = jobs.get(norm(job.company));
    if (!source) {
      out.push(`la empresa "${job.company}" no esta en el CV`);
      continue;
    }
    if (job.title !== source.title) {
      out.push(
        `el cargo en ${job.company} dice "${job.title}" y el CV dice "${source.title}"`
      );
    }
    if (job.start !== source.start || job.end !== source.end) {
      out.push(`cambio las fechas de ${job.company}`);
    }
    const known = new Set((source.highlights ?? []).map(norm));
    for (const line of job.highlights ?? []) {
      if (!known.has(norm(line))) {
        out.push(`un logro de ${job.company} no esta en el CV: "${line}"`);
      }
    }
    /**
     * ⚠ Los badges NO se miden contra `SKILLS_MASTER` sino contra los del
     * MISMO trabajo, y es mas estricto, no menos: la IA solo puede quedarse con
     * los que ya estaban. Ahi viven ademas la modalidad y el pais
     * ("Remote (Chile)"), que no son competencias y que la lista maestra excluye
     * a proposito — medido el 18-11-2026: sin esto la guarda rechazaba el CV
     * SIN TOCAR, que es el peor falso positivo posible.
     */
    const badges = new Set(source.badges.map(norm));
    for (const badge of job.badges) {
      if (!badges.has(norm(badge))) {
        out.push(`un badge de ${job.company} no esta en el CV: "${badge}"`);
      }
    }
  }

  const schools = new Set(original.education.map((e) => norm(e.school)));
  for (const entry of resume.education) {
    if (!schools.has(norm(entry.school))) {
      out.push(`la formacion "${entry.school}" no esta en el CV`);
    }
  }

  const projects = new Map(
    original.projects.map((p) => [norm(p.title), p] as const)
  );
  for (const project of resume.projects) {
    const source = projects.get(norm(project.title));
    if (!source) {
      out.push(`el proyecto "${project.title}" no esta en el CV`);
      continue;
    }
    const stack = new Set(source.techStack.map(norm));
    for (const tech of project.techStack) {
      if (!stack.has(norm(tech))) {
        out.push(`"${tech}" no esta en el stack de ${project.title}`);
      }
    }
  }

  /**
   * Las COMPETENCIAS si se miden contra la lista maestra, que es la frontera
   * declarada de lo afirmable. Es el unico lugar donde la IA podria nombrar algo
   * que el CV no tiene en ningun item concreto.
   */
  for (const item of new Set(resume.skills)) {
    if (!isApprovedSkill(item)) {
      out.push(`la competencia "${item}" no esta en SKILLS_MASTER`);
    }
  }

  const declared = new Set(resume.skills.map(norm));
  for (const item of tailored.highlighted) {
    if (!declared.has(norm(item))) {
      out.push(`resalta "${item}", que no esta entre las competencias del CV`);
    }
  }

  return out;
}

export function assertNoFabrication(
  original: ResumeContent,
  tailored: TailoredResume
): void {
  const violations = collectViolations(original, tailored);
  if (violations.length > 0) throw new FabricationError(violations);
}
