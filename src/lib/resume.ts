import "server-only";
import { domainToUnicode } from "node:url";
import { SECTION_TITLES } from "@/data/resume-data";
import type { ResumeContent, SocialIcon, WorkEntry } from "@/lib/types";

export type ContactIcon = SocialIcon | "globe" | "mail" | "phone";

export type SectionKey = keyof typeof SECTION_TITLES;

export function getSections(data: ResumeContent): SectionKey[] {
  const keys = Object.keys(SECTION_TITLES) as SectionKey[];
  return keys.filter((key) => data[key].length > 0);
}

export interface ContactLink {
  label: string;
  href: string;
  text: string;
  icon: ContactIcon;
}

export function getCurrentRole(work: WorkEntry[]): WorkEntry | undefined {
  return work.find((job) => job.end === null);
}

/**
 * El puesto que define el titulo de la pagina y el JSON-LD.
 *
 * ⚠ Cae al mas RECIENTE cuando no hay ninguno en curso. Sin esto, el dia que el ultimo
 * trabajo deja de ser `end: null` el titulo pasa a "<nombre> - Resume" y el JSON-LD se
 * queda sin `jobTitle` ni `worksFor`, en silencio y justo cuando mas se busca trabajo.
 */
export function getHeadlineRole(work: WorkEntry[]): WorkEntry | undefined {
  return getCurrentRole(work) ?? work[0];
}

export function getPageTitle({ name, work }: ResumeContent): string {
  return `${name} - ${getHeadlineRole(work)?.title ?? "Resume"}`;
}

const decodeNonAsciiEscapes = (text: string) =>
  text.replace(/(?:%[89A-F][0-9A-F])+/g, (escapes) => {
    try {
      return decodeURIComponent(escapes);
    } catch {
      return escapes;
    }
  });

export function displayUrl(url: string): string {
  const { hostname, port, pathname, search, hash } = new URL(url);
  const host = domainToUnicode(hostname).replace(/^www\./, "");
  const rest = `${pathname.replace(/\/$/, "")}${search}${hash}`;
  return `${host}${port ? `:${port}` : ""}${decodeNonAsciiEscapes(rest)}`;
}

export function getContactLinks({
  personalWebsiteUrl,
  contact,
}: ResumeContent): ContactLink[] {
  const links: ContactLink[] = [];
  if (personalWebsiteUrl) {
    links.push({
      label: "Personal Website",
      href: personalWebsiteUrl,
      text: displayUrl(personalWebsiteUrl),
      icon: "globe",
    });
  }
  if (contact.email) {
    links.push({
      label: "Email",
      href: `mailto:${contact.email}`,
      text: contact.email,
      icon: "mail",
    });
  }
  if (contact.tel) {
    links.push({
      label: "Phone",
      href: `tel:${contact.tel}`,
      text: contact.tel,
      icon: "phone",
    });
  }
  for (const social of contact.social) {
    links.push({
      label: social.name,
      href: social.url,
      text: displayUrl(social.url),
      icon: social.icon,
    });
  }
  return links;
}
