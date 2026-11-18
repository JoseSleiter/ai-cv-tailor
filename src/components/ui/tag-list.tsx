import { cn } from "@/lib/utils";

const variants = {
  tags: "text-xs leading-relaxed text-muted-foreground print:text-[9px] print:leading-snug",
  skills:
    "text-sm leading-relaxed text-body print:text-[10px] print:leading-snug",
};

interface TagListProps {
  tags: readonly string[];
  label: string;
  variant?: keyof typeof variants;
  className?: string;
  /**
   * Las que la vacante pide y el CV ya tenia: se imprimen en negrita.
   *
   * ⇒ Es el unico resalte del documento, y por eso funciona. Resaltar diez
   * cosas es no resaltar ninguna, asi que la lista la acota el contrato de la
   * IA (`highlighted`, maximo 20) y no el gusto del que renderiza.
   */
  emphasis?: readonly string[];
}

const normalize = (tag: string) => tag.toLowerCase().replace(/[\s._/-]/g, "");

export function TagList({
  tags,
  label,
  variant = "tags",
  className,
  emphasis,
}: TagListProps) {
  if (tags.length === 0) return null;

  const strong = new Set((emphasis ?? []).map(normalize));

  return (
    <ul className={cn(variants[variant], className)} aria-label={label}>
      {tags.map((tag, index) => (
        <li key={tag} className="inline whitespace-nowrap">
          {strong.has(normalize(tag)) ? (
            <strong className="font-semibold text-foreground">{tag}</strong>
          ) : (
            tag
          )}
          {index < tags.length - 1 && (
            <span
              className="whitespace-normal text-muted-foreground"
              aria-hidden="true"
            >
              {"\u00a0· "}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
