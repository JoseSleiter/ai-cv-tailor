# ai-cv-tailor

CV online minimalista y print-friendly **+ una herramienta local** que adapta ese CV a una vacante
concreta y prepara el correo de postulación.

Pegás una oferta de trabajo —**link, imagen o texto**— y, usando Claude Code como motor de IA,
obtenés:

1. una versión del CV **adaptada a esa vacante**, con el mismo diseño exacto,
2. el **PDF** ya generado y nombrado (`CV-<Nombre>-<Empresa>.pdf`),
3. el **correo** listo para copiar, pegar y enviar a mano con ese PDF adjunto.

El envío es **siempre manual**. La herramienta prepara el material; no manda nada a tu nombre.

---

## Por qué sólo funciona en local

El motor es el **[Claude Agent SDK](https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk)**,
que habla con el binario `claude` ya autenticado en tu máquina. No hay API key, no hay costo por
postulación y no hay secreto que filtrar en un repo público.

La consecuencia es deliberada: **el servidor de la nube no tiene con qué ejecutarlo**. La
restricción no es un `if` que alguien pueda saltarse, es estructural. Desplegado, este repo muestra
el CV público y, en `/apply`, las instrucciones para correr el workbench en tu propia máquina.

## La idea

Todo el CV es un objeto tipado (`ResumeData`) que los componentes renderizan. **La IA nunca escribe
HTML ni CSS**: su única salida es otro `ResumeData`, validado con zod y comparado contra el original
por una guarda que rechaza empresas, fechas, títulos o skills inventados.

## Estado

🚧 En construcción. El plan por fases está en [`docs/plan-de-trabajo.md`](docs/plan-de-trabajo.md)
y el contexto técnico en [`docs/resumen-tecnico.md`](docs/resumen-tecnico.md).

## Desarrollo

Requiere **Node ≥ 20** (el repo fija 22 vía `.nvmrc` / `mise.toml`) y `pnpm`.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Créditos

El template del CV es un fork de **[BartoszJarocki/cv](https://github.com/BartoszJarocki/cv)**
(MIT) — un trabajo excelente, y la base sobre la que está construido todo lo visual de este repo.
Lo que agrega este proyecto es el workbench de postulación asistido por IA.

Licencia MIT, conservada del original.
