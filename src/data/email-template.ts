import type { Locale } from "@/lib/types";

/**
 * Las plantillas del correo de postulacion viven en DATOS, no en un prompt.
 *
 * ⇒ Quien forkee el repo pone las suyas y la herramienta sigue funcionando.
 *
 * La IA recibe la plantilla + el `JobSpec` + el CV adaptado y devuelve
 * `{subject, body}` CONSERVANDO esta voz: no escribe un correo nuevo, rellena y
 * ajusta este.
 */

/**
 * Dos situaciones distintas, dos correos distintos. Mandar el de contacto en frio
 * a quien ya te escribio se lee como un copy-paste, y es el momento en que mas se
 * pierde una conversacion ya abierta.
 */
export type EmailVariant =
  /** Nadie escribio todavia: hay que presentarse y justificar la intromision. */
  | "coldOutreach"
  /** Un reclutador ya escribio: la presentacion sobra y lo que falta son NUMEROS. */
  | "recruiterReply";

export interface EmailTemplate {
  subject: string;
  body: string;
  /** Instrucciones de tono para la IA, en lenguaje natural. */
  guidance: string;
}

/**
 * ⛔ Marcadores que rellena LA PERSONA, nunca la IA.
 *
 * Una cifra salarial o una fecha de disponibilidad inventada por un modelo es una
 * promesa que despues hay que sostener en una llamada. La UI los pide antes de
 * dejar copiar el correo.
 */
export const HUMAN_ONLY_PLACEHOLDERS = [
  "{{salaryExpectation}}",
  "{{availability}}",
] as const;

/**
 * ⚙ Marcadores DERIVADOS: no los escribe la IA ni la persona, salen del dato.
 *
 *   {{focus}} — `ROLE_FOCUS[locale][focus].pitch`, el foco que la oferta pide
 *               (backend / fullstack / frontend). Deterministico a proposito: es
 *               la frase que posiciona la candidatura y no se deja al azar de un
 *               modelo.
 */
export const DERIVED_PLACEHOLDERS = ["{{focus}}"] as const;

/**
 * Marcadores que SI redacta la IA:
 *   {{company}} {{role}} {{greeting}}
 *   {{hook}} — una o dos frases que conectan la experiencia propia con lo que pide
 *              la vacante. Es lo unico que la IA escribe libremente.
 */
export const EMAIL_TEMPLATES: Record<
  Locale,
  Record<EmailVariant, EmailTemplate>
> = {
  en: {
    coldOutreach: {
      subject: "Senior Software Engineer — Jose Sleiter Rios ({{role}})",
      body: `{{greeting}}

I'm reaching out to express my interest in the {{role}} opening at {{company}}, and to share my professional profile as {{focus}}.

My name is Jose Sleiter. I am a Computer Engineering graduate from Universidad Católica Andrés Bello with 8+ years of professional experience building and scaling production systems remotely for companies across Mexico, Chile, Colombia, Spain, the United Kingdom and the United States.

{{hook}}

Attached you will find my CV detailing my professional journey, the companies I've collaborated with, and my tech stack.

Thank you for your time and consideration. I look forward to the possibility of discussing how my background can add value to your engineering team.

Best regards,
Jose Sleiter
Computer Engineer`,
      guidance:
        "Professional but warm. No buzzwords, no flattery about the company, no invented enthusiasm. The hook must cite something concrete and verifiable from the CV that maps to a requirement of the posting. Never claim a technology that is not in the tailored CV.",
    },
    recruiterReply: {
      subject: "Re: {{role}} — Jose Sleiter Rios",
      body: `{{greeting}}

Thanks for sharing the details of the position. I'd be glad to explore the opportunity with the team at {{company}}.

{{hook}}

A short summary of where I stand: 8+ years as a Software Engineer, the last four leading the rewrite of a multi-tenant platform serving 50k+ users, with day-to-day work across TypeScript, Python, Node.js/NestJS, React/Next.js and Ruby on Rails, on AWS and Azure.

- Salary expectation: {{salaryExpectation}}
- Availability: {{availability}}
- Location: Bucaramanga, Colombia (GMT-5) — fully remote

My CV is attached. Happy to go deeper in a technical interview whenever suits you.

Best regards,
Jose Sleiter Rios
Computer Engineer`,
      guidance:
        "They wrote first, so skip the introduction and get to substance. Answer the requirements they named, in their order. The hook connects the CV to the specific thing the recruiter emphasised. Keep salary and availability EXACTLY as the placeholders give them — never invent a figure or a date.",
    },
  },
  es: {
    coldOutreach: {
      subject: "Senior Software Engineer — Jose Sleiter Rios ({{role}})",
      body: `{{greeting}}

Les escribo para expresar mi interés en la vacante de {{role}} en {{company}} y compartir mi perfil profesional como {{focus}}.

Mi nombre es Jose Sleiter. Soy Ingeniero en Informática egresado de la Universidad Católica Andrés Bello, con más de 8 años de experiencia construyendo y escalando sistemas en producción de forma remota para empresas de México, Chile, Colombia, España, Reino Unido y Estados Unidos.

{{hook}}

Adjunto encontrarán mi CV con el detalle de mi trayectoria, las empresas con las que he colaborado y mi stack técnico.

Gracias por su tiempo y consideración. Quedo atento a la posibilidad de conversar sobre cómo mi experiencia puede aportar a su equipo de ingeniería.

Saludos cordiales,
Jose Sleiter
Ingeniero en Informática`,
      guidance:
        "Profesional pero cercano. Sin palabras de relleno, sin halagos a la empresa, sin entusiasmo inventado. El hook tiene que citar algo concreto y verificable del CV que responda a un requisito de la oferta. Nunca nombrar una tecnología que no esté en el CV adaptado.",
    },
    recruiterReply: {
      subject: "Re: {{role}} — Jose Sleiter Rios",
      body: `{{greeting}}

Gracias por compartir los detalles de la posición. Me interesa mucho la oportunidad de aportar al equipo de {{company}}.

{{hook}}

Un resumen corto de dónde estoy parado: más de 8 años como Ingeniero de Software, los últimos cuatro liderando la reescritura de una plataforma multi-institución para +50k usuarios, trabajando a diario con TypeScript, Python, Node.js/NestJS, React/Next.js y Ruby on Rails, sobre AWS y Azure.

- Expectativa salarial: {{salaryExpectation}}
- Disponibilidad: {{availability}}
- Ubicación: Bucaramanga, Colombia (GMT-5) — 100% remoto

Adjunto mi CV. Quedo a disposición para una entrevista técnica cuando les resulte cómodo.

Saludos cordiales,
Jose Sleiter Rios
Ingeniero en Informática`,
      guidance:
        "Escribieron ellos primero, así que la presentación sobra y hay que ir al grano. Responder los requisitos que nombraron, en su orden. El hook conecta el CV con lo que el reclutador remarcó. Dejar salario y disponibilidad EXACTAMENTE como vengan en los marcadores: nunca inventar una cifra ni una fecha.",
    },
  },
};

/** @deprecated Usar `EMAIL_TEMPLATES[locale].coldOutreach`. */
export const EMAIL_TEMPLATE = {
  en: EMAIL_TEMPLATES.en.coldOutreach,
  es: EMAIL_TEMPLATES.es.coldOutreach,
};
