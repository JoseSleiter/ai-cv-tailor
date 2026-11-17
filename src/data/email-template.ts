import type { Locale } from "@/lib/types";

/**
 * La plantilla del correo de postulacion vive en DATOS, no en un prompt.
 *
 * ⇒ Quien forkee el repo pone la suya y la herramienta sigue funcionando. Es parte del diseno.
 *
 * La IA recibe esta plantilla + el `JobSpec` + el CV adaptado, y devuelve `{subject, body}`
 * CONSERVANDO esta voz: no escribe un correo nuevo, rellena y ajusta este.
 *
 * Marcadores disponibles: {{company}} {{role}} {{hook}} {{greeting}}
 *   {{hook}} = una o dos frases que conectan la experiencia propia con lo que pide la vacante.
 *              Es lo unico que la IA redacta libremente.
 */
export interface EmailTemplate {
  subject: string;
  body: string;
  /** Instrucciones de tono para la IA, en lenguaje natural. */
  guidance: string;
}

export const EMAIL_TEMPLATE: Record<Locale, EmailTemplate> = {
  en: {
    subject: "Senior Software Engineer — Jose Sleiter Rios ({{role}})",
    body: `{{greeting}}

I'm reaching out to express my interest in the {{role}} opening at {{company}}, and to share my professional profile as a Senior Software Engineer with a strong backend focus.

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
  es: {
    subject: "Senior Software Engineer — Jose Sleiter Rios ({{role}})",
    body: `{{greeting}}

Les escribo para expresar mi interés en la vacante de {{role}} en {{company}} y compartir mi perfil profesional como Ingeniero de Software Senior con foco en backend.

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
};
