import { z } from "zod";
import { AiError, type AiProvider, type AiRequest } from "./provider";

/**
 * Para los tests y para desarrollar la UI sin gastar turnos de modelo.
 *
 * ⚠ No devuelve una fixture propia: devuelve lo que el llamador declaro en
 * `mock`, y lo VALIDA contra el mismo esquema. Un mock que no pasa por el
 * contrato prueba la UI contra datos que la produccion nunca produciria.
 */
export class MockAiProvider implements AiProvider {
  readonly name = "mock";

  async complete<T>(request: AiRequest<T>): Promise<T> {
    if (!request.mock) {
      throw new AiError(
        `El MockAiProvider no tiene respuesta para la operacion "${request.operation}".`
      );
    }
    const result = request.schema.safeParse(request.mock());
    if (!result.success) {
      throw new AiError(
        `La respuesta simulada no cumple el contrato: ${z.prettifyError(result.error)}`
      );
    }
    return result.data;
  }
}
