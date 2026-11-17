# ai-cv-tailor — Plan de trabajo

> Plan por fases. Cada fase declara **qué entrega**, **cómo se verifica** y **qué NO entra**, para
> que el alcance sea decisión y no descubrimiento. El contexto técnico está en
> [`resumen-tecnico.md`](./resumen-tecnico.md).

## Decisiones ya tomadas (17-11-2026)

| Decisión | Elegido | Motivo |
|---|---|---|
| Motor de IA | **Claude Agent SDK** (`@anthropic-ai/claude-agent-sdk`) | Reusa el login local de Claude Code: cero API key, cero costo por postulación, y **la restricción “sólo local” queda estructural**, no un `if`. |
| PDF | **Playwright print-to-PDF** server-side | Un solo diseño. El PDF es la misma página con el mismo CSS `print:`. |
| Data del CV | **Bilingüe ES + EN, escrito a mano** | Sleiter ya tiene las dos versiones redactadas por él. La IA **no traduce**: elige el idioma según la oferta y adapta sobre su redacción. Una traducción automática de un CV se nota. |
| Repo | `JoseSleiter/ai-cv-tailor`, **público** | Sirve de portfolio y se enlaza desde la sección *side projects* del propio CV. |
| Ubicación local | `~/Documents/SSD/myProjects/07-ai-cv-tailor` | Sigue la numeración de los proyectos existentes. |
| Envío del correo | **Manual, siempre** | Nada sale a nombre de una persona sin que lo haya leído. |

---

## Fase 0 · Fundaciones

**Entrega**

- Repo creado, boilerplate en su primer commit con la atribución al upstream, remote `upstream` configurado.
- `.nvmrc` + `mise.toml` fijando **Node 22**, `pnpm` instalado, `pnpm install` verde.
- `pnpm dev` levanta el CV del boilerplate en `localhost:3000`.
- `.env.example` versionado con las cinco variables y una línea de qué hace cada una.
- `docs/` con este plan y el resumen técnico.

**Cómo se verifica**: `pnpm install && pnpm check && pnpm build` sin errores, y la home abre.

⛔ **No entra**: ninguna función nueva. Es la fase que prueba que el entorno es reproducible.

---

## Fase 1 · El CV se vuelve data-driven

El boilerplate importa `RESUME_DATA` **dentro** de cada componente. Para poder renderizar un CV
adaptado con los mismos componentes, el dato tiene que entrar por parámetro.

**Entrega**

- `src/components/resume/resume.tsx` → `<Resume data={ResumeData} />`, que mueve adentro lo que hoy
  está en `src/app/page.tsx`.
- `page.tsx` queda en `<Resume data={RESUME_DATA} />`.
- `getSections`, `getContactLinks` y `getPageTitle` ya reciben `data`: se revisa que no quede ningún
  import directo de `RESUME_DATA` dentro de los componentes.
- El `avatar` (`StaticImageData`) se separa del resto: `ResumeContent = Omit<ResumeData,"avatar">`.

**Cómo se verifica**: la home se ve **idéntica** antes y después — captura antes/después a tres
anchos (768, 1024, 1440) y la impresión (`Cmd+P`) a una sola página.

⛔ **No entra**: cambios de estilo. Si el render cambia un píxel, la refactorización está mal.

---

## Fase 2 · Data personal real ✅ (17-11-2026)

**Entregado**

- `src/data/resume-data.en.ts` y `resume-data.es.ts` — el CV completo en los **dos idiomas**,
  transcrito de los PDFs de 2026 de Sleiter. Sin una palabra inventada.
- `src/data/identity.ts` — lo que no cambia entre idiomas ni entre postulaciones (contacto, redes,
  `siteUrl`). ⛔ La guarda lo trata como **inmutable**.
- `src/data/resume-data.ts` — `RESUME_BY_LOCALE`, `LABELS` (rótulos de sección y "Present" por
  idioma) y `RESUME_DATA` (el default, con avatar).
- `src/data/skills-master.ts` — `SKILLS_MASTER` **derivado** de lo que el CV ya dice en los dos
  idiomas (skills + badges + techStack), más `isApprovedSkill()`. Derivado y no escrito a mano para
  que no pueda desincronizarse del contenido.
- `src/data/email-template.ts` — la plantilla propia en ES y EN, con marcadores y `guidance` de tono.
- Avatar de Bartosz **eliminado**, reemplazado por un placeholder neutro.

**Ajustes de tipo que la data real obligó** (ninguno cosmético):

- `WorkEntry.link` ahora es **opcional**: sin URL se renderiza texto plano, no un `<a href="">` roto.
  No había URLs de las empresas y no se inventan.
- `EducationEntry.start/end` **opcionales**: el CV no trae los años de UCAB, y un rango vacío
  renderizaba un guion suelto.
- `ResumeContent = Omit<ResumeData,"avatar">` y `Locale`, que es lo que viaja a la IA.

**Verificado**: `pnpm build` y `pnpm check` en verde con Node 22; `/index.txt` servido en local
muestra los cinco trabajos, la formación sin rango vacío y las 38 skills.

**Pendiente de Sleiter** (marcado con `TODO(sleiter)` en el código):

| Qué | Dónde |
|---|---|
| Años de inicio/egreso de UCAB | `resume-data.{en,es}.ts` → `education` |
| URLs de Ozmoit, Moonshot, TCIT, Grupo Hostienda | `work[].link` |
| Foto propia (reemplazar el placeholder) | `src/data/avatar.jpg` |
| Dominio propio, si lo hay | `src/data/identity.ts` → `SITE_URL` |
| Side projects además de este repo (¿Pool Pass?) | `projects` |
| **¿Go / Java / Spring Boot entran en `SKILLS_MASTER`?** | `skills-master.ts` → `EXTRA_APPROVED` |

⚠ **La última es una decisión, no un dato que falte.** La plantilla de correo que venías usando
declara *"Go, Java, Spring Boot"* y el CV de 2026 **no los lista en ninguna parte**. Quedaron
**fuera** de la lista maestra: el costo de un falso negativo (la IA no puede nombrar algo que sí
sabés) es muchísimo menor que el de un falso positivo (el CV afirma algo que no sostenés en la
entrevista). Se revierte agregándolos a `EXTRA_APPROVED`.

---

## Fase 3 · La puerta local/nube y el botón

**Entrega**

- `src/lib/environment.ts` → `isLocalMode()`, server-only, único lugar donde se decide. Exige
  `CV_AI_ENABLED=1` **y** ausencia de `process.env.VERCEL`.
- Botón **“Adaptar a una vacante”** en el header del CV, con ícono, siguiendo el estilo del template
  (mismo tratamiento tipográfico que los links existentes, nada de un botón de otro sistema visual).
  Es `print:hidden`.
- Ruta `/apply` con las dos caras:
  - **local** → el workbench (por ahora, un placeholder vacío);
  - **nube** → página de instrucciones: qué es, por qué sólo corre en local, y los cuatro comandos
    para clonarlo y levantarlo. Esta cara es la que ve un reclutador ⇒ se escribe con cuidado.
- `/apply` y `/preview/*` quedan en `robots.ts` como `noindex`.

**Cómo se verifica**: `CV_AI_ENABLED=1 pnpm dev` muestra el workbench; `pnpm build && pnpm start`
**sin** la variable muestra instrucciones; y el bundle de la versión nube **no contiene** el código
del workbench (se mira el output de `next build`).

---

## Fase 4 · Ingesta de la oferta

**Entrega**

- `JobInput` con tres tabs: **Texto**, **Link**, **Imagen** (drop de una o varias capturas).
- `POST /api/job/fetch`: baja la URL server-side con un User-Agent genérico, la pasa a texto plano y
  **declara honestamente** cuando no obtuvo contenido útil (portales con login) ofreciendo las otras
  dos vías.
- Las imágenes se mandan como base64 al proveedor de IA (visión).
- Normalizador → `JobOffer { source, rawText, images[] }`.

**Cómo se verifica**: unit tests del extractor HTML→texto con tres fixtures guardadas (una oferta
simple, una con mucho markup, una página de login). Y la vía *link* probada contra un portal real
que **sí** sirve HTML (ej. una oferta de una careers page propia) — con el resultado medido escrito
en el PR, no “funciona”.

⛔ **No entra**: burlar bloqueos de LinkedIn/Workday.

---

## Fase 5 · El motor de IA

**Entrega**

- `src/lib/ai/provider.ts` → interfaz `AiProvider { complete(prompt, schema): Promise<T> }`.
- `src/lib/ai/claude-agent.ts` → implementación con el Agent SDK: `maxTurns: 1`, **sin herramientas**
  (no queremos un agente que lea archivos: queremos texto adentro, JSON afuera), modelo por env.
- Tres operaciones, cada una con su prompt versionado en `src/lib/ai/prompts/`:
  1. `extractJobSpec(JobOffer) → JobSpec`
  2. `tailorResume(ResumeContent, JobSpec, SKILLS_MASTER) → TailoredResume`
  3. `draftEmail(template, JobSpec, TailoredResume) → ApplicationEmail`
- Validación **zod** de las tres salidas.
- ⛔ **`assertNoFabrication(original, tailored)`** — la guarda: empresas, fechas, títulos y skills del
  resultado tienen que ser subconjunto del original. Falla ⇒ un reintento con el error como feedback
  ⇒ si vuelve a fallar, se muestra la violación y **no se genera PDF**.
- `MockAiProvider` con respuestas fijas, para los tests y para desarrollar la UI sin gastar turnos.

**Cómo se verifica**: la guarda se prueba con **casos donde se sabe la respuesta** — un `tailored`
con una empresa inventada, otro con una fecha cambiada, otro con una skill fuera de la master, y un
caso **legítimo** que tiene que pasar. Un control que sólo prueba el camino feliz no controla nada.

---

## Fase 6 · Workbench de revisión

**Entrega**

- Vista partida: `changelog` a la izquierda con **aceptar / descartar / editar** por cambio;
  `<Resume>` renderizado en vivo a la derecha.
- `matchScore` y, sobre todo, **`gaps`**: los requisitos que no se cumplen, mostrados de frente —
  sirven para preparar la entrevista, y esconderlos sería el antipatrón del producto.
- Edición inline de cualquier campo antes de exportar.
- Estados: cargando (con el paso en curso), error de IA, violación de la guarda.

**Cómo se verifica**: e2e de Playwright con `MockAiProvider` que recorre pegar texto → analizar →
descartar un cambio → ver que el render de la derecha lo refleja.

---

## Fase 7 · PDF

**Entrega**

- `/preview/[id]` (sólo local, `noindex`) que renderiza el `tailored.json`.
- `POST /api/pdf` con Playwright: `document.fonts.ready` + `networkidle` antes de imprimir, A4,
  `printBackground: true`, timeout por env.
- Nombre `CV-<Nombre>-<Empresa>.pdf`, guardado en `.applications/<slug>/` y devuelto para descarga.
- Script `pnpm pdf:setup` → `playwright install chromium`, documentado en el README.

**Cómo se verifica**: el PDF generado se abre y se compara contra el `Cmd+P` manual de la misma
ruta — mismo contenido, mismo salto de página, fuentes correctas. Y un test que afirma que el PDF
pesa > 0 y tiene 1 página.

---

## Fase 8 · Correo y cierre de la postulación

**Entrega**

- Bloque de correo con **asunto** y **cuerpo** separados, cada uno con su botón de copiar.
- Generación de un `.eml` descargable (opcional, detrás de un botón secundario).
- `.applications/<slug>/` guarda `job.json`, `tailored.json`, `email.md`, `cv.pdf`, `meta.json`.
- Listado de postulaciones previas en `/apply` con su estado (`draft` / `sent`, marcado a mano).

**Cómo se verifica**: correr dos postulaciones distintas y comprobar que no se pisan y que el
historial las lista con su empresa y su fecha.

⛔ **No entra**: envío automático, seguimiento de respuestas, integración con el correo.

---

## Fase 9 · Tests y calidad

**Entrega**

- **Vitest**: guarda anti-invención, esquemas zod, extractor HTML→texto, slugs y nombres de archivo,
  render del template de correo.
- **Playwright e2e** con IA mockeada: el flujo completo de punta a punta, y la cara *nube* de `/apply`.
- CI de GitHub Actions: `check` + `build` + `test` (el e2e con el mock, sin red y sin Claude).
- Biome en verde.

**Cómo se verifica**: el CI pasa en un PR limpio. Y se corre al menos una vez **con la IA real** a
mano, con el resultado pegado en el PR.

---

## Fase 10 · Vitrina

**Entrega**

- README reescrito: qué es, el diagrama del flujo, por qué sólo local, cómo instalarlo, cómo
  cambiar el proveedor de IA, y **atribución al upstream**.
- GIF o capturas del flujo completo.
- Deploy en Vercel del CV público (sin las variables ⇒ workbench apagado).
- Entrada en la sección `projects` del propio CV, igual que hace el autor original con *Minimalist CV*.

---

## Lo que esto cuenta en una entrevista

No es “hice un CV con IA”. Los tres puntos que vale la pena poder defender:

1. **Un contrato de tipos acota a un modelo generativo.** La IA no escribe la vista: emite un
   `ResumeData` validado con zod y renderizado por los mismos componentes. Fidelidad por diseño.
2. **La guarda anti-invención es una verificación posterior, no un prompt.** Se prueba con casos
   donde se sabe la respuesta, incluyendo el caso legítimo que debe pasar.
3. **La restricción “sólo local” es estructural**: al usar el Agent SDK, el servidor de la nube
   simplemente no tiene con qué ejecutarlo. Una restricción que no depende de recordar un `if`.

---

## Riesgos conocidos

| Riesgo | Mitigación |
|---|---|
| Node 16 es el `node` por defecto de la máquina | `.nvmrc` + `mise.toml` + comprobación en el README. Next 16 pide ≥ 20. |
| Portales que bloquean el fetch (LinkedIn, Workday) | Se declara en la UI y se ofrecen imagen y texto. No se promete lo que no se puede. |
| El Agent SDK depende del binario `claude` | Es la decisión; el `AiProvider` deja la puerta abierta a otra implementación y el README lo explica. |
| Fuentes o avatar que no cargan al imprimir | Esperar `document.fonts.ready` y `networkidle` antes de `page.pdf()`. |
| Divergencia con el upstream | Cambios al template mínimos y aislados; remote `upstream` configurado desde el día uno. |
| Un CV adaptado que exagera | La guarda, el `changelog` revisable y los `gaps` visibles. El humano aprueba antes del PDF. |
