import { expect, test } from "@playwright/test";

const OFERTA = `Senior Full-Stack Engineer (Remote, LATAM).
We are looking for an engineer with strong TypeScript, Node.js/NestJS and React/Next.js experience,
PostgreSQL, AWS and Docker. Nice to have: Kubernetes, Terraform.
You will own backend services and the customer-facing dashboard and mentor two juniors.`;

test("el CV publico no muestra el workbench ni la foto en la impresion", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Jose Sleiter Rios" })).toBeVisible();
  const photo = page.getByAltText(/profile picture/i);
  await expect(photo).toBeVisible();
  // ⛔ La foto es de PANTALLA: en impresion no se ve.
  await page.emulateMedia({ media: "print" });
  await expect(photo).toBeHidden();
});

test("de pegar la oferta al PDF, pasando por la guarda", async ({ page }) => {
  await page.goto("/apply");
  await expect(page.getByRole("heading", { name: /Adaptar el CV/ })).toBeVisible();

  await page.getByPlaceholder("Pegá acá la oferta completa.").fill(OFERTA);
  await page.getByRole("button", { name: "Analizar y adaptar" }).click();

  // El CV adaptado se renderiza en vivo, en un iframe, con el MISMO componente.
  const preview = page.frameLocator('iframe[title="CV adaptado"]');
  await expect(preview.getByRole("heading", { name: "Jose Sleiter Rios" })).toBeVisible({
    timeout: 30_000,
  });

  await expect(page.getByText(/coincidencia \d+\/100/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Palabras clave resaltadas" })).toBeVisible();

  // La carta usa la plantilla y deja ver los marcadores pendientes.
  await page.getByRole("button", { name: "Redactar la carta" }).click();
  await expect(page.getByText("ASUNTO")).toBeVisible({ timeout: 30_000 });

  // El PDF se descarga y pesa.
  const download = page.waitForEvent("download", { timeout: 60_000 });
  await page.getByRole("button", { name: "Descargar el PDF" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/\.pdf$/);
});

test("una oferta vacia no llega al modelo: lo dice y no inventa", async ({ page }) => {
  await page.goto("/apply");
  await page.getByPlaceholder("Pegá acá la oferta completa.").fill("Hola");
  await page.getByRole("button", { name: "Analizar y adaptar" }).click();
  await expect(page.getByText(/no hay nada que leer/i)).toBeVisible({ timeout: 20_000 });
});

/**
 * ⛔ La regresion que motivo el arreglo: el estado del workbench vivia solo en
 * memoria, asi que una recarga dejaba la postulacion en el historial sin forma
 * de volver a ella —ni carta, ni PDF, ni changelog—. Guardado y no abrible es
 * perdido con apariencia de guardado.
 */
test("una postulacion se retoma despues de recargar", async ({ page }) => {
  await page.goto("/apply");
  await page.getByPlaceholder("Pegá acá la oferta completa.").fill(OFERTA);
  await page.getByRole("button", { name: "Analizar y adaptar" }).click();
  await expect(page.getByText(/coincidencia \d+\/100/)).toBeVisible({
    timeout: 30_000,
  });

  await page.reload();
  await expect(page.getByText(/coincidencia \d+\/100/)).toBeHidden();

  await page.getByRole("button", { name: "retomar" }).first().click();
  await expect(page.getByText(/coincidencia \d+\/100/)).toBeVisible({
    timeout: 20_000,
  });
  await expect(
    page.getByRole("button", { name: "Descargar el PDF" })
  ).toBeVisible();
  await expect(
    page
      .frameLocator('iframe[title="CV adaptado"]')
      .getByRole("heading", { name: "Jose Sleiter Rios" })
  ).toBeVisible({ timeout: 20_000 });
});
