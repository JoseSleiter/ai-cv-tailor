import { describe, expect, it } from "vitest";
import { RESUME_EN } from "@/data/resume-data.en";
import {
  assertNoFabrication,
  collectViolations,
  FabricationError,
} from "@/lib/apply/guard";
import type { TailoredResume } from "@/lib/apply/schemas";

/**
 * ⛔ Un control que solo prueba el camino feliz no controla nada.
 *
 * Cada caso de abajo es uno donde SE SABE la respuesta, y el ultimo —el
 * legitimo— es el que impide que la guarda se vuelva un "rechaza todo", que
 * pasaria todos los demas tests y seria inutil.
 */

const legit = (): TailoredResume => ({
  resume: structuredClone(RESUME_EN),
  highlighted: [],
  changelog: [],
  gaps: [],
  matchScore: 50,
});

describe("assertNoFabrication", () => {
  it("deja pasar el CV original sin tocar", () => {
    expect(collectViolations(RESUME_EN, legit())).toEqual([]);
  });

  it("deja pasar una seleccion: menos skills, menos proyectos, menos logros", () => {
    const t = legit();
    t.resume.skills = RESUME_EN.skills.slice(0, 5);
    t.resume.projects = RESUME_EN.projects.slice(0, 1);
    t.resume.work = t.resume.work.map((job) => ({
      ...job,
      highlights: (job.highlights ?? []).slice(0, 1),
      badges: job.badges.slice(0, 2),
    }));
    t.highlighted = t.resume.skills.slice(0, 2);
    expect(collectViolations(RESUME_EN, t)).toEqual([]);
  });

  it("deja pasar un REORDEN de competencias", () => {
    const t = legit();
    t.resume.skills = [...RESUME_EN.skills].reverse();
    expect(collectViolations(RESUME_EN, t)).toEqual([]);
  });

  it("caza una empresa inventada", () => {
    const t = legit();
    t.resume.work = [{ ...t.resume.work[0], company: "Google" }];
    expect(collectViolations(RESUME_EN, t)).toContain(
      'la empresa "Google" no esta en el CV'
    );
  });

  it("caza una fecha cambiada", () => {
    const t = legit();
    t.resume.work[0] = { ...t.resume.work[0], start: "Jan 2018" };
    expect(collectViolations(RESUME_EN, t).join(" ")).toMatch(/fechas de/);
  });

  it("caza un cargo inflado", () => {
    const t = legit();
    t.resume.work[0] = { ...t.resume.work[0], title: "Engineering Manager" };
    expect(collectViolations(RESUME_EN, t).join(" ")).toMatch(
      /Engineering Manager/
    );
  });

  it("caza una competencia fuera de SKILLS_MASTER", () => {
    const t = legit();
    t.resume.skills = [...t.resume.skills, "Kotlin"];
    expect(collectViolations(RESUME_EN, t)).toContain(
      'la competencia "Kotlin" no esta en SKILLS_MASTER'
    );
  });

  it("caza un badge que el CV si tiene, pero en OTRO trabajo", () => {
    const [first, second] = RESUME_EN.work;
    const foreign = second.badges.find((b) => !first.badges.includes(b));
    expect(foreign).toBeDefined();
    const t = legit();
    t.resume.work[0] = {
      ...t.resume.work[0],
      badges: [...first.badges, foreign as string],
    };
    expect(collectViolations(RESUME_EN, t).join(" ")).toContain(
      foreign as string
    );
  });

  it("caza un logro reescrito, aunque solo cambie una palabra", () => {
    const t = legit();
    const job = t.resume.work.find((w) => (w.highlights ?? []).length > 0);
    if (!job?.highlights) throw new Error("fixture sin logros");
    job.highlights = [`${job.highlights[0]} and led the team`];
    expect(collectViolations(RESUME_EN, t).join(" ")).toMatch(/no esta en el CV/);
  });

  it("caza un resalte que no esta entre las competencias", () => {
    const t = legit();
    t.resume.skills = ["TypeScript"];
    t.highlighted = ["Kubernetes"];
    expect(collectViolations(RESUME_EN, t)).toContain(
      'resalta "Kubernetes", que no esta entre las competencias del CV'
    );
  });

  it("caza un cambio en el contacto o en los campos inmutables", () => {
    const t = legit();
    t.resume.contact = { ...t.resume.contact, email: "otro@example.com" };
    t.resume.name = "Jose S. Rios";
    const out = collectViolations(RESUME_EN, t);
    expect(out).toContain("cambio el correo o el telefono de contacto");
    expect(out).toContain("cambio `name`, que es inmutable");
  });

  it("levanta FabricationError con TODAS las violaciones, no la primera", () => {
    const t = legit();
    t.resume.work = [{ ...t.resume.work[0], company: "Google" }];
    t.resume.skills = [...t.resume.skills, "Kotlin", "Elixir"];
    try {
      assertNoFabrication(RESUME_EN, t);
      expect.unreachable("tenia que fallar");
    } catch (error) {
      expect(error).toBeInstanceOf(FabricationError);
      expect((error as FabricationError).violations.length).toBeGreaterThan(2);
    }
  });

  /**
   * ⚠ El limite CONOCIDO de la guarda, escrito como test para que nadie crea
   * que cubre mas de lo que cubre: una cifra inventada usa solo palabras
   * aprobadas y pasa.
   */
  it("NO ve una cifra inventada en el perfil: es el limite declarado", () => {
    const t = legit();
    t.resume.summary = "Senior Engineer who cut latency by 94% across 12 teams.";
    expect(collectViolations(RESUME_EN, t)).toEqual([]);
  });
});
