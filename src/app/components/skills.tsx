import { Section } from "@/components/ui/section";
import { TagList } from "@/components/ui/tag-list";

interface SkillsProps {
  skills: readonly string[];
  title: string;
}

export function Skills({ skills, title }: SkillsProps) {
  return (
    <Section title={title} titleId="skills-section">
      <TagList tags={skills} label="List of skills" variant="skills" />
    </Section>
  );
}
