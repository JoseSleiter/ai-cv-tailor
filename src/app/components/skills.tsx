import { Section } from "@/components/ui/section";
import { TagList } from "@/components/ui/tag-list";

interface SkillsProps {
  skills: readonly string[];
  title: string;
  /** Lo que la vacante pide y el CV ya tenia. Vacio en el CV publico. */
  highlighted?: readonly string[];
}

export function Skills({ skills, title, highlighted }: SkillsProps) {
  return (
    <Section title={title} titleId="skills-section">
      <TagList
        tags={skills}
        label="List of skills"
        variant="skills"
        emphasis={highlighted}
      />
    </Section>
  );
}
