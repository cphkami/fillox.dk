import { cn } from "@/lib/cn";

/**
 * Opening hours as one line joined by "·", e.g. ["Man–tir 8–20", "Ons–fre 8–16", "Lør 9–17"]
 * (Clinic.hours formatted) or ["Hverdage 10–19", "Weekend 10–17"] (Clinic.hoursSummary split
 * on " · "). A part never breaks inside, so a narrow column only wraps between parts; and when
 * a part wraps, its "·" (drawn in the column gap) falls outside the box and is clipped, so no
 * line starts or ends with a dangling separator. `lg:flex-col` in className stacks the parts
 * one per line from lg (the separators are clipped the same way).
 */
export function HoursSummary({
  parts,
  as: Tag = "p",
  className,
}: {
  parts: string[];
  /** "span" inside phrasing content (e.g. a link's spans); it still lays out as a block. */
  as?: "p" | "span";
  className?: string;
}) {
  if (parts.length < 2) return <Tag className={className}>{parts[0]}</Tag>;
  return (
    <Tag className={cn("flex flex-wrap gap-x-[.75em] overflow-hidden", className)}>
      {parts.map((part, i) => (
        <span key={i} className="whitespace-nowrap">
          {i > 0 ? <span className="-ml-[.75em] inline-block w-[.75em] text-center">·</span> : null}
          {part}
        </span>
      ))}
    </Tag>
  );
}

/** "Hverdage 10–19 · Weekend 10–17" → ["Hverdage 10–19", "Weekend 10–17"]. */
export const splitHours = (text: string) => text.split(/\s+·\s+/);
