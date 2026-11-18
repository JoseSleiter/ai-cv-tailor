import { z } from "zod";

export const jobImageSchema = z.object({
  mediaType: z.enum(["image/png", "image/jpeg", "image/webp", "image/gif"]),
  /** base64 SIN el prefijo `data:`. */
  data: z.string().min(1),
});

/**
 * La oferta como entra, antes de que la IA la toque: texto pegado, una pagina
 * bajada, o capturas de pantalla.
 *
 * ⇒ Las tres vias conviven porque la mas comoda es la que mas falla: LinkedIn y
 * Workday sirven un cascaron detras de un login. Prometer "pegame el link" y
 * fallar es peor que ofrecer tres caminos.
 */
export const jobOfferSchema = z.object({
  source: z.enum(["text", "link", "image"]),
  sourceUrl: z.string().url().optional(),
  text: z.string().default(""),
  images: z.array(jobImageSchema).max(6).default([]),
});

export type JobOffer = z.infer<typeof jobOfferSchema>;

/** Sin texto util y sin imagenes no hay nada que leer: se dice y no se llama al modelo. */
export const hasReadableContent = (offer: JobOffer): boolean =>
  offer.text.trim().length >= 40 || offer.images.length > 0;
