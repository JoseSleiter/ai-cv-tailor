const STEPS = [
  "git clone https://github.com/JoseSleiter/ai-cv-tailor.git",
  "cd ai-cv-tailor && pnpm install",
  "cp .env.example .env.local",
  "pnpm pdf:setup && CV_AI_ENABLED=1 pnpm dev",
];

/**
 * La cara de la NUBE. No hay workbench desplegado y no es una limitación
 * pendiente: es el diseño.
 */
export function LocalOnlyNotice() {
  return (
    <main className="container mx-auto max-w-2xl space-y-6 p-4 py-16 md:p-16">
      <header className="space-y-2">
        <h1 className="font-pixel text-[28px] leading-none sm:text-[32px]">
          Adaptar el CV a una vacante
        </h1>
        <p className="text-pretty text-sm text-body">
          Esta página es la puerta de una herramienta que corre{" "}
          <strong>solo en local</strong>: lee una oferta —texto, enlace o
          captura—, adapta este mismo CV a lo que esa vacante pide, imprime el
          PDF y redacta la carta de presentación para enviarla a mano.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="font-semibold text-sm">Por qué no corre acá</h2>
        <p className="text-pretty text-sm text-body">
          El motor es el Claude Agent SDK, que habla con el{" "}
          <code className="text-xs">claude</code> instalado en la máquina. Este
          despliegue no tiene ese binario, así que la restricción no depende de
          acordarse de apagar nada: no hay con qué ejecutarla. El CV que estás
          leyendo es estático.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-sm">Cómo levantarla</h2>
        <ol className="space-y-1 text-sm text-body">
          {STEPS.map((step) => (
            <li key={step}>
              <code className="text-xs">{step}</code>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-sm">Lo que hace y lo que no</h2>
        <ul className="space-y-1 text-pretty text-sm text-body">
          <li>
            La IA no escribe el CV: devuelve los mismos datos, elegidos y
            ordenados, y los renderizan los mismos componentes de esta página.
          </li>
          <li>
            Una guarda posterior compara el resultado con el CV original y
            rechaza cualquier empresa, fecha, cargo o tecnología que no esté.
          </li>
          <li>
            Los requisitos que el CV <em>no</em> cumple se muestran de frente:
            sirven para preparar la entrevista.
          </li>
          <li>El correo no se envía solo. Nunca.</li>
        </ul>
      </section>

      <a className="inline-block text-sm underline" href="/">
        ← Volver al CV
      </a>
    </main>
  );
}
