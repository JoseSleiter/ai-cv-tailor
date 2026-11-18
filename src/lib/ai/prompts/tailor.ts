import type { JobSpec } from "@/lib/apply/schemas";
import type { ResumeContent } from "@/lib/types";

/**
 * Paso 2: adaptar el CV.
 *
 * ⛔ El verbo que NO aparece en este prompt es "escribir". El modelo SELECCIONA,
 * ORDENA y RESALTA sobre un CV que ya existe. Lo unico que puede redactar son
 * dos parrafos —`summary` y `about`—, y es justamente lo que la guarda no puede
 * verificar, asi que el changelog los declara y la persona los lee antes de
 * exportar.
 */
export const TAILOR_SYSTEM = `You tailor an existing CV to a specific job posting. You never write a new CV: you choose, from what the CV already says, what deserves the recruiter's six seconds.

WHAT YOU MAY DO
- Drop skills, badges, work highlights and side projects that add nothing for THIS posting. A CV that says everything says nothing: cutting is the main job.
- Reorder what is left so that what the posting asks for is read first.
- List in \`highlighted\` the skills the posting asks for that the CV already has. They will be rendered emphasised. Every one of them MUST also appear in \`resume.skills\`.
- Rewrite \`summary\` (the profile paragraph) and \`about\` (the one-line headline under the name) so they speak to this posting.

WHAT YOU MUST NOT DO
- Never add a company, a job title, a date, a school, a project or a technology that is not in the CV you were given. Not even one the candidate "probably" knows. A post-hoc guard checks this and refuses your answer.
- Never remove a job from \`work\`. Employment history stays complete: a hole in the timeline costs more than an irrelevant job. You may trim its highlights and badges to nothing, but the entry stays.
- Never invent a number, a percentage or a duration. Every figure in your output must appear verbatim in the CV you were given. The guard cannot see a made-up number, so this one is on you.
- Never change \`name\`, \`location\`, \`locationLink\`, \`siteUrl\`, \`contact\`, or any \`start\`/\`end\` date.
- Keep the language of the CV you were given. Do not translate anything.

THE REST OF THE ANSWER
- \`changelog\`: one line per change, in the language of the CV, plain and checkable ("dropped Vue.js, Laravel and RabbitMQ from the skills list: the posting does not name them"). This is what the human reviews, so write it for a human.
- \`gaps\`: what the posting asks for and the CV does NOT back. Be blunt and complete. This is used to prepare for the interview, so hiding a gap is the worst thing you can do here.
- \`matchScore\`: 0-100, how much of \`mustHave\` the CV genuinely covers. Do not be generous.
- Answer with JSON only.`;

export function buildTailorPrompt(
  resume: ResumeContent,
  spec: JobSpec,
  skillsMaster: readonly string[]
): string {
  return `# The job posting, already parsed

${JSON.stringify(spec, null, 2)}

# The CV to tailor

This is the only source of facts you have. Its \`summary\` and \`about\` are already written for a "${spec.focus}" focus — improve them for this posting if you can, keep them if you cannot.

${JSON.stringify(resume, null, 2)}

# Every technology this candidate may be said to know

Anything outside this list is a fabrication, whatever the posting asks for.

${skillsMaster.join(" · ")}

# Now

Return the tailored CV, the highlighted skills, the changelog, the gaps and the match score.`;
}
