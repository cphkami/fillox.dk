import type { MenPage } from "@/content/pages/men";
import { cn } from "@/lib/cn";
import type { MenPriceRow } from "./menView";

/**
 * "Laserpakker for mænd" folded out under the treatment list (content/prices.ts → "laser-maend"):
 * a native <details> on the list's hairlines, so the eight packages do not outweigh the other
 * three treatments, and work without JavaScript. Closed: the title, "8 pakker · fra 1.000 kr"
 * and a 44px "+" circle (as the FAQ). Open: the intro and the rows (16px label, semibold price,
 * as PriceSection), cheapest first.
 *
 * `indent` lines the text up with the treatment names above it (the number column + gap).
 */
export function MenPrices({
  copy,
  rows,
  indent,
}: {
  copy: MenPage["treatments"]["laserPackages"];
  rows: MenPriceRow[];
  indent: string;
}) {
  const cheapest = rows[0]?.price;
  return (
    <details id={copy.id} className="group border-b border-line">
      <summary
        className={cn(
          "flex min-h-11 cursor-pointer list-none items-center gap-3 py-5 md:gap-6 md:py-6 xl:py-fluid-24 [&::-webkit-details-marker]:hidden",
          indent,
        )}
      >
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-[18px] leading-[1.25] tracking-display text-heading md:text-h4">
            {copy.title}
          </span>
          {cheapest ? (
            <span className="mt-1 block text-small text-muted">{copy.summary(rows.length, cheapest)}</span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-[18px] leading-none text-accent transition-colors duration-200 group-hover:border-accent"
        >
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">–</span>
        </span>
      </summary>
      <div className={cn("pb-6 md:pb-8", indent)}>
        <p className="max-w-[52ch] text-body-sm leading-[1.7] text-muted">{copy.intro}</p>
        <dl className="mt-4 border-t border-line">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex justify-between gap-4 border-b border-line py-3 text-body last:border-b-0 md:py-3.5"
            >
              <dt>
                {row.label}
                {row.note ? <span className="text-small text-muted"> · {row.note}</span> : null}
              </dt>
              <dd className="font-semibold whitespace-nowrap">{row.price}</dd>
            </div>
          ))}
        </dl>
      </div>
    </details>
  );
}
