import type { MetadataRoute } from "next";
import { RESUME_DATA } from "@/data/resume-data";

export default function robots(): MetadataRoute.Robots {
  return {
    /**
     * ⛔ `/apply` y `/preview` no se indexan: el primero es una herramienta y el
     * segundo es un CV escrito para UNA empresa. Que Google sirva la version
     * adaptada a otra vacante es exactamente lo que no queremos.
     */
    rules: { userAgent: "*", allow: "/", disallow: ["/apply", "/preview/"] },
    sitemap: new URL("/sitemap.xml", RESUME_DATA.siteUrl).href,
  };
}
