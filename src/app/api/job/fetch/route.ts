import { NextResponse } from "next/server";
import { z } from "zod";
import { htmlToText, looksLikeLoginWall } from "@/lib/apply/html-to-text";
import { isLocalMode } from "@/lib/environment";

const body = z.object({ url: z.string().url() });

/**
 * Baja una oferta por su link.
 *
 * ⛔ Lo que esta ruta NO hace: burlar un bloqueo. Si el portal exige sesion, lo
 * DICE y manda a las otras dos vias. Un fetch que devuelve "Sign in to continue"
 * y sigue adelante produce una oferta inventada con toda confianza.
 */
export async function POST(request: Request) {
  if (!isLocalMode()) return new NextResponse(null, { status: 404 });

  const parsed = body.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "URL invalida." }, { status: 400 });
  }

  const { protocol } = new URL(parsed.data.url);
  if (protocol !== "https:" && protocol !== "http:") {
    return NextResponse.json({ error: "URL invalida." }, { status: 400 });
  }

  let html: string;
  try {
    const response = await fetch(parsed.data.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: {
        // Un User-Agent generico: ni se hace pasar por otro navegador ni dice
        // quien es el usuario.
        "User-Agent": "Mozilla/5.0 (compatible; cv-tailor/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: `El portal respondio ${response.status}.` },
        { status: 502 }
      );
    }
    html = await response.text();
  } catch {
    return NextResponse.json(
      { error: "No se pudo abrir esa URL." },
      { status: 502 }
    );
  }

  const text = htmlToText(html);
  return NextResponse.json({
    text,
    blocked: looksLikeLoginWall(text),
  });
}
