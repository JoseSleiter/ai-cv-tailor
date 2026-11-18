import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { z } from "zod";
import { VOICE_SAMPLES, type VoiceSample } from "@/data/voice-samples";
import { applicationsDir } from "@/lib/environment";

/**
 * Las muestras de voz que Sleiter agrega DESDE la herramienta.
 *
 * ⇒ Viven en `.applications/voice-samples.json` y no en el codigo: son suyas,
 * cambian con el tiempo y no tienen por que viajar en un repo publico. Las dos
 * que si estan versionadas (`src/data/voice-samples.ts`) son el piso para quien
 * clone esto.
 */

export const voiceSampleSchema = z.object({
  id: z.string().trim().min(1),
  locale: z.enum(["en", "es"]),
  source: z.string().trim().min(1),
  text: z.string().trim().min(120),
});

const fileSchema = z.array(voiceSampleSchema);

const storePath = () =>
  join(resolve(process.cwd(), applicationsDir()), "voice-samples.json");

export async function storedVoiceSamples(): Promise<VoiceSample[]> {
  try {
    const parsed = fileSchema.safeParse(
      JSON.parse(await readFile(storePath(), "utf8"))
    );
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export async function loadVoiceSamples(): Promise<readonly VoiceSample[]> {
  return [...VOICE_SAMPLES, ...(await storedVoiceSamples())];
}

export async function addVoiceSample(sample: VoiceSample): Promise<number> {
  const path = storePath();
  await mkdir(resolve(process.cwd(), applicationsDir()), { recursive: true });
  const samples = [
    ...(await storedVoiceSamples()).filter((s) => s.id !== sample.id),
    sample,
  ];
  await writeFile(path, JSON.stringify(samples, null, 2), "utf8");
  return VOICE_SAMPLES.length + samples.length;
}
