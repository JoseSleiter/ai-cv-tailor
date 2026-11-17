# ai-cv-tailor — Resumen técnico

> Documento de contexto del proyecto. Describe qué se construye sobre el boilerplate
> [BartoszJarocki/cv](https://github.com/BartoszJarocki/cv), la **idea arquitectónica central**, el
> modelo de datos y el mapa de las dos superficies: el **CV público** (nube) y el **workbench de
> postulación** (sólo local).

---

## 1. Qué es

Un CV online minimalista y print-friendly —el de siempre, desplegado en la nube— **más** una
herramienta que **sólo corre en local**: pegás una oferta de trabajo (link, imagen o texto), y
usando Claude Code como motor de IA te devuelve

1. una **versión del CV adaptada al 99 % a esa vacante**, con el mismo diseño exacto,
2. el **PDF** ya generado y nombrado (`CV-Jose-Sleiter-<Empresa>.pdf`), y
3. el **correo de postulación** listo para copiar, pegar y enviar a mano con ese PDF adjunto.

```
oferta (link | imagen | texto)
    → extraer JobSpec            (Claude, visión si es imagen)
    → adaptar ResumeData         (Claude, con guardas anti-invención)
    → revisar y editar a mano    (workbench: diff lado a lado)
    → PDF (Playwright print)  +  correo (template propio + JobSpec)
    → enviar manualmente
```

**El envío siempre es manual.** La herramienta no manda correos: prepara el material. Eso es una
decisión, no una limitación — quien postula lee y aprueba antes de que algo salga a su nombre.

---

## 2. La idea arquitectónica central

En el boilerplate, **todo el CV es un objeto tipado**:

```ts
export const RESUME_DATA: ResumeData = { name, summary, work[], education[], skills[], projects[] }
```

y los componentes (`header`, `work-experience`, `skills`, …) sólo lo renderizan.

⇒ **La IA nunca escribe HTML, CSS ni toca un componente.** Su única salida es **otro `ResumeData`**.
De ahí salen tres propiedades gratis:

| Propiedad | Por qué |
|---|---|
| **Fidelidad visual 100 %** | El PDF adaptado usa exactamente los mismos componentes y el mismo CSS `print:` que el CV público. No hay dos diseños que mantener. |
| **Validable** | La salida se valida con **zod** contra el mismo tipo. Una respuesta malformada se rechaza antes de llegar a la pantalla. |
| **Auditable** | Dos `ResumeData` se pueden **diffear campo por campo**. Eso es lo que hace posible la guarda anti-invención y la revisión humana. |

---

## 3. Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | **Next.js 16** (App Router, React 19), TypeScript — heredado del boilerplate |
| UI | Tailwind CSS v3 + Radix Dialog + `cmdk` + `lucide-react` + Geist |
| Backend | **Server Actions** + Route Handlers (runtime Node, nunca edge) |
| IA | **`@anthropic-ai/claude-agent-sdk`** (v0.3.x) — habla con el binario `claude` ya autenticado en la máquina |
| Validación | **zod** sobre `ResumeData`, `JobSpec` y `ApplicationEmail` |
| PDF | **Playwright** (Chromium headless) imprimiendo la ruta `/preview/[id]` |
| Persistencia | Sistema de archivos local: `.applications/<slug>/` (en `.gitignore`) |
| Tests | **Vitest** (unit: guardas, zod, normalizadores) + **Playwright** (e2e con IA mockeada) |
| Lint/format | **Biome** (ya configurado en el boilerplate) |
| Deploy | **Vercel** — despliega sólo el CV público; el workbench queda apagado por configuración |

**Node**: el boilerplate pide Next 16 + React 19 ⇒ **Node ≥ 20**. La máquina tiene 16.16.0 como
`node` por defecto, así que el repo fija la versión (`.nvmrc` + `mise.toml`) y el README lo dice.
**Gestor de paquetes**: `pnpm` (lo declara `packageManager` del upstream) — hay que instalarlo.

---

## 4. Por qué el motor es el Claude Agent SDK y no una API key

El SDK **reusa la autenticación local de Claude Code**: no hay `ANTHROPIC_API_KEY`, no hay costo por
postulación, no hay secreto que rotar ni que filtrar en un repo público.

Y la consecuencia es exactamente la que se quería: **la función no puede correr en la nube.** El
servidor de Vercel no tiene el binario `claude` ni la sesión del usuario. La restricción
“sólo local” no se implementa con un `if` que alguien puede saltarse — es **estructural**.

⚠ El costo: el repo sólo es útil a quien tenga Claude Code instalado y logueado. Para los demás, el
README explicará cómo enchufar un proveedor alternativo detrás de la interfaz `AiProvider`.

---

## 5. Modelo de datos

### 5.1 Lo heredado — `ResumeData` (`src/lib/types.ts`)

`name`, `location`, `about`, `summary`, `avatar`, `siteUrl`, `contact{email,tel,social[]}`,
`education[]`, `work[]{company,link,badges[],title,start,end,description,highlights?[]}`,
`skills[]`, `projects[]{title,techStack[],description,link?}`.

⚠ **`avatar` es un `StaticImageData`** (lo importa Webpack, no es serializable a JSON). El tipo que
viaja a/desde la IA es por lo tanto `Omit<ResumeData, "avatar">`, y el avatar se vuelve a enganchar
en el render. Pasarlo por alto rompe la serialización sin un error claro.

### 5.2 Lo nuevo

```ts
JobSpec {                      // lo que la IA EXTRAE de la oferta
  company, role, seniority, location, workMode,     // remote | hybrid | onsite
  language,                    // idioma de la oferta ⇒ idioma del CV y del correo
  mustHave[], niceToHave[], responsibilities[],
  atsKeywords[],               // términos literales que conviene que aparezcan
  tone,                        // startup | corporate | agency
  sourceUrl?, rawText
}

TailoredResume {
  resume: Omit<ResumeData,"avatar">,
  changelog: Change[],         // { section, field, before, after, reason }
  matchScore: number,          // 0-100, autoevaluación declarada como orientativa
  gaps[]                       // requisitos que NO se cumplen, dichos de frente
}

ApplicationEmail { subject, body, language }

Application {                  // una postulación en disco
  id, slug, createdAt, job: JobSpec, tailored: TailoredResume,
  email: ApplicationEmail, pdfPath, status  // draft | sent
}
```

### 5.3 ⛔ La guarda anti-invención (lo más importante del proyecto)

Un CV adaptado por IA **miente si no se lo controla**, y mentir en un CV es el peor defecto posible
del producto. Por eso la frontera se declara en el código, no en el prompt:

| La IA **SÍ** puede | La IA **NO** puede |
|---|---|
| Reordenar trabajos, skills y proyectos por relevancia | Inventar una empresa, un cargo o un proyecto |
| Reescribir `summary`, `about` y `description` | Cambiar `start` / `end` de un trabajo o estudio |
| Elegir qué `highlights` mostrar y cuáles omitir | Inventar un `highlight` que no esté en la fuente |
| Elegir qué `badges` / `techStack` destacar | Agregar una skill fuera de `SKILLS_MASTER` |
| Traducir todo al idioma de la oferta | Tocar nombre, contacto o títulos académicos |

Y **se verifica después**, no se confía en el prompt: `assertNoFabrication(original, tailored)`
compara los dos objetos y falla si un conjunto de empresas, fechas, títulos o skills no es
subconjunto del original. Si falla ⇒ un reintento con el error como feedback; si vuelve a fallar ⇒
se le muestra la violación al humano y **no se genera PDF**.

⇒ Esto es también lo que se cuenta en una entrevista: no “usé IA”, sino **cómo se acota una IA
generativa con un contrato de tipos y una verificación posterior**.

---

## 6. Mapa de pantallas

### 6.1 Superficie pública (nube y local)

| Ruta | Qué es | Cambio respecto al boilerplate |
|---|---|---|
| `/` | El CV de siempre (`RESUME_DATA`) | Se refactoriza a `<Resume data={…} />` para que el mismo árbol sirva al preview adaptado. Se agrega el **botón de postulación**. |
| `/llms.txt`, `/index.txt`, `/index.md` | Exportes de texto del CV | Sin cambios |

**El botón de postulación**: va en la zona de acciones del header. Su destino es siempre `/apply`;
lo que cambia es **qué renderiza esa ruta**.

### 6.2 `/apply` — la ruta de doble cara

```
isLocalMode() === true   →  WORKBENCH  (la herramienta entera)
isLocalMode() === false  →  INSTRUCCIONES  (cómo clonar, instalar y correrlo en local)
```

`isLocalMode()` es **server-side** y vive en un solo archivo (`src/lib/environment.ts`): exige
`CV_AI_ENABLED=1` **y** ausencia de `process.env.VERCEL`. La versión instrucciones no incluye
siquiera el bundle del workbench.

### 6.3 Workbench (sólo local)

| Paso | Pantalla | Qué hace |
|---|---|---|
| 1 | **Ingesta** | Tres entradas en tabs: **Texto** (pegar), **Link** (fetch + extracción a texto en el servidor), **Imagen** (drop de capturas → visión de Claude). |
| 2 | **Análisis** | Muestra el `JobSpec` extraído —empresa, rol, must-have, keywords ATS, idioma detectado— para **confirmar o corregir antes** de adaptar. |
| 3 | **Adaptación** | Vista partida: izquierda el `changelog` por sección con **aceptar / descartar / editar** por cambio; derecha el **CV renderizado en vivo**. Se muestran `matchScore` y `gaps`. |
| 4 | **Entrega** | Botón **Descargar PDF** (Playwright) y el **correo** en un bloque con *copiar al portapapeles*, generado desde la plantilla propia del usuario. |

### 6.4 `/preview/[id]` — la ruta que se imprime

Server component que lee `.applications/<id>/tailored.json` y renderiza `<Resume data>`. Es la
página que Playwright abre para imprimir. **Sólo existe en modo local**, y es `noindex`.

---

## 7. Generación del PDF

`POST /api/pdf` (runtime Node) → Playwright lanza Chromium headless → abre
`http://127.0.0.1:<puerto>/preview/<id>` → `page.pdf({ format: "A4", printBackground: true })`.

- El CSS `print:` del boilerplate ya está afinado (`print:p-0`, `print:space-y-3`, `print:max-w-none`).
- Nombre del archivo: `CV-<Nombre>-<Empresa>.pdf`, slug seguro.
- El puerto se toma del request, no se hardcodea.
- El PDF se guarda en `.applications/<slug>/` **y** se devuelve al navegador para descarga.

⚠ Riesgos medidos a atender en su fase: fuentes (Geist) que no cargan a tiempo ⇒ esperar
`document.fonts.ready`; el avatar remoto ⇒ esperar `networkidle`; y Chromium de Playwright que hay
que instalar una vez (`pnpm exec playwright install chromium`).

---

## 8. El correo

La plantilla del usuario vive en **datos**, no en un prompt: `src/data/email-template.ts`, con
marcadores (`{{company}}`, `{{role}}`, `{{hook}}`). Cualquiera que forkee el repo pone la suya y la
herramienta sigue funcionando — es parte del diseño, no un extra.

La IA recibe la plantilla + el `JobSpec` + el CV adaptado, y devuelve `{subject, body}` en el idioma
de la oferta, **conservando la voz de la plantilla**. La UI lo muestra en texto plano con un botón
de copiar; opcionalmente genera un `.eml` arrastrable al cliente de correo.

---

## 9. Variables de entorno

Todas en `.env.local` (ya ignorado por git). `.env.example` versionado documenta cada una.

```
CV_AI_ENABLED=1                 # enciende el workbench. Ausente o 0 ⇒ /apply muestra instrucciones
NEXT_PUBLIC_CV_AI_ENABLED=1     # sólo para decidir el rótulo del botón en el cliente
CV_AI_MODEL=claude-opus-5       # modelo que usa el Agent SDK
CV_APPLICATIONS_DIR=.applications
CV_PDF_TIMEOUT_MS=30000
```

⛔ **Ninguna de estas es un secreto**, y es a propósito: la autenticación la pone Claude Code, no el
repo. En Vercel no se configura ninguna ⇒ el workbench queda apagado por omisión, no por olvido.

---

## 10. Qué NO entra (alcance declarado)

- **No se envían correos.** Ni SMTP, ni API de Gmail, ni borradores automáticos.
- **No se scrapean portales con login** (LinkedIn, Workday). Cuando el `fetch` del link no
  devuelva texto útil, la UI lo dice y ofrece la vía de imagen o texto. Eso se prueba y se documenta,
  no se promete.
- **No hay base de datos ni cuentas.** La persistencia es el sistema de archivos local.
- **No se toca el diseño del CV.** Las PRs al diseño se mantienen rebaseables contra el upstream.
- **No hay multiusuario.** Es una herramienta personal que corre en la máquina de quien postula.

---

## 11. Relación con el upstream

Fork no oficial de `BartoszJarocki/cv` (MIT). El remote `upstream` queda configurado para poder
traer mejoras del original. La atribución va en el README y la `LICENSE` original se conserva.
⇒ Los cambios al **template** se mantienen mínimos y aislados, justamente para que un
`git merge upstream/main` siga siendo barato.
