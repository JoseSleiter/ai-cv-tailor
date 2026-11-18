import { NextResponse } from "next/server";
import {
  addVoiceSample,
  loadVoiceSamples,
  voiceSampleSchema,
} from "@/lib/apply/voice-store";
import { isLocalMode } from "@/lib/environment";

export async function GET() {
  if (!isLocalMode()) return new NextResponse(null, { status: 404 });
  const samples = await loadVoiceSamples();
  return NextResponse.json({
    samples: samples.map(({ id, locale, source, text }) => ({
      id,
      locale,
      source,
      preview: text.slice(0, 160),
    })),
  });
}

export async function POST(request: Request) {
  if (!isLocalMode()) return new NextResponse(null, { status: 404 });
  const parsed = voiceSampleSchema
    .omit({ id: true })
    .safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Pega un correo tuyo completo (al menos unas lineas)." },
      { status: 400 }
    );
  }
  const count = await addVoiceSample({
    ...parsed.data,
    id: `propio-${Date.now()}`,
  });
  return NextResponse.json({ count });
}
