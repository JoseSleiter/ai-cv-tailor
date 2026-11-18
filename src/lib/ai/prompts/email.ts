import type { EmailTemplate } from "@/data/email-template";
import {
  VOICE_SAMPLE_INSTRUCTIONS,
  type VoiceSample,
} from "@/data/voice-samples";
import type { JobSpec, TailoredResume } from "@/lib/apply/schemas";

/**
 * Paso 3: la carta de presentacion que va en el cuerpo del correo.
 *
 * ⇒ Tres insumos, y ninguno es opcional: la PLANTILLA da la estructura, las
 * MUESTRAS dan la voz, y el CV ADAPTADO da los hechos. Sin la plantilla sale un
 * correo generico; sin las muestras, uno que no suena a el; sin el CV, uno que
 * promete lo que el PDF no sostiene.
 */
export const EMAIL_SYSTEM = `You write the cover letter that goes in the body of a job application email, as the candidate, in the first person.

You are given a template, one or two emails the candidate actually wrote, and the CV that will be attached. Fill the template's placeholders and adapt its wording to this posting. You are not writing a new email from scratch.

PLACEHOLDERS
- {{company}}, {{role}}, {{greeting}} and {{hook}} are yours to fill. The hook is one or two sentences connecting something concrete and verifiable in the attached CV to something the posting asks for. It is the only part you write freely.
- {{focus}} has already been replaced for you.
- Any placeholder left in your output is a placeholder a HUMAN must fill (a salary figure, a start date). Leave it exactly as it is, and list it in \`pendingPlaceholders\`. Never invent a figure or a date: it is a promise someone has to keep on a call.

RULES
- Every factual claim must be backed by the attached CV. If the CV does not list a technology, it does not go in the email, however much the posting wants it.
- Write in the language of the posting.
- No marketing adjectives, no flattery about the company, no invented enthusiasm, no "I am passionate about". Short paragraphs.
- The subject line names the role and the candidate. Keep it under 80 characters.
- Answer with JSON only.`;

export function buildEmailPrompt(
  template: EmailTemplate,
  spec: JobSpec,
  tailored: TailoredResume,
  samples: readonly VoiceSample[]
): string {
  const voice = samples
    .map((sample, index) => `### Sample ${index + 1}\n\n${sample.text}`)
    .join("\n\n");

  return `# The posting

${JSON.stringify(spec, null, 2)}

# The template to fill

Subject: ${template.subject}

${template.body}

Tone: ${template.guidance}

# How the candidate writes

${VOICE_SAMPLE_INSTRUCTIONS}

${voice}

# The CV that will be attached

Profile: ${tailored.resume.summary}

Skills: ${tailored.resume.skills.join(" · ")}

Experience:
${tailored.resume.work
  .map(
    (job) =>
      `- ${job.title} @ ${job.company} (${job.start} – ${job.end ?? "present"})${
        job.highlights?.length ? `\n  ${job.highlights.join("\n  ")}` : ""
      }`
  )
  .join("\n")}

${tailored.gaps.length > 0 ? `What this CV does NOT cover (do not claim it): ${tailored.gaps.join(" · ")}` : ""}

# Now

Return the subject, the body, and the placeholders a human still has to fill.`;
}
