import type { MetadataRoute } from "next";
import { RESUME_DATA } from "@/data/resume-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = RESUME_DATA.siteUrl.replace(/\/$/, "");
  const lastModified = new Date();
  const languages = { en: base, es: `${base}/es` };

  return [
    {
      url: base,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: languages.es,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: { languages },
    },
  ];
}
