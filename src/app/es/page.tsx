import type { Metadata } from "next";
import { Resume } from "@/components/resume/resume";
import { LABELS, resumeFor } from "@/data/resume-data";
import { getPageTitle } from "@/lib/resume";

const RESUME_ES_DATA = resumeFor("es");

export const metadata: Metadata = {
  title: getPageTitle(RESUME_ES_DATA),
  description: RESUME_ES_DATA.about,
  alternates: { canonical: "/es" },
  openGraph: { locale: "es_ES", url: "/es" },
};

export default function ResumePageEs() {
  return <Resume locale="es" data={RESUME_ES_DATA} labels={LABELS.es} />;
}
