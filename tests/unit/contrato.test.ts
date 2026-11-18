import { describe, expect, it } from "vitest";
import { RESUME_EN } from "@/data/resume-data.en";
import { RESUME_ES } from "@/data/resume-data.es";
import { resumeWithFocus } from "@/data/resume-data";
import { ROLE_FOCUS } from "@/data/role-focus";
import { isApprovedSkill, SKILLS_MASTER } from "@/data/skills-master";
import { VOICE_SAMPLES } from "@/data/voice-samples";
import { hasReadableContent, jobOfferSchema } from "@/lib/apply/job-offer";
import { jobSpecSchema, tailoredResumeSchema } from "@/lib/apply/schemas";

describe("el contrato de la IA", () => {
  it("rechaza un JobSpec con idioma o foco que no existen", () => {
    const base = { company: "A", role: "B", locale: "en", focus: "fullstack", seniority: null, location: null, workMode: null, mustHave: [], niceToHave: [], responsibilities: [], emphasis: [] };
    expect(jobSpecSchema.safeParse(base).success).toBe(true);
    expect(jobSpecSchema.safeParse({ ...base, locale: "pt" }).success).toBe(false);
    expect(jobSpecSchema.safeParse({ ...base, focus: "devops" }).success).toBe(false);
  });

  it("rechaza strings vacios o de puro espacio donde se espera contenido", () => {
    const base = { company: "   ", role: "B", locale: "en", focus: "backend", seniority: null, location: null, workMode: null, mustHave: [], niceToHave: [], responsibilities: [], emphasis: [] };
    expect(jobSpecSchema.safeParse(base).success).toBe(false);
  });

  it("rechaza un matchScore fuera de 0-100 o con decimales", () => {
    const tailored = { resume: RESUME_EN, highlighted: [], changelog: [], gaps: [], matchScore: 101 };
    expect(tailoredResumeSchema.safeParse(tailored).success).toBe(false);
    expect(tailoredResumeSchema.safeParse({ ...tailored, matchScore: 70.5 }).success).toBe(false);
    expect(tailoredResumeSchema.safeParse({ ...tailored, matchScore: 70 }).success).toBe(true);
  });

  it("rechaza una URL que no es URL", () => {
    const bad = { ...RESUME_EN, siteUrl: "no-soy-una-url" };
    expect(tailoredResumeSchema.safeParse({ resume: bad, highlighted: [], changelog: [], gaps: [], matchScore: 1 }).success).toBe(false);
  });
});

describe("la ingesta de la oferta", () => {
  it("una oferta sin texto util y sin imagenes no llega al modelo", () => {
    const offer = jobOfferSchema.parse({ source: "text", text: "Hola" });
    expect(hasReadableContent(offer)).toBe(false);
  });

  it("una captura sola alcanza", () => {
    const offer = jobOfferSchema.parse({ source: "image", text: "", images: [{ mediaType: "image/png", data: "AAAA" }] });
    expect(hasReadableContent(offer)).toBe(true);
  });

  it("rechaza un tipo de imagen que el proveedor no acepta", () => {
    expect(jobOfferSchema.safeParse({ source: "image", images: [{ mediaType: "image/tiff", data: "AAAA" }] }).success).toBe(false);
  });
});

describe("SKILLS_MASTER, que es la frontera de lo afirmable", () => {
  it("se deriva del CV: todo lo que declara el CV esta, en los dos idiomas", () => {
    for (const resume of [RESUME_EN, RESUME_ES]) {
      for (const skill of resume.skills) {
        expect(isApprovedSkill(skill), `${skill} deberia estar aprobada`).toBe(true);
      }
    }
  });

  it("no deja entrar una tecnologia que el CV no nombra", () => {
    for (const tech of ["Kotlin", "Elixir", "Scala", "COBOL"]) {
      expect(isApprovedSkill(tech), `${tech} no deberia estar aprobada`).toBe(false);
    }
  });

  it("compara sin importar mayusculas ni separadores", () => {
    expect(isApprovedSkill("typescript")).toBe(true);
    expect(isApprovedSkill("Node JS")).toBe(isApprovedSkill("Node.js"));
  });

  it("la modalidad no es una competencia", () => {
    expect(SKILLS_MASTER.some((s) => /^Remot/i.test(s))).toBe(false);
  });
});

describe("el foco por vacante", () => {
  it("solo REORDENA: nunca agrega ni quita una competencia", () => {
    for (const locale of ["en", "es"] as const) {
      const base = locale === "en" ? RESUME_EN : RESUME_ES;
      for (const focus of ["backend", "fullstack", "frontend"] as const) {
        const out = resumeWithFocus(locale, focus);
        expect([...out.skills].sort()).toEqual([...base.skills].sort());
      }
    }
  });

  it("cambia el rotulo y el perfil, y son distintos entre focos", () => {
    const back = resumeWithFocus("en", "backend");
    const front = resumeWithFocus("en", "frontend");
    expect(back.about).not.toBe(front.about);
    expect(back.summary).not.toBe(front.summary);
  });

  it("cada skillOrder nombra solo competencias que el CV declara", () => {
    for (const locale of ["en", "es"] as const) {
      const declared = new Set(locale === "en" ? RESUME_EN.skills : RESUME_ES.skills);
      for (const profile of Object.values(ROLE_FOCUS[locale])) {
        for (const skill of profile.skillOrder) {
          expect(declared, `${locale}: ${skill}`).toContain(skill);
        }
      }
    }
  });
});

describe("las muestras de voz", () => {
  it("hay al menos una y cada una es un correo de verdad, no una linea", () => {
    expect(VOICE_SAMPLES.length).toBeGreaterThanOrEqual(1);
    for (const sample of VOICE_SAMPLES) {
      expect(sample.text.length).toBeGreaterThan(200);
      expect(sample.source.length).toBeGreaterThan(10);
    }
  });

  it("los ids son unicos", () => {
    const ids = VOICE_SAMPLES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
