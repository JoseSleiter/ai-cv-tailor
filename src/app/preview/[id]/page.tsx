import { notFound } from "next/navigation";
import { Resume } from "@/components/resume/resume";
import { LABELS } from "@/data/resume-data";
import { readApplication } from "@/lib/apply/store";
import { isLocalMode } from "@/lib/environment";

export const metadata = { robots: { index: false, follow: false } };

/**
 * Lo que Playwright imprime, y lo que el workbench muestra en vivo.
 *
 * ⭐ Es `<Resume>`, el mismo componente del CV publico. No hay un segundo
 * diseno que mantener, asi que un arreglo de estilo en la home llega al PDF
 * adaptado sin que nadie se acuerde de replicarlo.
 *
 * ⚠ Y no recibe `avatar`: el CV adaptado se construye desde `ResumeContent`.
 * La ausencia de foto en el PDF es estructural, no un `print:hidden`.
 */
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isLocalMode()) notFound();

  const { id } = await params;
  try {
    const app = await readApplication(id);
    return (
      <Resume
        locale={app.spec.locale}
        data={app.tailored.resume}
        labels={LABELS[app.spec.locale]}
        highlighted={app.tailored.highlighted}
      />
    );
  } catch {
    notFound();
  }
}
