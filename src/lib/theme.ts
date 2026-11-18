export type ThemeChoice = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "cv-theme";

/**
 * Corre ANTES del primer paint, en el `<head>`, para que la página no aparezca en claro y
 * salte a oscuro. Por eso es un string y no un módulo: un `<script src>` llegaría tarde.
 *
 * Falla en silencio a propósito: en incógnito `localStorage` puede tirar, y en ese caso lo
 * correcto es quedarse con la preferencia del sistema, no romper el render.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
