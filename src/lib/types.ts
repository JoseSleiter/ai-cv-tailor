import type { StaticImageData } from "next/image";

export type Locale = "en" | "es";

export type SocialIcon = "github" | "linkedin" | "x" | "leetcode";

export interface SocialLink {
  name: string;
  url: string;
  icon: SocialIcon;
}

export interface WorkEntry {
  company: string;
  /** Sitio de la empresa. Opcional: sin URL se renderiza como texto, no como un enlace roto. */
  link?: string;
  badges: string[];
  title: string;
  start: string;
  end: string | null;
  description: string;
  highlights?: string[];
}

export interface EducationEntry {
  school: string;
  degree: string;
  /** Opcional: sin fechas no se renderiza el rango, en vez de mostrar un guion vacio. */
  start?: string;
  end?: string | null;
}

export interface Project {
  title: string;
  techStack: string[];
  description: string;
  link?: string;
}

export interface ResumeData {
  name: string;
  location: string;
  locationLink: string;
  about: string;
  summary: string;
  /**
   * La foto va en la WEB y NUNCA en el PDF.
   *
   * ⛔ Es OPCIONAL a proposito, no un `print:hidden`: el CV que se adapta a una
   * vacante se construye desde `ResumeContent`, que no tiene este campo, asi que
   * la ruta del PDF no tiene foto que imprimir ni que olvidarse de esconder. En
   * la pagina publica, que si la muestra, el elemento ademas es `print:hidden`
   * para que un `Cmd+P` de el mismo documento que el PDF.
   *
   * El motivo es del oficio: el formato estandar de un CV tecnico no lleva foto.
   */
  avatar?: StaticImageData;
  siteUrl: string;
  personalWebsiteUrl?: string;
  contact: {
    email: string;
    tel: string;
    social: SocialLink[];
  };
  education: EducationEntry[];
  work: WorkEntry[];
  skills: string[];
  projects: Project[];
}

/**
 * Lo que viaja a y desde la IA, y lo que se guarda en `.applications/<slug>/tailored.json`.
 *
 * ⚠ `avatar` queda FUERA a proposito, por DOS motivos: es un `StaticImageData` que inyecta
 * el bundler y no es serializable a JSON, y la foto no es parte del CV —el PDF no la lleva—.
 * Se vuelve a enganchar en el render de la pagina, y solo ahi.
 */
export type ResumeContent = Omit<ResumeData, "avatar">;

/** Rotulos que dependen del idioma y que no son parte del contenido del CV. */
export interface LocaleLabels {
  sections: {
    summary: string;
    work: string;
    education: string;
    skills: string;
    projects: string;
  };
  present: string;
  /** Rotulos de los controles de la pagina, que no son parte del CV. */
  ui: {
    language: string;
    theme: { system: string; light: string; dark: string };
  };
}
