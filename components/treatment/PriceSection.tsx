import { ArrowLink, ButtonLink, Container, Eyebrow, ResponsiveText } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import type { PriceGroup, PriceItem, TreatmentView } from "./treatmentView";

/** Lists with more rows than this are "long": two columns of rows, side-by-side card only from 1536px. */
const ONE_COLUMN_MAX = 6;

/**
 * Card layout by list length. Below the split the card is stacked (rose panel over the rows) and
 * from 768px the rose panel is a row: heading left, "fra" price + button right. From the split
 * the rose panel is the left column with the price block pinned to its bottom, and the rows are
 * top-aligned: their first line sits on the eyebrow's line.
 * - short (≤ 6 rows): split at 1024px (1 : 1.5, 1 : 1.25 from 1280px: the rows panel is then
 *   ~43rem at most, so label and price stay close), one column of rows.
 * - long (Botox 12, laser 8): split at 1536px (1 : 2). The rows run in two columns once the rows
 *   panel is 42rem wide (from 1024px, stacked); beside the rose panel that only leaves room for
 *   the longest Botox labels on one line from ~1536px.
 * Both panels share the bands' inner padding (lg:px-14 xl:px-16 2xl:px-20), so the H2 sits on the
 * same line as the reviews band's, the FAQ's and the footer's.
 */
const layouts = {
  short: {
    card: "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]",
    panel: "md:max-lg:flex-row md:max-lg:items-center md:max-lg:gap-12",
    priceBlock: "md:max-lg:shrink-0 md:max-lg:border-t-0 md:max-lg:pt-0",
    rowsPanel: "lg:py-fluid-48",
  },
  long: {
    card: "2xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]",
    panel: "md:max-2xl:flex-row md:max-2xl:items-center md:max-2xl:gap-12",
    priceBlock: "md:max-2xl:shrink-0 md:max-2xl:border-t-0 md:max-2xl:pt-0",
    rowsPanel: "lg:pt-fluid-40 lg:pb-fluid-48 2xl:pt-fluid-48",
  },
} as const;

/** Two columns from a 42rem rows panel (container query); stacked, they read as one list. */
const TWO_COLUMNS = "@min-[42rem]:grid @min-[42rem]:grid-cols-2 @min-[42rem]:items-start @min-[42rem]:gap-x-12";

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-[.3em] size-[1em] shrink-0" fill="none">
      <path d="M3 8.5 6.5 12 13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Weight of a group in a column: its rows, plus one for its heading (the note sits beside it). */
const groupWeight = (g: PriceGroup) => g.items.length + (g.title ? 1 : 0);

/**
 * The groups of a long list in two columns. One untitled group (laser) is split in half; groups
 * (Botox) are split between two groups where the columns come out most even (Botox: single areas
 * + Hyperhidrose | the area packages), never inside a group.
 */
function toColumns(groups: PriceGroup[]): PriceGroup[][] {
  const [only] = groups;
  if (groups.length === 1 && only) {
    const half = Math.ceil(only.items.length / 2);
    return [[{ items: only.items.slice(0, half) }], [{ items: only.items.slice(half) }]];
  }
  const weights = groups.map(groupWeight);
  const total = weights.reduce((sum, w) => sum + w, 0);
  let best = 1;
  let bestDiff = Infinity;
  let left = 0;
  for (let k = 1; k < groups.length; k++) {
    left += weights[k - 1] ?? 0;
    const diff = Math.abs(total - 2 * left);
    if (diff < bestDiff) {
      best = k;
      bestDiff = diff;
    }
  }
  return [groups.slice(0, best), groups.slice(best)];
}

/**
 * One price row: label and price on a two-column grid, the price right-aligned in tabular figures
 * on the label's first baseline; the note (14px taupe) under the label below 768px, after it from
 * 768px as one unbroken piece (it wraps inside itself only when it is longer than the line).
 * `firstClass`: removes the space above the first row of a column (on the line of the eyebrow).
 */
function PriceRow({ item, firstClass }: { item: PriceItem; firstClass?: string }) {
  return (
    <div
      // 16px rows (18 at 1600), 14px notes; line height 1.5 from the section.
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-line py-[15px] md:py-4",
        firstClass,
      )}
    >
      <dt className="text-body text-ink">
        <ResponsiveText mobile={item.mobileLabel} desktop={item.label} />
        {item.note ? (
          <>
            {" "}
            <span className="text-small text-taupe max-md:mt-0.5 max-md:block md:inline-block">{item.note}</span>
          </>
        ) : null}
      </dt>
      <dd className="text-body font-semibold whitespace-nowrap text-heading tabular-nums">{item.price}</dd>
    </div>
  );
}

type GroupPosition = "top" | "column-top" | "after";

/** Space above a group: none at the top of a column (the second column's only when side by side). */
const groupSpace: Record<GroupPosition, string> = { top: "", "column-top": "mt-8 @min-[42rem]:mt-0", after: "mt-8" };
/** An untitled group's first row starts at the top of its column; under a heading it keeps its padding. */
// `!`: the row's own `md:py-4` would win over a plain `pt-0`.
const firstRowSpace: Record<GroupPosition, string | undefined> = {
  top: "pt-0!",
  "column-top": "@min-[42rem]:pt-0!",
  after: undefined,
};

/**
 * A group: its heading (12px uppercase taupe, as an eyebrow; the note beside it, so the first rows
 * of two columns stay on one line) and its rows.
 */
function Group({ group, position }: { group: PriceGroup; position: GroupPosition }) {
  const firstClass = group.title ? undefined : firstRowSpace[position];
  // An untitled group under another one (a column split in half, stacked) continues the list.
  const space = group.title ? groupSpace[position] : "";
  return (
    <div className={space}>
      {group.title ? (
        // Line heights 1.75 (12px) and 1.5 (14px) give both the same 21px line, so a heading with a
        // note is as tall as one without: the first rows of two columns stay on one line.
        <div className="flex flex-wrap items-baseline gap-x-3 pb-1">
          <h3 className="text-micro leading-[1.75] font-bold tracking-[2px] text-taupe uppercase">{group.title}</h3>
          {group.note ? <p className="text-small leading-[1.5] text-taupe">{group.note}</p> : null}
        </div>
      ) : null}
      <dl>
        {group.items.map((item, i) => (
          <PriceRow key={`${item.label}-${i}`} item={item} firstClass={i === 0 ? firstClass : undefined} />
        ))}
      </dl>
    </div>
  );
}

/**
 * "Vælg din mængde" / "Betal pr. område" / "Vejledende priser" — the price card (6c/6bx and mb
 * had a plain list next to the heading; redesigned in October 2026 at the owner's request: the
 * heading column stood empty next to long lists, the "fra" price was not shown and the section
 * had no way to book).
 *
 * A white card on the surface margin, like the bands around it:
 * - Rose panel (`bg-band`): eyebrow, H2, intro, and the price block: the "fra" price large
 *   (Poppins; only when a row has that amount), "Konsultation og kontrol er altid gratis" with a
 *   check mark (unless the intro or the free rows say it), "Book tid" from 768px (below, the fixed
 *   book bar is always on screen). See `layouts` for where it sits.
 * - White rows panel: the groups (content/pages/treatments.ts → prices.groups; one untitled group
 *   for most treatments), each a <dl> (label = dt, price = dd) in list order, hairlines between
 *   rows; long lists in two columns (`toColumns`). Under them, full width, the free konsultation /
 *   kontrol rows of fallback lists, then "Se alle priser →" (the treatment's card on /priser).
 */
export function PriceSection({ prices }: { prices: NonNullable<TreatmentView["prices"]> }) {
  const rowCount = prices.groups.reduce((sum, g) => sum + g.items.length, 0);
  const long = rowCount > ONE_COLUMN_MAX;
  const layout = layouts[long ? "long" : "short"];
  const columns = long ? toColumns(prices.groups) : [prices.groups];
  // Below 768px "Book tid" is left out (the book bar), so a block without a price or note goes too.
  const priceOrNote = Boolean(prices.fromPrice || prices.note);

  return (
    <Container
      as="section"
      gutter="surface"
      aria-labelledby={copy.sectionIds.prices}
      className="pb-12 leading-[1.5] md:pb-fluid-96"
    >
      <div className={cn("grid overflow-hidden rounded-[24px] bg-white", layout.card)}>
        <div
          data-surface="band"
          className={cn(
            "flex flex-col justify-between gap-7 bg-band px-[22px] pt-8 pb-7 md:gap-9 md:px-10 md:py-10 lg:px-14 lg:py-fluid-48 xl:px-16 2xl:px-20",
            layout.panel,
          )}
        >
          <div className="min-w-0">
            <Eyebrow tone="band">{prices.eyebrow}</Eyebrow>
            <h2
              id={copy.sectionIds.prices}
              className="mt-2.5 font-heading text-[28px] leading-[1.15] tracking-display text-on-band md:mt-3.5 md:text-[40px] md:leading-[1.1] xl:text-h2"
            >
              {prices.title}
            </h2>
            {prices.intro ? (
              <p className="mt-3 text-body leading-[1.7] text-band-body md:mt-4 md:max-w-[52ch]">
                <ResponsiveText mobile={prices.mobileIntro} desktop={prices.intro} />
              </p>
            ) : null}
          </div>

          <div className={cn("border-t border-band-line pt-6 md:pt-7", !priceOrNote && "max-md:hidden", layout.priceBlock)}>
            {prices.fromPrice ? (
              <p className="flex items-baseline gap-2.5 text-on-band">
                <span className="text-lead text-band-body">{ui.from}</span>
                <span className="font-heading text-[40px] leading-none tracking-display md:text-h2">{prices.fromPrice}</span>
              </p>
            ) : null}
            {prices.note ? (
              <p className={cn("flex gap-2 text-body-sm text-band-body", prices.fromPrice && "mt-3 md:mt-3.5")}>
                <CheckIcon />
                {prices.note}
              </p>
            ) : null}
            <ButtonLink href={prices.cta.href} size="md" className={cn("max-md:hidden", priceOrNote && "mt-7")}>
              {prices.cta.label}
            </ButtonLink>
          </div>
        </div>

        <div
          className={cn(
            "@container flex flex-col px-[22px] pt-6 pb-7 md:px-10 md:pt-8 md:pb-10 lg:px-14 xl:px-16 2xl:px-20",
            layout.rowsPanel,
          )}
        >
          <div className={long ? TWO_COLUMNS : undefined}>
            {columns.map((column, c) => (
              <div key={c}>
                {column.map((group, g) => (
                  <Group
                    key={`${group.title ?? ""}-${g}`}
                    group={group}
                    position={g > 0 ? "after" : c > 0 ? "column-top" : "top"}
                  />
                ))}
              </div>
            ))}
          </div>
          {prices.extras.length ? (
            <dl>
              {prices.extras.map((item, i) => (
                <PriceRow key={`${item.label}-${i}`} item={item} />
              ))}
            </dl>
          ) : null}
          {prices.link ? (
            <ArrowLink href={prices.link.href} className="mt-6 self-start md:mt-7">
              {prices.link.label}
            </ArrowLink>
          ) : null}
        </div>
      </div>
    </Container>
  );
}
