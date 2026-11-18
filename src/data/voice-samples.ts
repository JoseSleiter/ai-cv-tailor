import type { Locale } from "@/lib/types";

/**
 * Correos de postulacion REALES, escritos y enviados por Sleiter antes de este proyecto.
 *
 * ⭐ Para que sirven: para que la carta de presentacion suene a el. Una plantilla da la
 * estructura; estas muestras dan el RITMO —frases largas de verdad, el "My name is", el
 * cierre sin floritura—, que es lo que separa un correo propio de uno generado.
 *
 * ⛔⛔ SON VOZ, NO SON HECHOS. El modelo las recibe para imitar COMO escribe, y tiene
 * prohibido tomar de aca un dato: los hechos salen del CV adaptado y de `SKILLS_MASTER`,
 * nunca de una muestra. El motivo esta medido en estas dos mismas: dicen "over 7 years" y
 * "7 years" cuando hoy son 8+, y nombran "Prismic" y "WordPress como headless CMS", que el
 * CV de 2026 NO lista en ninguna parte —asi que `isApprovedSkill` los rechaza—. Un correo
 * es un documento VIEJO por definicion: se guarda por su forma, no por su contenido.
 *
 * ⇒ Por eso el campo se llama `text` y no `template`, y por eso la UI pide una o dos y no
 * veinte: con dos alcanza para fijar el registro, y cada una que se suma es una ocasion mas
 * de que una cifra vieja se cuele en la salida.
 */
export interface VoiceSample {
  /** Estable: identifica la muestra en la UI y en lo que se guarda de la postulacion. */
  id: string;
  locale: Locale;
  /** De donde salio. Si no se puede decir "esto lo escribi y lo mande", no es una muestra. */
  source: string;
  text: string;
}

export const VOICE_SAMPLES: readonly VoiceSample[] = [
  {
    id: "2024-cold-fullstack-backend",
    locale: "en",
    source: "Correo de contacto en frio enviado por Sleiter (ingles).",
    text: `I'm reaching out to express my interest in software engineering opportunities and to share my professional profile as a Full-Stack Developer with a strong backend focus.
My name is Jose Sleiter. I am a Computer Engineering graduate from Universidad Católica Andrés Bello with over 7 years of professional experience building scalable applications remotely for companies across Mexico, Chile, Colombia, Spain, and the United Kingdom.
My core technical expertise includes  Node.js, NestJS, TypeScript, ReactJS, NextJS. I also bring hands-on experience with cloud and DevOps tools such as AWS, Azure, Docker, and Kubernetes, alongside database performance optimization for PostgreSQL and MySQL.

Attached you will find my CV detailing my professional journey, the companies I've collaborated with, and my tech stack. Beyond my professional work, I continuously expand my skills—currently focusing on acceptance and unit testing for both frontend and backend development, and building a headless CMS project combining Prismic and NextJS.

Thank you for your time and consideration. I look forward to the possibility of discussing how my background can add value to your engineering team.

Best regards,
Jose Sleiter
Computer Engineer`,
  },
  {
    id: "2024-cold-fullstack-overview",
    locale: "en",
    source: "Segundo correo de contacto en frio enviado por Sleiter (ingles).",
    text: `i'm reaching out to share my profile as a Full-Stack Developer || Frontend || Backend (with a stronger focus on the latter). Below is a brief overview of my background.

My name is Jose Sleiter. I am a Computer Engineering graduate from Universidad Católica Andrés Bello, with 7 years of professional experience. I have worked remotely with companies in Mexico, Chile, Colombia, Spain, and the United Kingdom.

Attached you will find my CV, which details the companies I've worked with and the technologies I've used. It also lists the technologies I'm proficient in and regularly use in my personal projects, mainly the MERN stack (MongoDB, Express, React, Node.js). Additionally, I have experience with TypeScript, ReactJS, NextJS, Tailwind CSS, Node.js, NestJS, AWS, Azure, Docker, and some Kubernetes.

Currently, I am studying acceptance and unit testing for both frontend and backend development. In my free time, I am also developing a project using WordPress as a headless CMS with NextJS as the frontend, aimed at conceptualizing an application for a friend's company.

Thank you for your time. I look forward to your response.

Kind regards,
Jose Sleiter
Computer Engineer`,
  },
];

/**
 * Lo que se le dice al modelo sobre las muestras. Vive al lado de ellas a proposito: una
 * instruccion escrita en el prompt y lejos del dato se olvida de actualizar cuando el dato
 * cambia.
 */
export const VOICE_SAMPLE_INSTRUCTIONS = `The samples below are real application emails written by the candidate. Imitate ONLY their voice: sentence length, register, how they open and close, the plain tone with no marketing adjectives.

⛔ Do NOT take any fact from them. They are old: years of experience, countries, side projects and technologies in the samples may be outdated or unsupported. Every factual claim in the email you write must come from the tailored CV you were given. If a sample mentions a technology that the tailored CV does not list, that technology must not appear in your output.`;

/** Cuantas muestras pide la UI antes de dejar redactar: una alcanza, dos es lo bueno. */
export const VOICE_SAMPLES_WANTED = { min: 1, best: 2 } as const;
