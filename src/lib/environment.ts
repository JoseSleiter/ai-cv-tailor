import "server-only";

/**
 * ⛔ EL UNICO LUGAR donde se decide si el workbench esta encendido.
 *
 * Pide DOS cosas, y la segunda es la que importa: que no estemos en Vercel. El
 * motor de IA es el Claude Agent SDK, que habla con el binario `claude` del
 * equipo; en la nube ese binario no existe, asi que la restriccion "solo local"
 * no depende de acordarse de un `if`: no hay con que ejecutarla.
 *
 * ⇒ La variable es el interruptor; la ausencia de `VERCEL` es la garantia.
 */
export const isLocalMode = (): boolean =>
  process.env.CV_AI_ENABLED === "1" && !process.env.VERCEL;

export const aiModel = (): string =>
  process.env.CV_AI_MODEL ?? "claude-opus-5-5";

export const applicationsDir = (): string =>
  process.env.CV_APPLICATIONS_DIR ?? ".applications";

export const pdfTimeoutMs = (): number =>
  Number(process.env.CV_PDF_TIMEOUT_MS ?? 30_000);
