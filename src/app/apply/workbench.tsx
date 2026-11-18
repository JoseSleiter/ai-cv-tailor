"use client";

import { useRef, useState } from "react";
import type { EmailVariant } from "@/data/email-template";
import type { JobImage } from "@/lib/ai/provider";
import type {
  ApplicationEmail,
  JobSpec,
  TailoredResume,
} from "@/lib/apply/schemas";
import type { ApplicationMeta } from "@/lib/apply/store";

type Tab = "text" | "link" | "image";

interface Analysis {
  slug: string;
  spec: JobSpec;
  tailored: TailoredResume;
}

interface WorkbenchProps {
  applications: ApplicationMeta[];
  voiceSampleCount: number;
}

const post = async <T,>(url: string, body: unknown, method = "POST") => {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      [payload.error, ...(payload.violations ?? [])].filter(Boolean).join("\n")
    );
  }
  return payload as T;
};

const fileToImage = (file: File): Promise<JobImage> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`No se pudo leer ${file.name}.`));
    reader.onload = () => {
      const [, data] = String(reader.result).split(",");
      resolve({ mediaType: file.type as JobImage["mediaType"], data });
    };
    reader.readAsDataURL(file);
  });

export function Workbench({ applications, voiceSampleCount }: WorkbenchProps) {
  const [tab, setTab] = useState<Tab>("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [images, setImages] = useState<JobImage[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [email, setEmail] = useState<ApplicationEmail | null>(null);
  const [variant, setVariant] = useState<EmailVariant>("coldOutreach");
  const [samples, setSamples] = useState(voiceSampleCount);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);
  const sampleRef = useRef<HTMLTextAreaElement>(null);

  const run = async (label: string, task: () => Promise<void>) => {
    setBusy(label);
    setError(null);
    try {
      await task();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setBusy(null);
    }
  };

  const fetchLink = () =>
    run("Bajando la oferta…", async () => {
      const result = await post<{ text: string; blocked: boolean }>(
        "/api/job/fetch",
        { url }
      );
      setText(result.text);
      setTab("text");
      if (result.blocked) {
        setError(
          "Ese portal sirve un cascarón detrás de un login: lo que bajó no es la oferta. Pegá el texto o subí una captura."
        );
      }
    });

  const analyze = () =>
    run("Leyendo la oferta y adaptando el CV…", async () => {
      const result = await post<Analysis>("/api/apply/analyze", {
        source: tab,
        sourceUrl: url || undefined,
        text,
        images,
      });
      setAnalysis(result);
      setEmail(null);
      setPreviewKey((key) => key + 1);
    });

  const saveTailored = (tailored: TailoredResume) =>
    run("Guardando…", async () => {
      if (!analysis) return;
      await post(
        "/api/apply/tailored",
        { slug: analysis.slug, tailored },
        "PUT"
      );
      setAnalysis({ ...analysis, tailored });
      setPreviewKey((key) => key + 1);
    });

  const writeEmail = () =>
    run("Redactando la carta…", async () => {
      if (!analysis) return;
      const result = await post<{ email: ApplicationEmail }>(
        "/api/apply/email",
        { slug: analysis.slug, variant }
      );
      setEmail(result.email);
    });

  const downloadPdf = () =>
    run("Imprimiendo el PDF…", async () => {
      if (!analysis) return;
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: analysis.slug }),
      });
      if (!response.ok) {
        throw new Error((await response.json()).error ?? "Falló el PDF.");
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `CV-${analysis.spec.company}.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    });

  const addSample = () =>
    run("Guardando la muestra…", async () => {
      const value = sampleRef.current?.value ?? "";
      const result = await post<{ count: number }>("/api/voice-samples", {
        locale: /\b(el|la|los|gracias|saludos)\b/i.test(value) ? "es" : "en",
        source: "Correo propio, agregado desde el workbench.",
        text: value,
      });
      setSamples(result.count);
      if (sampleRef.current) sampleRef.current.value = "";
    });

  const dropChange = (field: string) => {
    if (!analysis) return;
    const tailored = { ...analysis.tailored };
    if (field === "highlighted") tailored.highlighted = [];
    tailored.changelog = tailored.changelog.filter((c) => c.field !== field);
    saveTailored(tailored);
  };

  return (
    <main className="container mx-auto max-w-6xl space-y-8 p-4 md:p-10">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-pixel text-[28px] leading-none">
          Adaptar el CV a una vacante
        </h1>
        <a className="text-sm underline" href="/">
          ← Volver al CV
        </a>
      </header>

      <section className="space-y-2 rounded-lg border border-muted p-4">
        <h2 className="font-semibold text-sm">
          Tus correos de muestra ({samples})
        </h2>
        <p className="text-pretty text-xs text-muted-foreground">
          La carta se escribe con tu voz, y la voz sale de correos que{" "}
          <strong>vos</strong> escribiste. Con una alcanza, dos es lo bueno.
          Nunca se toma un dato de ellos: los hechos salen del CV.
          {samples < 2 && " Te falta al menos una."}
        </p>
        <textarea
          ref={sampleRef}
          className="h-24 w-full rounded border border-muted bg-transparent p-2 text-xs"
          placeholder="Pegá acá un correo de postulación que hayas enviado."
        />
        <button
          type="button"
          className="rounded border border-muted px-3 py-1 text-xs hover:bg-muted"
          onClick={addSample}
        >
          Guardar la muestra
        </button>
      </section>

      <section className="space-y-3">
        <div className="flex gap-2 text-sm">
          {(["text", "link", "image"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded px-3 py-1 ${tab === key ? "bg-foreground text-background" : "border border-muted"}`}
            >
              {key === "text" ? "Texto" : key === "link" ? "Enlace" : "Imagen"}
            </button>
          ))}
        </div>

        {tab === "link" && (
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border border-muted bg-transparent p-2 text-sm"
              placeholder="https://…"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
            <button
              type="button"
              className="rounded border border-muted px-3 text-sm hover:bg-muted"
              onClick={fetchLink}
            >
              Bajar
            </button>
          </div>
        )}

        {tab === "image" && (
          <div className="space-y-1">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple={true}
              className="text-sm"
              onChange={async (event) => {
                const files = [...(event.target.files ?? [])];
                setImages(await Promise.all(files.map(fileToImage)));
              }}
            />
            <p className="text-xs text-muted-foreground">
              {images.length} captura(s) cargada(s).
            </p>
          </div>
        )}

        <textarea
          className="h-48 w-full rounded border border-muted bg-transparent p-3 text-sm"
          placeholder="Pegá acá la oferta completa."
          value={text}
          onChange={(event) => setText(event.target.value)}
        />

        <button
          type="button"
          className="rounded bg-foreground px-4 py-2 text-background text-sm disabled:opacity-50"
          onClick={analyze}
          disabled={busy !== null}
        >
          Analizar y adaptar
        </button>
      </section>

      {busy && <p className="text-sm text-muted-foreground">{busy}</p>}
      {error && (
        <pre className="whitespace-pre-wrap rounded border border-muted p-3 text-sm text-body">
          {error}
        </pre>
      )}

      {analysis && (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold text-sm">
                {analysis.spec.role} · {analysis.spec.company}
              </h2>
              <p className="text-xs text-muted-foreground">
                {analysis.spec.locale.toUpperCase()} · foco{" "}
                {analysis.spec.focus} · coincidencia{" "}
                {analysis.tailored.matchScore}/100
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-xs uppercase tracking-wide">
                Palabras clave resaltadas
              </h3>
              <p className="text-sm text-body">
                {analysis.tailored.highlighted.join(" · ") || "ninguna"}
              </p>
            </div>

            {analysis.tailored.gaps.length > 0 && (
              <div className="space-y-1">
                <h3 className="font-semibold text-xs uppercase tracking-wide">
                  Lo que la oferta pide y el CV no cubre
                </h3>
                <ul className="space-y-0.5 text-sm text-body">
                  {analysis.tailored.gaps.map((gap) => (
                    <li key={gap}>· {gap}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-semibold text-xs uppercase tracking-wide">
                Qué cambió
              </h3>
              {analysis.tailored.changelog.map((entry) => (
                <div
                  key={`${entry.field}-${entry.change}`}
                  className="flex items-start justify-between gap-3 border-muted border-b pb-2 text-sm"
                >
                  <span className="text-body">
                    <strong className="font-semibold">{entry.field}</strong> —{" "}
                    {entry.change}
                    <span className="block text-muted-foreground text-xs">
                      {entry.reason}
                    </span>
                  </span>
                  {entry.field === "highlighted" && (
                    <button
                      type="button"
                      className="shrink-0 text-xs underline"
                      onClick={() => dropChange(entry.field)}
                    >
                      descartar
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded bg-foreground px-4 py-2 text-background text-sm"
                onClick={downloadPdf}
              >
                Descargar el PDF
              </button>
              <select
                className="rounded border border-muted bg-transparent px-2 text-sm"
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as EmailVariant)
                }
              >
                <option value="coldOutreach">Contacto en frío</option>
                <option value="recruiterReply">
                  Respuesta a un reclutador
                </option>
              </select>
              <button
                type="button"
                className="rounded border border-muted px-4 py-2 text-sm hover:bg-muted"
                onClick={writeEmail}
              >
                Redactar la carta
              </button>
            </div>

            {email && (
              <div className="space-y-2 rounded-lg border border-muted p-4">
                <CopyBlock label="Asunto" value={email.subject} />
                <CopyBlock label="Cuerpo" value={email.body} multiline={true} />
                {email.pendingPlaceholders.length > 0 && (
                  <p className="text-xs text-body">
                    ⛔ Completá a mano antes de enviar:{" "}
                    {email.pendingPlaceholders.join(", ")}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="min-h-[70vh] overflow-hidden rounded-lg border border-muted">
            <iframe
              key={previewKey}
              title="CV adaptado"
              className="h-full min-h-[70vh] w-full"
              src={`/preview/${analysis.slug}?v=${previewKey}`}
            />
          </div>
        </section>
      )}

      {applications.length > 0 && (
        <section className="space-y-1">
          <h2 className="font-semibold text-sm">Postulaciones anteriores</h2>
          <ul className="space-y-0.5 text-sm text-muted-foreground">
            {applications.map((item) => (
              <li key={item.slug}>
                {item.createdAt.slice(0, 10)} · {item.company} · {item.role} ·{" "}
                {item.matchScore}/100 ·{" "}
                <a className="underline" href={`/preview/${item.slug}`}>
                  ver
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

function CopyBlock({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xs uppercase tracking-wide">
          {label}
        </span>
        <button
          type="button"
          className="text-xs underline"
          onClick={() => navigator.clipboard.writeText(value)}
        >
          copiar
        </button>
      </div>
      <p
        className={`whitespace-pre-wrap text-body text-sm ${multiline ? "" : "truncate"}`}
      >
        {value}
      </p>
    </div>
  );
}
