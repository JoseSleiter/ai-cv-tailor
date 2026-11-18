import { NextResponse } from "next/server";
import { readApplication } from "@/lib/apply/store";
import { isLocalMode } from "@/lib/environment";

/**
 * Devuelve una postulacion guardada, para RETOMARLA.
 *
 * ⚠ Existe porque el workbench tenia su estado solo en memoria: al recargar, la
 * postulacion quedaba en el historial sin forma de volver a ella —ni carta, ni
 * PDF, ni changelog—. Un trabajo que se guardo y no se puede abrir es un
 * trabajo perdido con apariencia de guardado.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isLocalMode()) return new NextResponse(null, { status: 404 });

  const { slug } = await params;
  try {
    const app = await readApplication(slug);
    return NextResponse.json({
      slug: app.meta.slug,
      spec: app.spec,
      tailored: app.tailored,
      email: app.email ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Esa postulacion no existe." },
      { status: 404 }
    );
  }
}
