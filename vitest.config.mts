import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
      /**
       * ⚠ `server-only` existe para EXPLOTAR si lo importa un bundle de
       * cliente, y en Node explota igual. Sin este alias, todo modulo que lo
       * declare —que son justo los que mas hay que probar— no se puede ni
       * importar en un test.
       */
      "server-only": resolve(import.meta.dirname, "tests/stubs/server-only.ts"),
    },
  },
});
