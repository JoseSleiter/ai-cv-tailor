import type { Metadata } from "next";
import { listApplications } from "@/lib/apply/store";
import { loadVoiceSamples } from "@/lib/apply/voice-store";
import { isLocalMode } from "@/lib/environment";
import { LocalOnlyNotice } from "./local-only-notice";
import { Workbench } from "./workbench";

export const metadata: Metadata = {
  title: "Adaptar el CV a una vacante",
  description:
    "Herramienta local que adapta este CV a una oferta concreta y redacta la carta de presentación.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * La ruta tiene DOS caras y la de la nube no es un mensaje de error: es la que
 * ve un reclutador que hace clic desde el CV. Se escribe con el mismo cuidado
 * que el CV.
 */
export default async function ApplyPage() {
  if (!isLocalMode()) return <LocalOnlyNotice />;

  const [applications, samples] = await Promise.all([
    listApplications(),
    loadVoiceSamples(),
  ]);

  return (
    <Workbench applications={applications} voiceSampleCount={samples.length} />
  );
}
