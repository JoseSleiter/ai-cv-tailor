import type { JobOffer } from "@/lib/apply/job-offer";

/**
 * Paso 1: leer la oferta. Lo unico que se le pide al modelo es ENTENDER, no
 * opinar: de aca salen las palabras clave que gobiernan los dos pasos siguientes.
 */
export const JOB_SPEC_SYSTEM = `You read a job posting and extract its requirements as structured data. You are precise and literal.

Rules:
- Extract only what the posting says. If it does not state the seniority, the location or the work mode, return null. Never guess.
- \`mustHave\` is for the requirements the posting presents as required; \`niceToHave\` for the ones it presents as a plus. Keep each item SHORT — a technology, a practice or a named skill ("PostgreSQL", "event-driven architecture", "mentoring"), not a sentence.
- Order both lists by how much the posting insists on each item: what the title and the first paragraphs name goes first.
- \`locale\` is the language the posting itself is written in, because the CV and the email will be written in that language.
- \`focus\` is the shape of the role: "backend", "frontend", or "fullstack" when it genuinely asks for both.
- \`emphasis\` is what a recruiter would underline: the two or three things this posting clearly cares about most.
- Answer with JSON only.`;

export function buildJobSpecPrompt(offer: JobOffer): string {
  const parts = [
    "# Job posting",
    offer.sourceUrl ? `Source: ${offer.sourceUrl}` : null,
    offer.text.trim().length > 0 ? `\n${offer.text.trim()}` : null,
    offer.images.length > 0
      ? `\n(${offer.images.length} screenshot(s) of the posting are attached. Read them.)`
      : null,
  ].filter(Boolean);
  return parts.join("\n");
}
