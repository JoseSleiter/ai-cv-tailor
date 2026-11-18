import { WandSparklesIcon } from "lucide-react";

/**
 * El acceso al workbench, en los controles de la pagina.
 *
 * ⚠ No pregunta si la herramienta esta encendida: `/apply` tiene dos caras y la
 * de la nube explica el proyecto. Ocultarlo en produccion escondería justo lo
 * que hace interesante a este CV.
 */
export function TailorLink({ label }: { label: string }) {
  return (
    <a
      href="/apply"
      aria-label={label}
      title={label}
      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
    >
      <WandSparklesIcon className="size-4" aria-hidden="true" />
    </a>
  );
}
