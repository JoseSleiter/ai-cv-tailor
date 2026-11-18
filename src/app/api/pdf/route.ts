import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { chromium } from "playwright";
import { z } from "zod";
import { applicationPath, readApplication } from "@/lib/apply/store";
import { isLocalMode, pdfTimeoutMs } from "@/lib/environment";

const body = z.object({ slug: z.string() });

export const maxDuration = 120;

/**
 * El PDF es la MISMA pagina impresa, no un segundo diseno.
 *
 * ⚠ Las dos esperas de abajo no son paranoia: sin `networkidle` la foto —que no
 * va— y las fuentes pueden no haber llegado, y sin `document.fonts.ready` el
 * texto se imprime con la fuente de sistema y el salto de pagina cae en otro
 * lado. Las dos fallan en silencio: el PDF sale, y sale mal.
 */
export async function POST(request: Request) {
  if (!isLocalMode()) return new NextResponse(null, { status: 404 });

  const parsed = body.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Pedido invalido." }, { status: 400 });
  }

  const { slug } = parsed.data;
  let app: Awaited<ReturnType<typeof readApplication>>;
  try {
    app = await readApplication(slug);
  } catch {
    return NextResponse.json(
      { error: "Esa postulacion no existe." },
      { status: 404 }
    );
  }

  const origin = new URL(request.url).origin;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`${origin}/preview/${slug}`, {
      waitUntil: "networkidle",
      timeout: pdfTimeoutMs(),
    });
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" },
    });

    const dashes = (text: string) =>
      text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w]+/g, "-")
        .replace(/^-|-$/g, "");
    const file = `CV-${dashes(app.tailored.resume.name)}-${dashes(app.meta.company)}.pdf`;
    await writeFile(join(applicationPath(slug), "cv.pdf"), pdf);

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${file}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Fallo la impresion a PDF.",
      },
      { status: 500 }
    );
  } finally {
    await browser.close();
  }
}
