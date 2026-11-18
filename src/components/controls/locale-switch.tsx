import Link from "next/link";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const PATHS: Record<Locale, string> = { en: "/", es: "/es" };
const SHORT: Record<Locale, string> = { en: "EN", es: "ES" };

interface LocaleSwitchProps {
  current: Locale;
  label: string;
}

/**
 * Enlaces, no estado de cliente: cada idioma es una ruta estática propia. Así el CV en
 * español se indexa, se comparte por URL y se imprime sin depender de JavaScript.
 */
export function LocaleSwitch({ current, label }: LocaleSwitchProps) {
  return (
    <nav aria-label={label} className="flex items-center gap-x-0.5 text-xs">
      {(Object.keys(PATHS) as Locale[]).map((locale) => (
        <Link
          key={locale}
          href={PATHS[locale]}
          hrefLang={locale}
          aria-current={locale === current ? "page" : undefined}
          className={cn(
            "rounded-md px-1.5 py-1 no-underline transition-colors",
            locale === current
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {SHORT[locale]}
        </Link>
      ))}
    </nav>
  );
}
