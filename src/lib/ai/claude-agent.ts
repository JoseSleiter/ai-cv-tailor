import "server-only";
import { query, type SDKUserMessage } from "@anthropic-ai/claude-agent-sdk";
import { type ZodType, z } from "zod";
import { aiModel } from "@/lib/environment";
import {
  AiError,
  type AiProvider,
  type AiRequest,
  parseJsonPayload,
} from "./provider";

/**
 * El motor: el Claude Agent SDK, que habla con el binario `claude` que ya tiene
 * la sesion del equipo.
 *
 * ⭐ Dos decisiones que no son de comodidad:
 *   · `tools: []` y `maxTurns: 1` — NO queremos un agente. Queremos texto
 *     adentro y JSON afuera. Un agente con herramientas podria leer archivos del
 *     repo y "mejorar" el CV con algo que nadie escribio.
 *   · `settingSources: []` — no carga el CLAUDE.md ni las skills del usuario.
 *     Lo que el modelo ve es lo que este archivo le manda, y nada mas.
 */
export class ClaudeAgentProvider implements AiProvider {
  readonly name = "claude-agent-sdk";

  async complete<T>(request: AiRequest<T>): Promise<T> {
    const raw = await this.ask(request);
    const parsed = parseJsonPayload(raw);
    const result = request.schema.safeParse(parsed);
    if (result.success) return result.data;
    throw new AiError(
      `La salida no cumple el contrato: ${z.prettifyError(result.error)}`,
      raw
    );
  }

  private async ask<T>(request: AiRequest<T>): Promise<string> {
    const prompt = request.feedback
      ? `${request.prompt}\n\n## Tu intento anterior fue rechazado\n\n${request.feedback}\n\nCorregilo y devolve el JSON completo otra vez.`
      : request.prompt;

    const response = query({
      prompt: request.images?.length
        ? userMessageWithImages(prompt, request.images)
        : prompt,
      options: {
        model: aiModel(),
        maxTurns: 1,
        tools: [],
        settingSources: [],
        permissionMode: "default",
        systemPrompt: { type: "custom", prompt: request.system },
        outputFormat: {
          type: "json_schema",
          schema: jsonSchemaFor(request.schema),
        },
      },
    });

    for await (const message of response) {
      if (message.type !== "result") continue;
      if (message.subtype !== "success" || message.is_error) {
        throw new AiError(
          `El Agent SDK devolvio un error (${message.subtype}).`
        );
      }
      return message.result;
    }
    throw new AiError("El Agent SDK termino sin devolver un resultado.");
  }
}

/**
 * ⛔ Le saca el `$schema` al esquema que genera zod.
 *
 * Medido el 18-11-2026: el CLI valida el `--json-schema` que recibe y muere con
 * `no schema with key or ref "https://json-schema.org/draft/2020-12/schema"` —
 * no resuelve el meta-esquema. zod 4 lo pone siempre, asi que sin esta linea
 * NINGUNA llamada real funciona, aunque el mock pase.
 */
function jsonSchemaFor(schema: ZodType): Record<string, unknown> {
  const { $schema: _draft, ...rest } = z.toJSONSchema(schema, {
    io: "output",
  }) as Record<string, unknown>;
  return rest;
}

async function* userMessageWithImages(
  prompt: string,
  images: NonNullable<AiRequest<unknown>["images"]>
): AsyncIterable<SDKUserMessage> {
  yield {
    type: "user",
    parent_tool_use_id: null,
    message: {
      role: "user",
      content: [
        ...images.map((image) => ({
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: image.mediaType,
            data: image.data,
          },
        })),
        { type: "text" as const, text: prompt },
      ],
    },
  };
}
