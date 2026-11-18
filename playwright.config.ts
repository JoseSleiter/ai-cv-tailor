import { defineConfig } from "@playwright/test";

const PORT = 3123;

/**
 * El e2e corre contra un build REAL, con el `MockAiProvider`.
 *
 * ⇒ Mockear la IA no es hacer trampa: lo que se verifica aca es el cableado
 * —ingesta, guarda, guardado, render, PDF—, y eso tiene que andar igual con
 * cualquier motor. Una suite que llamara al modelo seria lenta, cara y
 * distinta en cada corrida.
 *
 * ⚠ Y por eso mismo NO cubre lo unico que el mock no puede fingir: que un
 * modelo de verdad devuelva algo que cumpla el contrato. Eso se mide a mano.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: process.env.CI ? "list" : "line",
  use: { baseURL: `http://localhost:${PORT}` },
  webServer: {
    /** En CI el build ya corrio en su propio paso: no se compila dos veces. */
    command: process.env.CI ? "pnpm start" : "pnpm build && pnpm start",
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      PORT: String(PORT),
      CV_AI_ENABLED: "1",
      CV_AI_PROVIDER: "mock",
      CV_APPLICATIONS_DIR: ".applications-e2e",
    },
  },
});
