import { describe, expect, it } from "vitest";
import { applicationPath, applicationSlug } from "@/lib/apply/store";
import type { JobSpec } from "@/lib/apply/schemas";

const spec = (over: Partial<JobSpec> = {}): JobSpec => ({
  company: "Acme",
  role: "Senior Software Engineer",
  locale: "en",
  focus: "fullstack",
  seniority: null,
  location: null,
  workMode: null,
  mustHave: [],
  niceToHave: [],
  responsibilities: [],
  emphasis: [],
  ...over,
});

describe("applicationSlug", () => {
  it("arma fecha-empresa-puesto", () => {
    expect(applicationSlug(spec(), new Date("2026-11-18T10:00:00Z"))).toBe(
      "2026-11-18-acme-senior-software-engineer"
    );
  });

  it("aguanta acentos, enes y simbolos", () => {
    const slug = applicationSlug(
      spec({ company: "Ñandú & Cía. S.A.", role: "Ingeniero/a Sénior" }),
      new Date("2026-11-18T10:00:00Z")
    );
    expect(slug).toBe("2026-11-18-nandu-cia-s-a-ingeniero-a-senior");
    expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("no deja el slug vacio si la empresa no tiene letras", () => {
    const slug = applicationSlug(spec({ company: "***" }), new Date("2026-11-18"));
    expect(slug).toContain("empresa");
  });
});

/**
 * ⛔ El slug viaja en una URL (`/preview/<id>`) y termina en una ruta de
 * archivo. Estos son los casos donde se sabe la respuesta: tienen que TIRAR.
 */
describe("applicationPath", () => {
  it("acepta un slug normal", () => {
    expect(() => applicationPath("2026-11-18-acme-senior")).not.toThrow();
  });

  it.each([
    "../../etc/passwd",
    "..",
    "a/../../b",
    "/etc/passwd",
    "con espacios",
    "MAYUSCULAS",
    "ab",
    "",
  ])("rechaza %j", (slug) => {
    expect(() => applicationPath(slug)).toThrow();
  });
});
