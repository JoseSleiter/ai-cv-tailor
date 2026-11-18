import type { ZodType } from "zod";

/** Una imagen de la oferta (una captura de pantalla), en base64. */
export interface JobImage {
  mediaType: "image/png" | "image/jpeg" | "image/webp" | "image/gif";
  data: string;
}

export type AiOperation = "jobSpec" | "tailor" | "email";

export interface AiRequest<T> {
  operation: AiOperation;
  /** El contrato de salida. Lo que no valide, no sale de aca. */
  schema: ZodType<T>;
  system: string;
  prompt: string;
  images?: JobImage[];
  /** Para el reintento: que estuvo mal la vez anterior. */
  feedback?: string;
  /**
   * Lo que devuelve el `MockAiProvider`, calculado por QUIEN HACE EL PEDIDO.
   *
   * ⇒ Vive aca y no en el mock a proposito: el que llama tiene el CV original y
   * la oferta, asi que puede dar una respuesta coherente sin inventar fixtures
   * que se desincronicen del dato real. El mock igual la valida contra el mismo
   * `schema`, asi que una respuesta falsa mal formada falla como una verdadera.
   */
  mock?: () => T;
}

/**
 * ⇒ La interfaz existe para que el Agent SDK no sea una decision irreversible.
 * Quien forkee el repo y prefiera la API con una key implementa esto y nada mas
 * cambia.
 */
export interface AiProvider {
  readonly name: string;
  complete<T>(request: AiRequest<T>): Promise<T>;
}

export class AiError extends Error {
  readonly raw?: string;
  constructor(message: string, raw?: string) {
    super(message);
    this.name = "AiError";
    this.raw = raw;
  }
}

/**
 * El modelo a veces envuelve el JSON en una cerca de markdown o lo acompana de
 * una linea de cortesia. Esto NO es tolerancia a la basura: es tolerancia a lo
 * unico que se observo, y cualquier otra cosa sigue fallando con el crudo a la
 * vista.
 */
export function parseJsonPayload(raw: string): unknown {
  const text = raw.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = (fenced?.[1] ?? text).trim();
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.search(/[[{]/);
    const end = Math.max(
      candidate.lastIndexOf("}"),
      candidate.lastIndexOf("]")
    );
    if (start >= 0 && end > start) {
      return JSON.parse(candidate.slice(start, end + 1));
    }
    throw new AiError("La IA no devolvio JSON.", raw);
  }
}
