import { NextResponse } from "next/server";
import { z } from "zod";
import { readApplication, saveApplication } from "@/lib/apply/store";
import { draftEmail } from "@/lib/apply/tailor-service";
import { isLocalMode } from "@/lib/environment";

const body = z.object({
  slug: z.string(),
  variant: z.enum(["coldOutreach", "recruiterReply"]),
});

/** Paso 3: la carta de presentacion, sobre la postulacion ya guardada. */
export async function POST(request: Request) {
  if (!isLocalMode()) return new NextResponse(null, { status: 404 });

  const parsed = body.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Pedido invalido." }, { status: 400 });
  }

  try {
    const app = await readApplication(parsed.data.slug);
    const email = await draftEmail(app.spec, app.tailored, parsed.data.variant);
    await saveApplication({ ...app, email });
    return NextResponse.json({ email });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fallo el correo." },
      { status: 500 }
    );
  }
}
