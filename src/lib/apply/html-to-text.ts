/**
 * HTML → texto plano, para la via del LINK.
 *
 * ⚠ No es un parser: es un recorte deliberado. Lo unico que tiene que lograr es
 * que el modelo lea la oferta, asi que tira lo que no es prosa (script, style,
 * nav, footer) y colapsa el resto. Una libreria completa seria mas exacta y
 * pesaria mas que el problema.
 */

const DROP_BLOCKS =
  /<(script|style|noscript|svg|head|nav|footer|header|form)\b[\s\S]*?<\/\1>/gi;

const BLOCK_END = /<\/(p|div|section|article|li|h[1-6]|tr|br)\s*\/?>/gi;

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
};

const decodeEntities = (text: string) =>
  text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code: string) => {
    const known = ENTITIES[code.toLowerCase()];
    if (known) return known;
    if (code.startsWith("#x") || code.startsWith("#X")) {
      return String.fromCodePoint(Number.parseInt(code.slice(2), 16));
    }
    if (code.startsWith("#")) {
      return String.fromCodePoint(Number.parseInt(code.slice(1), 10));
    }
    return match;
  });

export function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(DROP_BLOCKS, " ")
      .replace(BLOCK_END, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * ⛔ El control que separa "bajamos la oferta" de "bajamos un cascaron".
 *
 * Un portal con login devuelve 200 y un HTML lleno de markup con cuatro
 * palabras adentro. Sin esto, el modelo recibe "Sign in to continue" y produce
 * una oferta inventada con toda confianza.
 */
export function looksLikeLoginWall(text: string): boolean {
  if (text.length < 400) return true;
  const signals =
    /(sign in|log in|iniciar sesi[oó]n|create an account|enable javascript|activa javascript|captcha|verify you are human)/i;
  return signals.test(text.slice(0, 600)) && text.length < 1200;
}
