import { NextResponse } from "next/server";
import { z } from "zod";
import { collectViolations } from "@/lib/apply/guard";
import { tailoredResumeSchema } from "@/lib/apply/schemas";
import { readApplication, saveApplication } from "@/lib/apply/store";
import { baseResumeFor } from "@/lib/apply/tailor-service";
import { isLocalMode } from "@/lib/environment";

const body = z.object({ slug: z.string(), tailored: tailoredResumeSchema });

/**
 * Guarda el CV adaptado despues de que la PERSONA lo edito.
 *
 * ⚠ Vuelve a correr la guarda. No es desconfianza del usuario: es que el
 * cliente es editable y el PDF se imprime de lo que haya en disco. Un control
 * que solo corre en el camino de la IA no controla el archivo que se manda.
 */
export async function PUT(request: Request) {
  if (!isLocalMode()) return new NextResponse(null, { status: 404 });

  const parsed = body.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "CV invalido." }, { status: 400 });
  }

  try {
    const app = await readApplication(parsed.data.slug);
    const violations = collectViolations(
      baseResumeFor(app.spec),
      parsed.data.tailored
    );
    if (violations.length > 0) {
      return NextResponse.json(
        { error: "Edicion rechazada.", violations },
        { status: 422 }
      );
    }
    await saveApplication({
      ...app,
      tailored: parsed.data.tailored,
      meta: { ...app.meta, matchScore: parsed.data.tailored.matchScore },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No se pudo guardar." },
      { status: 500 }
    );
  }
}
