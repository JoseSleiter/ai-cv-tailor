import type { Locale } from "@/lib/types";
import { RESUME_EN } from "./resume-data.en";
import { RESUME_ES } from "./resume-data.es";

/**
 * El eje que de verdad decide una candidatura no es la seniority: es el FOCO.
 *
 * El rotulo publico es "Senior Software Engineer" a proposito —neutral y
 * demostrable—, y el foco se elige POR VACANTE. Son tres busquedas distintas y
 * un CV solo puede encabezar una:
 *
 *   backend    menos competencia, sueldos mas altos, menos vacantes
 *   fullstack  el default: es lo que los ultimos cuatro anios fueron de verdad
 *   frontend   mas vacantes, mucha mas competencia
 */
export type RoleFocus = "backend" | "fullstack" | "frontend";

/** Lo que el CV encabeza cuando la oferta no deja claro el foco. */
export const DEFAULT_FOCUS: RoleFocus = "fullstack";

export interface FocusProfile {
  /** El rotulo bajo el nombre, y el titulo que usa el asunto del correo. */
  headline: string;
  /**
   * El parrafo de perfil. NO es una traduccion ni un invento: es la misma
   * trayectoria contada desde el angulo que la vacante pregunta.
   */
  summary: string;
  /**
   * Una frase en primera persona para el correo. Reemplaza al `{{focus}}` de la
   * plantilla, y es DETERMINISTA: no la escribe la IA.
   */
  pitch: string;
  /**
   * Competencias que van primero. Solo REORDENA: no agrega ninguna, asi que no
   * puede introducir una tecnologia que el CV no declare.
   */
  skillOrder: readonly string[];
}

export const ROLE_FOCUS: Record<Locale, Record<RoleFocus, FocusProfile>> = {
  en: {
    backend: {
      headline: "Senior Software Engineer · Backend & distributed systems",
      summary:
        "Senior Software Engineer with 8+ years building and scaling backend systems in production for companies across the US, LATAM and Europe. Designs the parts that have to hold: a multi-tenant platform with schema-per-tenant isolation in PostgreSQL for 50k+ students, event-driven microservices in Python and Node.js over RabbitMQ, a Saga orchestration for distributed payments, and API gateways on AWS and Azure. Sustains 99.8% deployment reliability behind a mandatory merge gate of ~400 end-to-end flows. Fluent in English (B2+ Professional Proficiency).",
      pitch:
        "a Senior Software Engineer focused on backend and distributed systems",
      skillOrder: [
        "Python",
        "TypeScript",
        "Node.js",
        "NestJS",
        "Ruby on Rails",
        "FastAPI",
        "Flask",
        "PostgreSQL",
        "SQL",
        "Redis",
        "RabbitMQ",
        "Microservices",
        "Event-driven architecture",
        "Multi-tenancy",
        "System Design",
        "Clean Architecture",
        "Kong Gateway",
        "REST APIs",
        "GraphQL",
        "AWS",
        "Azure",
        "Docker",
        "Kubernetes",
      ],
    },
    fullstack: {
      headline:
        "Senior Software Engineer · Full-stack, cloud & distributed systems",
      /** El baseline ya escrito a mano: una sola fuente, sin copia que derive. */
      summary: RESUME_EN.summary,
      pitch:
        "a Senior Software Engineer working end to end, from the database to the browser",
      skillOrder: [
        "TypeScript",
        "Python",
        "React",
        "Next.js",
        "Node.js",
        "NestJS",
        "Ruby on Rails",
        "PostgreSQL",
        "Redis",
        "REST APIs",
        "GraphQL",
        "Microservices",
        "Multi-tenancy",
        "AWS",
        "Azure",
        "Docker",
        "Kubernetes",
        "Playwright",
      ],
    },
    frontend: {
      headline: "Senior Software Engineer · Frontend, React & Next.js",
      summary:
        "Senior Software Engineer with 8+ years shipping product interfaces in React and Next.js for companies across the US, LATAM and Europe. Works the whole frontend stack with intent: rendering strategy (SSR/SSG/ISR), state at scale (Zustand, Redux Toolkit, TanStack Query), design systems in Tailwind and Material UI, and testing with Jest, React Testing Library, Playwright and Cypress. Rebuilt the back-office of a platform serving 50k+ students, and rebuilt a partner portal in Next.js with static generation, taking page load from 8s to 1.5s (-81%). Reads and writes the API behind it, so the contract is never someone else's problem. Fluent in English (B2+ Professional Proficiency).",
      pitch:
        "a Senior Software Engineer focused on frontend — React and Next.js, with the backend background to own the contract",
      skillOrder: [
        "TypeScript",
        "React",
        "Next.js",
        "JavaScript",
        "SSR / SSG / ISR",
        "Zustand",
        "Redux Toolkit",
        "TanStack Query",
        "Redux",
        "Tailwind CSS",
        "Material UI",
        "Web Vitals",
        "Jest",
        "React Testing Library",
        "Playwright",
        "Cypress",
        "React Native",
        "Vue.js",
        "Angular",
        "GraphQL",
        "REST APIs",
      ],
    },
  },
  es: {
    backend: {
      headline: "Senior Software Engineer · Backend y sistemas distribuidos",
      summary:
        "Ingeniero de Software Senior con más de 8 años construyendo y escalando sistemas backend en producción para empresas de EE. UU., LATAM y Europa. Diseña las piezas que tienen que aguantar: una plataforma multi-institución con aislamiento por esquema en PostgreSQL para +50k estudiantes, microservicios orientados a eventos en Python y Node.js sobre RabbitMQ, una orquestación Saga para pagos distribuidos y gateways de API sobre AWS y Azure. Sostiene un 99,8% de fiabilidad de despliegue detrás de una barrera obligatoria de ~400 flujos end-to-end. Nivel de inglés fluido (B2+ Avanzado).",
      pitch:
        "Ingeniero de Software Senior con foco en backend y sistemas distribuidos",
      skillOrder: [
        "Python",
        "TypeScript",
        "Node.js",
        "NestJS",
        "Ruby on Rails",
        "FastAPI",
        "Flask",
        "PostgreSQL",
        "SQL",
        "Redis",
        "RabbitMQ",
        "Microservicios",
        "Arquitectura orientada a eventos",
        "Multi-tenancy",
        "System Design",
        "Clean Architecture",
        "Kong Gateway",
        "APIs REST",
        "GraphQL",
        "AWS",
        "Azure",
        "Docker",
        "Kubernetes",
      ],
    },
    fullstack: {
      headline:
        "Senior Software Engineer · Full-stack, cloud y sistemas distribuidos",
      /** El baseline ya escrito a mano: una sola fuente, sin copia que derive. */
      summary: RESUME_ES.summary,
      pitch:
        "Ingeniero de Software Senior que trabaja de punta a punta, de la base de datos al navegador",
      skillOrder: [
        "TypeScript",
        "Python",
        "React",
        "Next.js",
        "Node.js",
        "NestJS",
        "Ruby on Rails",
        "PostgreSQL",
        "Redis",
        "APIs REST",
        "GraphQL",
        "Microservicios",
        "Multi-tenancy",
        "AWS",
        "Azure",
        "Docker",
        "Kubernetes",
        "Playwright",
      ],
    },
    frontend: {
      headline: "Senior Software Engineer · Frontend, React y Next.js",
      summary:
        "Ingeniero de Software Senior con más de 8 años desarrollando interfaces de producto en React y Next.js para empresas de EE. UU., LATAM y Europa. Trabaja el frontend completo con criterio: estrategia de renderizado (SSR/SSG/ISR), estado a escala (Zustand, Redux Toolkit, TanStack Query), sistemas de diseño en Tailwind y Material UI, y pruebas con Jest, React Testing Library, Playwright y Cypress. Reconstruyó el back-office de una plataforma con +50k estudiantes y reconstruyó un portal de partners en Next.js con generación estática, bajando la carga de página de 8s a 1,5s (-81%). Lee y escribe la API que tiene detrás, así que el contrato nunca es problema de otro. Nivel de inglés fluido (B2+ Avanzado).",
      pitch:
        "Ingeniero de Software Senior con foco en frontend —React y Next.js—, con el recorrido de backend para hacerme cargo del contrato",
      skillOrder: [
        "TypeScript",
        "React",
        "Next.js",
        "JavaScript",
        "SSR / SSG / ISR",
        "Zustand",
        "Redux Toolkit",
        "TanStack Query",
        "Redux",
        "Tailwind CSS",
        "Material UI",
        "Web Vitals",
        "Jest",
        "React Testing Library",
        "Playwright",
        "Cypress",
        "React Native",
        "Vue.js",
        "Angular",
        "GraphQL",
        "APIs REST",
      ],
    },
  },
};

/**
 * ⛔ Guarda de deriva, evaluada al construir.
 *
 * `skillOrder` solo puede nombrar competencias que el CV de ESE idioma declara.
 * Sin esto, renombrar una competencia deja el orden a medias en silencio: la
 * pantalla sigue renderizando y el foco deja de ordenar lo que decia ordenar.
 */
const SKILLS_BY_LOCALE: Record<Locale, readonly string[]> = {
  en: RESUME_EN.skills,
  es: RESUME_ES.skills,
};

for (const [locale, focuses] of Object.entries(ROLE_FOCUS) as [
  Locale,
  Record<RoleFocus, FocusProfile>,
][]) {
  const declared = new Set(SKILLS_BY_LOCALE[locale]);
  for (const [focus, profile] of Object.entries(focuses)) {
    const unknown = profile.skillOrder.filter((s) => !declared.has(s));
    if (unknown.length > 0) {
      throw new Error(
        `ROLE_FOCUS.${locale}.${focus}.skillOrder nombra competencias que el CV ${locale} no declara: ${unknown.join(", ")}`
      );
    }
  }
}

/**
 * Reordena las competencias del CV segun el foco. Las que el foco no nombra
 * quedan despues, en su orden original: nada se pierde y nada se agrega.
 */
export const orderSkillsFor = (
  skills: readonly string[],
  profile: FocusProfile
): string[] => {
  const priority = new Map(profile.skillOrder.map((s, i) => [s, i]));
  const first = [...skills].filter((s) => priority.has(s));
  first.sort(
    (a, b) => (priority.get(a) as number) - (priority.get(b) as number)
  );
  return [...first, ...skills.filter((s) => !priority.has(s))];
};
