import "server-only";
import { type ZodType, z } from "zod";
import {
  AiError,
  type AiProvider,
  type AiRequest,
  parseJsonPayload,
} from "./provider";

/**
 * El SEGUNDO motor. Existe para probar que `AiProvider` no era decoracion: la
 * guarda, el contrato zod, los tres prompts y el PDF son los mismos con Claude
 * o con Gemini. Lo unico que cambia es este archivo.
 *
 * ⛔⛔ Y CAMBIA UNA GARANTIA DEL DISENO, asi que hay que decirlo fuerte: con el
 * Agent SDK el "solo local" era ESTRUCTURAL —en la nube no existe el binario
 * `claude`, no hay con que ejecutarlo—. Una API key viaja a cualquier lado,
 * Vercel incluido. Con Gemini, `isLocalMode()` vuelve a ser un `if` que hay que
 * acordarse de respetar.
 * ⇒ La key NO se configura en el despliegue. Nunca.
 *
 * ⚠ Y la otra mitad: el CV lleva correo y telefono, y la oferta puede llevar
 * datos de la empresa. En el plan gratuito de Google AI Studio eso puede usarse
 * para entrenar modelos. Es una decision del usuario, pero se toma sabiendolo.
 *
 * ⇒ Sin SDK a proposito: `@google/genai` arrastra protobufjs y google-auth, y
 * rompe el `pnpm install` del build por un script de instalacion ignorado. Lo
 * que se necesita es UN POST.
 */
const ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";

export class GeminiProvider implements AiProvider {
  readonly name = "gemini";
  private readonly apiKey: string;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AiError(
        "Falta GEMINI_API_KEY. Se saca en https://aistudio.google.com/apikey y va en .env.local, que esta en .gitignore."
      );
    }
    this.apiKey = apiKey;
    this.model = process.env.CV_GEMINI_MODEL ?? "gemini-3.6-flash";
  }

  async complete<T>(request: AiRequest<T>): Promise<T> {
    const prompt = request.feedback
      ? `${request.prompt}\n\n## Tu intento anterior fue rechazado\n\n${request.feedback}\n\nCorregilo y devolve el JSON completo otra vez.`
      : request.prompt;

    const response = await fetch(`${ENDPOINT}/${this.model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ⛔ La key va en un HEADER, nunca en el query string: una URL queda
        // escrita en logs, en proxies y en el historial.
        "x-goog-api-key": this.apiKey,
      },
      signal: AbortSignal.timeout(180_000),
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: request.system }] },
        contents: [
          {
            role: "user",
            parts: [
              ...(request.images ?? []).map((image) => ({
                inline_data: { mime_type: image.mediaType, data: image.data },
              })),
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseJsonSchema: jsonSchemaFor(request.schema),
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new AiError(
        `Gemini respondio ${response.status}.`,
        detail.slice(0, 500)
      );
    }

    const payload = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const raw = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("");
    if (!raw) throw new AiError("Gemini no devolvio texto.");

    const result = request.schema.safeParse(parseJsonPayload(raw));
    if (result.success) return result.data;
    throw new AiError(
      `La salida no cumple el contrato: ${z.prettifyError(result.error)}`,
      raw
    );
  }
}

/**
 * ⚠ El mismo recorte que en el proveedor de Claude, por un motivo distinto: la
 * API de Gemini rechaza las palabras clave que no reconoce, y `$schema` es una.
 */
function jsonSchemaFor(schema: ZodType): Record<string, unknown> {
  const { $schema: _draft, ...rest } = z.toJSONSchema(schema, {
    io: "output",
  }) as Record<string, unknown>;
  return rest;
}
