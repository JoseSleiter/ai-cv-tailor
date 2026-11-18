import { DateRange } from "@/components/ui/date-range";
import { Section } from "@/components/ui/section";
import type { EducationEntry } from "@/lib/types";

interface EducationItemProps {
  education: EducationEntry;
  presentLabel: string;
}

function EducationItem({ education, presentLabel }: EducationItemProps) {
  const { school, start, end, degree } = education;

  return (
    <>
      <div className="flex items-baseline justify-between gap-x-2">
        <h3 className="text-sm font-medium leading-snug print:leading-none">
          {school}
        </h3>
        {start && (
          <DateRange
            start={start}
            end={end ?? null}
            label="Period"
            presentLabel={presentLabel}
          />
        )}
      </div>
      <div className="mt-1.5 text-sm text-body print:mt-1 print:text-[12px] print:leading-tight">
        {degree}
      </div>
    </>
  );
}

interface EducationListProps {
  education: readonly EducationEntry[];
  title: string;
  presentLabel: string;
}

export function Education({
  education,
  title,
  presentLabel,
}: EducationListProps) {
  return (
    <Section title={title} titleId="education-section">
      <div className="space-y-4 print:space-y-1">
        {education.map((item) => (
          <article key={item.school} className="print:break-inside-avoid">
            <EducationItem education={item} presentLabel={presentLabel} />
          </article>
        ))}
      </div>
    </Section>
  );
}
