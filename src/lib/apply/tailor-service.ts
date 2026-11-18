import "server-only";
import {
  EMAIL_TEMPLATES,
  type EmailVariant,
  HUMAN_ONLY_PLACEHOLDERS,
} from "@/data/email-template";
import { resumeWithFocus } from "@/data/resume-data";
import { ROLE_FOCUS } from "@/data/role-focus";
import { SKILLS_MASTER } from "@/data/skills-master";
import { ClaudeAgentProvider } from "@/lib/ai/claude-agent";
import { GeminiProvider } from "@/lib/ai/gemini";
import { MockAiProvider } from "@/lib/ai/mock";
import { buildEmailPrompt, EMAIL_SYSTEM } from "@/lib/ai/prompts/email";
import { buildJobSpecPrompt, JOB_SPEC_SYSTEM } from "@/lib/ai/prompts/job-spec";
import { buildTailorPrompt, TAILOR_SYSTEM } from "@/lib/ai/prompts/tailor";
import type { AiProvider } from "@/lib/ai/provider";
import { collectViolations, FabricationError } from "./guard";
import type { JobOffer } from "./job-offer";
import {
  type ApplicationEmail,
  applicationEmailSchema,
  type JobSpec,
  jobSpecSchema,
  type TailoredResume,
  tailoredResumeSchema,
} from "./schemas";
import { loadVoiceSamples } from "./voice-store";

/**
 * Un solo lugar elige el motor, y los tres son intercambiables de verdad: la
 * guarda, el contrato zod, los prompts y el PDF no saben cual corrio.
 */
export const providerFor = (): AiProvider => {
  switch (process.env.CV_AI_PROVIDER) {
    case "mock":
      return new MockAiProvider();
    case "gemini":
      return new GeminiProvider();
    default:
      return new ClaudeAgentProvider();
  }
};

/** El CV del que se parte, ya visto desde el foco que la oferta pide. */
export const baseResumeFor = (spec: JobSpec) => {
  const { avatar: _avatar, ...content } = resumeWithFocus(
    spec.locale,
    spec.focus
  );
  return content;
};

export async function readJobOffer(
  offer: JobOffer,
  provider: AiProvider = providerFor()
): Promise<JobSpec> {
  return provider.complete({
    operation: "jobSpec",
    schema: jobSpecSchema,
    system: JOB_SPEC_SYSTEM,
    prompt: buildJobSpecPrompt(offer),
    images: offer.images,
    mock: () => ({
      company: "Acme",
      role: "Senior Software Engineer",
      locale: "en" as const,
      focus: "fullstack" as const,
      seniority: "Senior",
      location: null,
      workMode: "remote" as const,
      mustHave: ["TypeScript", "Node.js", "React", "AWS"],
      niceToHave: ["Kubernetes"],
      responsibilities: ["Build and ship product features"],
      emphasis: ["remote-first team"],
    }),
  });
}

/**
 * ⛔ El reintento NO es cortesia: es parte de la guarda.
 *
 * Un rechazo se le devuelve al modelo COMO TEXTO, con las violaciones escritas.
 * Si la segunda vuelta tambien miente, se levanta y no se genera PDF. Dos
 * intentos y se para: un bucle que insiste gasta turnos y termina aceptando lo
 * que el primero ya hizo mal.
 */
export async function tailorResume(
  spec: JobSpec,
  provider: AiProvider = providerFor()
): Promise<TailoredResume> {
  const resume = baseResumeFor(spec);
  const request = {
    operation: "tailor" as const,
    schema: tailoredResumeSchema,
    system: TAILOR_SYSTEM,
    prompt: buildTailorPrompt(resume, spec, SKILLS_MASTER),
    mock: () => ({
      resume,
      highlighted: resume.skills.slice(0, 6),
      changelog: [
        {
          field: "skills",
          change: "orden simulado",
          reason: "respuesta del MockAiProvider",
        },
      ],
      gaps: [],
      matchScore: 70,
    }),
  };

  const first = await provider.complete(request);
  const violations = collectViolations(resume, first);
  if (violations.length === 0) return first;

  const second = await provider.complete({
    ...request,
    feedback: `A post-hoc guard compared your answer with the original CV and refused it:\n- ${violations.join("\n- ")}`,
  });
  const stillWrong = collectViolations(resume, second);
  if (stillWrong.length > 0) throw new FabricationError(stillWrong);
  return second;
}

/**
 * `{{focus}}` se reemplaza ACA, antes del modelo: es la frase que posiciona la
 * candidatura y no se deja al azar de una generacion.
 */
export function prepareTemplate(spec: JobSpec, variant: EmailVariant) {
  const template = EMAIL_TEMPLATES[spec.locale][variant];
  const pitch = ROLE_FOCUS[spec.locale][spec.focus].pitch;
  return {
    ...template,
    subject: template.subject.replaceAll("{{focus}}", pitch),
    body: template.body.replaceAll("{{focus}}", pitch),
  };
}

export async function draftEmail(
  spec: JobSpec,
  tailored: TailoredResume,
  variant: EmailVariant,
  provider: AiProvider = providerFor()
): Promise<ApplicationEmail> {
  const template = prepareTemplate(spec, variant);
  const email = await provider.complete({
    operation: "email",
    schema: applicationEmailSchema,
    system: EMAIL_SYSTEM,
    prompt: buildEmailPrompt(
      template,
      spec,
      tailored,
      await loadVoiceSamples()
    ),
    mock: () => ({
      subject: template.subject
        .replaceAll("{{role}}", spec.role)
        .replaceAll("{{company}}", spec.company),
      body: template.body
        .replaceAll("{{greeting}}", "Hello,")
        .replaceAll("{{role}}", spec.role)
        .replaceAll("{{company}}", spec.company)
        .replaceAll("{{hook}}", "(hook simulado por el MockAiProvider)"),
      pendingPlaceholders: [],
    }),
  });

  /**
   * ⚠ Los marcadores pendientes se MIDEN sobre el texto, no se le creen al
   * modelo: lo que importa es lo que la persona va a pegar en su correo.
   */
  const text = `${email.subject}\n${email.body}`;
  const pending = [
    ...HUMAN_ONLY_PLACEHOLDERS,
    ...(text.match(/\{\{[a-zA-Z]+\}\}/g) ?? []),
  ].filter((marker) => text.includes(marker));

  return { ...email, pendingPlaceholders: [...new Set(pending)] };
}
