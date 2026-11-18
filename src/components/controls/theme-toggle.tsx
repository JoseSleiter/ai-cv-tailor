"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type ThemeChoice } from "@/lib/theme";

const ORDER: ThemeChoice[] = ["system", "light", "dark"];

const ICONS = {
  system: MonitorIcon,
  light: SunIcon,
  dark: MoonIcon,
} as const;

interface ThemeToggleProps {
  labels: Record<ThemeChoice, string>;
}

export function ThemeToggle({ labels }: ThemeToggleProps) {
  const [choice, setChoice] = useState<ThemeChoice>("system");

  // El script del layout ya pintó el tema antes del primer paint. Acá sólo se
  // SINCRONIZA el estado de React con lo que ese script decidió.
  useEffect(() => {
    setChoice(readStoredChoice());
  }, []);

  const next = () => {
    const value = ORDER[(ORDER.indexOf(choice) + 1) % ORDER.length];
    setChoice(value);
    applyTheme(value);
    try {
      if (value === "system") {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, value);
      }
    } catch {
      // Modo incógnito o almacenamiento bloqueado: el tema igual se aplicó.
    }
  };

  const Icon = ICONS[choice];

  return (
    <button
      type="button"
      onClick={next}
      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
      aria-label={labels[choice]}
      title={labels[choice]}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}

function readStoredChoice(): ThemeChoice {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function applyTheme(value: ThemeChoice) {
  const root = document.documentElement;
  if (value === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", value);
  }
}
