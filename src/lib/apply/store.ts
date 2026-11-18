import "server-only";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { applicationsDir } from "@/lib/environment";
import type { JobOffer } from "./job-offer";
import type { ApplicationEmail, JobSpec, TailoredResume } from "./schemas";

/**
 * Una carpeta por postulacion, en el disco de Sleiter y en el `.gitignore`.
 *
 * ⇒ Por que archivos y no una base: lo que se guarda es lo que se mando a una
 * empresa. Se tiene que poder abrir dentro de seis meses sin levantar este
 * proyecto, y un `cat email.md` siempre va a funcionar.
 */

export interface ApplicationMeta {
  slug: string;
  company: string;
  role: string;
  locale: string;
  focus: string;
  matchScore: number;
  createdAt: string;
  /** Lo marca la persona a mano cuando efectivamente lo envio. */
  status: "draft" | "sent";
}

export interface Application {
  meta: ApplicationMeta;
  offer?: JobOffer;
  spec: JobSpec;
  tailored: TailoredResume;
  email?: ApplicationEmail;
}

const SAFE_SLUG = /^[a-z0-9-]{3,120}$/;

const slugify = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

export const applicationSlug = (spec: JobSpec, now = new Date()): string =>
  [
    now.toISOString().slice(0, 10),
    slugify(spec.company) || "empresa",
    slugify(spec.role) || "puesto",
  ].join("-");

/**
 * ⛔ El slug viaja en una URL (`/preview/<id>`) y termina en una ruta de
 * archivo. Se valida contra una lista blanca, no se "limpia": una ruta que se
 * sanea es una ruta que alguien va a saber des-sanear.
 */
export function applicationPath(slug: string): string {
  if (!SAFE_SLUG.test(slug)) {
    throw new Error(`Slug de postulacion invalido: ${slug}`);
  }
  const root = resolve(process.cwd(), applicationsDir());
  const path = resolve(root, slug);
  if (!path.startsWith(`${root}/`)) {
    throw new Error(`Slug de postulacion fuera de la carpeta: ${slug}`);
  }
  return path;
}

export async function saveApplication(app: Application): Promise<string> {
  const dir = applicationPath(app.meta.slug);
  await mkdir(dir, { recursive: true });
  const write = (file: string, body: string) =>
    writeFile(join(dir, file), body, "utf8");

  await Promise.all([
    write("meta.json", JSON.stringify(app.meta, null, 2)),
    write("spec.json", JSON.stringify(app.spec, null, 2)),
    write("tailored.json", JSON.stringify(app.tailored, null, 2)),
    app.offer
      ? write(
          "job.json",
          JSON.stringify(
            { ...app.offer, images: app.offer.images.length },
            null,
            2
          )
        )
      : Promise.resolve(),
    /**
     * El correo se guarda DOS veces a proposito: `email.md` para poder leerlo
     * dentro de seis meses con un `cat`, y `email.json` para que la
     * herramienta pueda volver a CARGARLO. Sin el segundo, retomar una
     * postulacion perdia la carta — que es exactamente lo que paso la primera
     * vez que se uso de verdad.
     */
    app.email
      ? write("email.md", `# ${app.email.subject}\n\n${app.email.body}\n`)
      : Promise.resolve(),
    app.email
      ? write("email.json", JSON.stringify(app.email, null, 2))
      : Promise.resolve(),
  ]);
  return dir;
}

export async function readApplication(slug: string): Promise<Application> {
  const dir = applicationPath(slug);
  const read = async (file: string) =>
    JSON.parse(await readFile(join(dir, file), "utf8"));
  const [meta, spec, tailored] = await Promise.all([
    read("meta.json"),
    read("spec.json"),
    read("tailored.json"),
  ]);
  /** El correo es OPCIONAL: una postulacion puede estar adaptada y sin carta. */
  const email = await read("email.json").catch(() => undefined);
  return { meta, spec, tailored, email };
}

export async function listApplications(): Promise<ApplicationMeta[]> {
  const root = resolve(process.cwd(), applicationsDir());
  let entries: string[];
  try {
    entries = await readdir(root);
  } catch {
    return [];
  }
  const metas = await Promise.all(
    entries.map(async (slug) => {
      try {
        return JSON.parse(
          await readFile(join(root, slug, "meta.json"), "utf8")
        ) as ApplicationMeta;
      } catch {
        return null;
      }
    })
  );
  return metas
    .filter((meta): meta is ApplicationMeta => meta !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
