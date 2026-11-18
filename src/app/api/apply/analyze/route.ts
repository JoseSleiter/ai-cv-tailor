import { NextResponse } from "next/server";
import { FabricationError } from "@/lib/apply/guard";
import { hasReadableContent, jobOfferSchema } from "@/lib/apply/job-offer";
import { applicationSlug, saveApplication } from "@/lib/apply/store";
import { readJobOffer, tailorResume } from "@/lib/apply/tailor-service";
import { isLocalMode } from "@/lib/environment";

/** Paso 1 + 2: leer la oferta y adaptar el CV. */
export async function POST(request: Request) {
  if (!isLocalMode()) return new NextResponse(null, { status: 404 });

  const parsed = jobOfferSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Oferta invalida." }, { status: 400 });
  }
  if (!hasReadableContent(parsed.data)) {
    return NextResponse.json(
      {
        error:
          "Pega el texto de la oferta o sube una captura: asi no hay nada que leer.",
      },
      { status: 400 }
    );
  }

  try {
    const spec = await readJobOffer(parsed.data);
    const tailored = await tailorResume(spec);
    const slug = applicationSlug(spec);
    await saveApplication({
      meta: {
        slug,
        company: spec.company,
        role: spec.role,
        locale: spec.locale,
        focus: spec.focus,
        matchScore: tailored.matchScore,
        createdAt: new Date().toISOString(),
        status: "draft",
      },
      offer: parsed.data,
      spec,
      tailored,
    });
    return NextResponse.json({ slug, spec, tailored });
  } catch (error) {
    if (error instanceof FabricationError) {
      return NextResponse.json(
        { error: error.message, violations: error.violations },
        { status: 422 }
      );
    }
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Fallo la adaptacion.",
      },
      { status: 500 }
    );
  }
}
