import Link from "next/link";
import { ArrowCircle } from "@/components/home/ArrowCircle";
import { ArrowLink, Container, Eyebrow } from "@/components/ui";
import type { MenPage } from "@/content/pages/men";
import { MenPrices } from "./MenPrices";
import type { MenPriceRow, MenTreatmentRow } from "./menView";

/** "01", "02" … (decorative: the <ol> carries the order). */
const number = (i: number) => String(i + 1).padStart(2, "0");

/** Left padding that lines text up with the names: the number column + the column gap. */
const NAME_INDENT = "pl-[calc(2rem+0.75rem)] md:pl-[calc(3.5rem+1.5rem)]";

/**
 * The short list of treatments for men: a numbered list on straight hairlines (an espresso rule
 * on top, `line` between rows), no cards and no photos. Each row is one link to the treatment
 * page: number · name + one-liner · "fra" price · arrow circle. From 1024px the heading sits in
 * a left column beside the list (the 1 : 1.6 split), as the price lists do.
 *
 * Hover / focus: the name turns accent and the arrow circle fills (accent, krem arrow).
 * Below 768px the price moves under the one-liner, so the name keeps the full width. The price
 * carries its note ("op til 1 ml"), so a "fra" price never reads lower than it is.
 *
 * Under the list: "Laserpakker for mænd" as a fold-out row (MenPrices) and "Se alle priser".
 * The page has no price section of its own: the prices are on the rows.
 */
export function MenTreatments({
  copy,
  rows,
  packageRows,
}: {
  copy: MenPage["treatments"];
  rows: MenTreatmentRow[];
  packageRows: MenPriceRow[];
}) {
  const titleId = `${copy.id}-title`;
  return (
    <Container
      as="section"
      id={copy.id}
      aria-labelledby={titleId}
      className="py-14 leading-[1.5] md:py-fluid-96 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-start lg:gap-fluid-64"
    >
      <div className="mb-7 md:mb-10 lg:mb-0">
        <Eyebrow className="mb-3.5">{copy.eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-heading md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {copy.title}
        </h2>
        <p className="mt-4 max-w-[44ch] text-body leading-[1.7] text-pretty text-muted md:leading-[1.75]">{copy.intro}</p>
      </div>

      <div>
        <ol className="border-t border-heading">
          {rows.map((row, i) => (
            <li key={row.slug} className="border-b border-line">
              <Link
                href={row.href}
                className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-x-3 py-5 md:grid-cols-[3.5rem_minmax(0,1fr)_auto_auto] md:items-baseline md:gap-x-6 md:py-7 xl:py-fluid-28"
              >
                <span aria-hidden="true" className="pt-[5px] text-micro font-bold tracking-[2px] text-taupe md:pt-0">
                  {number(i)}
                </span>
                <span className="min-w-0">
                  <span className="block font-heading text-[22px] leading-[1.2] tracking-display text-heading transition-colors duration-200 group-hover:text-accent md:text-h3">
                    {row.name}
                  </span>
                  <span className="mt-1.5 block text-body leading-[1.6] text-pretty text-muted">{row.text}</span>
                  {row.price ? (
                    <span className="mt-2 block text-ui-sm font-semibold text-ink md:hidden">
                      {row.price}
                      {row.priceNote ? (
                        <span className="text-small font-normal text-muted"> · {row.priceNote}</span>
                      ) : null}
                    </span>
                  ) : null}
                </span>
                {row.price ? (
                  <span className="text-right whitespace-nowrap max-md:hidden">
                    <span className="block text-ui-sm font-semibold text-ink">{row.price}</span>
                    {row.priceNote ? <span className="mt-0.5 block text-small text-muted">{row.priceNote}</span> : null}
                  </span>
                ) : (
                  <span className="max-md:hidden" />
                )}
                <ArrowCircle className="border border-line text-accent group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent group-focus-visible:border-accent group-focus-visible:bg-accent group-focus-visible:text-on-accent" />
              </Link>
            </li>
          ))}
        </ol>

        <MenPrices copy={copy.laserPackages} rows={packageRows} indent={NAME_INDENT} />
        <div className={NAME_INDENT}>
          <ArrowLink href={copy.pricesLink.href} className="mt-6 md:mt-7">
            {copy.pricesLink.label}
          </ArrowLink>
        </div>
      </div>
    </Container>
  );
}
