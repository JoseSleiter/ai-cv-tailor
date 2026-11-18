interface DateRangeProps {
  start: string;
  end: string | null;
  label: string;
  /** Como se dice "en curso" en el idioma de este CV. */
  presentLabel?: string;
}

export function DateRange({
  start,
  end,
  label,
  presentLabel = "Present",
}: DateRangeProps) {
  return (
    <div
      className="shrink-0 text-[13px] tabular-nums text-muted-foreground print:leading-none"
      title={`${label}: ${start} to ${end ?? presentLabel}`}
    >
      {start} - {end ?? presentLabel}
    </div>
  );
}
