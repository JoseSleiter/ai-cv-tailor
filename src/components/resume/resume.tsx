import type React from "react";
import { Education } from "@/app/components/education";
import { Header } from "@/app/components/header";
import { Projects } from "@/app/components/projects";
import { Skills } from "@/app/components/skills";
import { Summary } from "@/app/components/summary";
import { WorkExperience } from "@/app/components/work-experience";
import { CommandMenu } from "@/components/command-menu";
import { LocaleSwitch } from "@/components/controls/locale-switch";
import { TailorLink } from "@/components/controls/tailor-link";
import { ThemeToggle } from "@/components/controls/theme-toggle";
import { getContactLinks, getSections, type SectionKey } from "@/lib/resume";
import type { Locale, LocaleLabels, ResumeData } from "@/lib/types";

interface ResumeProps {
  locale: Locale;
  data: ResumeData;
  labels: LocaleLabels;
  /**
   * Competencias a resaltar. Solo las pone el CV ADAPTADO: el publico no
   * resalta nada porque no sabe para quien se escribe.
   */
  highlighted?: readonly string[];
}

/**
 * El CV entero, renderizado a partir de un `ResumeData` que llega por PARAMETRO.
 *
 * ⭐ Es la pieza que hace posible el resto del proyecto: la misma vista sirve al CV publico
 * y al CV adaptado a una vacante, asi que el PDF adaptado sale con el mismo CSS y no hay
 * dos disenos que mantener.
 */
export function Resume({ locale, data, labels, highlighted }: ResumeProps) {
  const content: Record<SectionKey, React.ReactNode> = {
    summary: <Summary summary={data.summary} title={labels.sections.summary} />,
    work: (
      <WorkExperience
        work={data.work}
        title={labels.sections.work}
        presentLabel={labels.present}
      />
    ),
    education: (
      <Education
        education={data.education}
        title={labels.sections.education}
        presentLabel={labels.present}
      />
    ),
    skills: (
      <Skills
        skills={data.skills}
        title={labels.sections.skills}
        highlighted={highlighted}
      />
    ),
    projects: (
      <Projects projects={data.projects} title={labels.sections.projects} />
    ),
  };

  const commandMenuLinks = getContactLinks(data).filter(
    ({ icon }) => icon !== "mail" && icon !== "phone"
  );

  return (
    <main
      lang={locale}
      className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-0 md:p-16"
      id="main-content"
    >
      <section
        className="mx-auto w-full max-w-2xl space-y-8 print:max-w-none print:space-y-3"
        aria-label="Resume Content"
      >
        <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
          <Header
            data={data}
            controls={
              <div className="flex items-center gap-x-1 print:hidden">
                <TailorLink label={labels.ui.tailor} />
                <LocaleSwitch current={locale} label={labels.ui.language} />
                <ThemeToggle labels={labels.ui.theme} />
              </div>
            }
          />
        </div>

        {getSections(data).map((key, index) => (
          <div
            key={key}
            className="animate-fade-in"
            style={{ animationDelay: `${(index + 1) * 75}ms` }}
          >
            {content[key]}
          </div>
        ))}
      </section>

      <CommandMenu links={commandMenuLinks} />
    </main>
  );
}
