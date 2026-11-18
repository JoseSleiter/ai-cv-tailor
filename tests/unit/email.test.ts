import { describe, expect, it } from "vitest";
import {
  DERIVED_PLACEHOLDERS,
  EMAIL_TEMPLATES,
  HUMAN_ONLY_PLACEHOLDERS,
} from "@/data/email-template";
import { ROLE_FOCUS } from "@/data/role-focus";
import { prepareTemplate } from "@/lib/apply/tailor-service";
import type { JobSpec } from "@/lib/apply/schemas";

const spec: JobSpec = {
  company: "Acme",
  role: "Senior Backend Engineer",
  locale: "es",
  focus: "backend",
  seniority: null,
  location: null,
  workMode: null,
  mustHave: [],
  niceToHave: [],
  responsibilities: [],
  emphasis: [],
};

describe("prepareTemplate", () => {
  it("reemplaza {{focus}} con el pitch del foco, sin pasar por la IA", () => {
    const out = prepareTemplate(spec, "coldOutreach");
    expect(out.body).toContain(ROLE_FOCUS.es.backend.pitch);
    expect(out.body).not.toContain("{{focus}}");
  });

  it("el foco cambia el texto: backend y frontend no dicen lo mismo", () => {
    const back = prepareTemplate(spec, "coldOutreach").body;
    const front = prepareTemplate({ ...spec, focus: "frontend" }, "coldOutreach").body;
    expect(back).not.toBe(front);
  });

  /**
   * ⛔ Los marcadores de la PERSONA tienen que SOBREVIVIR: una cifra salarial
   * rellenada por nadie es una promesa que alguien tiene que sostener.
   */
  it("no toca los marcadores que rellena la persona", () => {
    const out = prepareTemplate(spec, "recruiterReply");
    for (const marker of HUMAN_ONLY_PLACEHOLDERS) {
      expect(out.body).toContain(marker);
    }
  });
});

describe("las plantillas", () => {
  it("existen en los dos idiomas y en las dos variantes", () => {
    for (const locale of ["en", "es"] as const) {
      for (const variant of ["coldOutreach", "recruiterReply"] as const) {
        const t = EMAIL_TEMPLATES[locale][variant];
        expect(t.subject.length).toBeGreaterThan(5);
        expect(t.guidance.length).toBeGreaterThan(20);
      }
    }
  });

  it("ningun marcador queda sin categoria declarada", () => {
    const declared = new Set<string>([
      ...HUMAN_ONLY_PLACEHOLDERS,
      ...DERIVED_PLACEHOLDERS,
      "{{company}}",
      "{{role}}",
      "{{greeting}}",
      "{{hook}}",
    ]);
    for (const locale of ["en", "es"] as const) {
      for (const variant of ["coldOutreach", "recruiterReply"] as const) {
        const t = EMAIL_TEMPLATES[locale][variant];
        for (const found of `${t.subject}\n${t.body}`.match(/\{\{[a-zA-Z]+\}\}/g) ?? []) {
          expect(declared, `${locale}.${variant} usa ${found}`).toContain(found);
        }
      }
    }
  });
});
