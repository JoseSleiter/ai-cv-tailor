import { Resume } from "@/components/resume/resume";
import { LABELS, resumeFor } from "@/data/resume-data";
import { generateResumeStructuredData } from "@/lib/structured-data";

export default function ResumePage() {
  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(generateResumeStructuredData())}
      </script>
      <Resume locale="en" data={resumeFor("en")} labels={LABELS.en} />
    </>
  );
}
