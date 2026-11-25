import type { CSSProperties } from "react";
import { Container, Photo, ResponsiveText, SectionHeading } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { BeforeAfter, SizedImageRef } from "@/content/types";
import { cn } from "@/lib/cn";
import { ScrollRegion } from "./ScrollRegion";
import type { TreatmentView } from "./treatmentView";

/** Every half has its size (`BeforeAfter` requires it): the layout and slots follow the aspects. */
const aspectOf = (image: SizedImageRef) => image.width / image.height;
const zoomOf = (image: SizedImageRef) => Math.max(1, image.zoom ?? 1);

/**
 * How a pair's two halves sit in its card, chosen from the photos (`width` / `height`):
 * - "side": portrait halves side by side in a tall box (the design, 6c / mb);
 * - "stacked": landscape halves (e.g. the clinic's profile photos, ≈ 2.4 : 1) before over after,
 *   each in a slot of the section's common aspect, so every card in the row has the same shape;
 * - "wide": a single landscape pair, side by side across the full row from 768px (a stacked card
 *   that wide would be taller than the screen).
 */
type Layout = "side" | "stacked" | "wide";

/**
 * Columns from 768px: one per pair up to the design's three, so one or two pairs still fill the
 * row (ARCHITECTURE → "Grids fill the canvas"). Static class names for Tailwind.
 */
const gridCols = ["md:grid-cols-1", "md:grid-cols-2", "md:grid-cols-3"] as const;

/** The mobile card is 300px wide with 10px padding: its inner width. */
const MOBILE_INNER = 280;

/**
 * Card width (one column) from 768px: the content width (the viewport minus the gutters, 40 · 56
 * · 64 · 80px; 1440px on the 1600 canvas) minus the gaps (24px, growing to 28.8 at 1600), divided
 * by the columns. As px at a viewport width, or as a CSS calc() for a breakpoint range.
 */
function columnWidth(cols: number) {
  const gaps = cols - 1;
  const gutters = (vw: number) => (vw >= 1536 ? 160 : vw >= 1280 ? 128 : vw >= 1024 ? 112 : 80);
  const gap = (vw: number) => (vw >= 1600 ? 28.8 : vw >= 1280 ? 24 + (4.8 * (vw - 1280)) / 320 : 24);
  return {
    px: (vw: number) => (Math.min(vw, 1600) - gutters(vw) - gaps * gap(vw)) / cols,
    css: (vw: number) => `(100vw - ${Math.round(gutters(vw) + gaps * gap(vw))}px) / ${cols}`,
  };
}

/**
 * `sizes` of one half in the portrait "side" layout: half a card (3px apart) in a box 300px high
 * at 768–1023, 400 → 520px from 1024 (h-fluid-400/520); cover paints the photo at box height × its
 * aspect where that is wider than the slot. Each range asks for its widest point (its upper end).
 * × `image.zoom`. Mobile: half the card's inner width, 200px high.
 */
function sideSizes(image: SizedImageRef, cols: number): string {
  const aspect = aspectOf(image);
  const zoom = zoomOf(image);
  const column = columnWidth(cols);
  const painted = (vw: number, height: number) => Math.ceil(Math.max(column.px(vw) / 2, height * aspect) * zoom);
  return [
    `(min-width: 1600px) ${painted(1600, 520)}px`,
    `(min-width: 1280px) ${painted(1599, 520)}px`,
    `(min-width: 1024px) ${painted(1279, 400)}px`,
    `(min-width: 768px) ${painted(1023, 300)}px`,
    `${Math.ceil(Math.max((MOBILE_INNER - 6) / 2, 200 * aspect) * zoom)}px`,
  ].join(", ");
}

/**
 * `sizes` of one half in the "stacked" (a whole card wide) or "wide" layout (half the row). The
 * slot has the section's aspect, so a photo wider than that paints at slot height × its aspect
 * (`k`), a narrower one at the slot's width.
 */
function landscapeSizes(image: SizedImageRef, slotAspect: number, cols: number, perRow: 1 | 2): string {
  const k = Math.max(1, aspectOf(image) / slotAspect) * zoomOf(image);
  const column = columnWidth(cols);
  const width = (vw: number) => `calc((${column.css(vw)}) / ${perRow} * ${k.toFixed(3)})`;
  return [
    `(min-width: 1600px) ${Math.ceil((column.px(1600) / perRow) * k)}px`,
    `(min-width: 1536px) ${width(1536)}`,
    `(min-width: 1280px) ${width(1280)}`,
    `(min-width: 1024px) ${width(1024)}`,
    `(min-width: 768px) ${width(768)}`,
    `${Math.ceil(MOBILE_INNER * k)}px`,
  ].join(", ");
}

type HalfProps = { image: SizedImageRef; tone: "before" | "after"; sizes: string; className: string; style?: CSSProperties };

function Half({ image, tone, sizes, className, style }: HalfProps) {
  return (
    <div className="relative min-w-0" style={style}>
      <Photo image={image} sizes={sizes} className={className} />
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-2 left-2 rounded-full bg-cream px-2.5 py-[3px] text-micro font-semibold text-ink md:top-3.5 md:left-3.5 md:px-3.5 md:py-1.5 md:tracking-[.12em] md:uppercase",
          tone === "after" && "md:bg-accent md:text-on-accent",
        )}
      >
        {tone === "before" ? copy.results.before : copy.results.after}
      </span>
    </div>
  );
}

type PairProps = { item: BeforeAfter; layout: Layout; cols: number; slotAspect: number };

/** The two halves of one pair. Both halves of a pair use the same crop (`position`). */
function Pair({ item, layout, cols, slotAspect }: PairProps) {
  const tones = ["before", "after"] as const;
  if (layout === "side") {
    return (
      <div className="grid grid-cols-2 gap-1.5 md:h-[300px] md:gap-[3px] md:overflow-hidden md:rounded-[24px] md:bg-cream lg:h-fluid-400/520">
        {tones.map((tone) => (
          <Half
            key={tone}
            image={item[tone]}
            tone={tone}
            sizes={sideSizes(item[tone], cols)}
            className="h-[200px] rounded-[14px]! md:h-full md:rounded-none!"
          />
        ))}
      </div>
    );
  }
  const slot: CSSProperties = { aspectRatio: String(slotAspect) };
  return (
    <div
      className={cn(
        "grid gap-1.5 md:gap-[3px] md:overflow-hidden md:rounded-[24px] md:bg-cream",
        layout === "wide" && "md:grid-cols-2",
      )}
    >
      {tones.map((tone) => (
        <Half
          key={tone}
          image={item[tone]}
          tone={tone}
          sizes={landscapeSizes(item[tone], slotAspect, cols, layout === "wide" ? 2 : 1)}
          className="h-full rounded-[14px]! md:rounded-none!"
          style={slot}
        />
      ))}
    </div>
  );
}

/**
 * Before/after pairs ("Før og efter", 6c: three 400px pairs in a grid; mb: white 300px cards in a
 * horizontal scroll-snap row that bleeds off the right edge). On wide screens the columns fill the
 * canvas and the pairs grow 400 → 520px tall, keeping roughly the design's 340 × 400 proportion.
 * Landscape photos (the clinic's profile pairs) stack before over after in the same card instead
 * (see `Layout`); the card, the labels, the spacing and the mobile row stay.
 *
 * The intro shows at every width (the design hides it below 768px): it says that each pair is the
 * same person (content/treatments.ts → "Before/after results").
 */
export function ResultsSection({ results }: { results: NonNullable<TreatmentView["results"]> }) {
  const halves = results.items.flatMap((item) => [item.before, item.after]);
  const landscape = halves.every((image) => aspectOf(image) > 1);
  const cols = Math.min(results.items.length, 3);
  const layout: Layout = !landscape ? "side" : cols === 1 ? "wide" : "stacked";
  // The common slot of landscape halves: the geometric mean of their aspects, so each photo loses
  // a similar share at the sides or at the top and bottom (one pair today: its own aspect).
  const slotAspect = landscape
    ? Math.round(Math.exp(halves.reduce((sum, image) => sum + Math.log(aspectOf(image)), 0) / halves.length) * 100) / 100
    : 1;

  return (
    <Container as="section" aria-labelledby={copy.sectionIds.results} className="pt-2 pb-12 leading-[1.5] md:pt-0 md:pb-fluid-96">
      <SectionHeading
        id={copy.sectionIds.results}
        title={results.title}
        intro={results.intro}
        leading="normal"
        className="mb-4 max-md:text-left md:mb-fluid-48"
      />
      <ScrollRegion
        label={copy.results.scrollLabel}
        // 4px of padding (cancelled by the negative margins) so the scroll box doesn't clip the
        // mobile cards' shadow-card edge; scroll-pl-1 keeps the snapped card on the gutter.
        className="-my-1 -mr-5 -ml-1 snap-x snap-mandatory scroll-pl-1 overflow-x-auto py-1 pl-1 [scrollbar-width:none] md:m-0 md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden"
      >
        <ul className={cn("flex w-max gap-3 pr-5 md:grid md:w-auto md:gap-fluid-24 md:pr-0", gridCols[cols - 1])}>
          {results.items.map((item, i) => (
            <li key={i} className="w-[300px] flex-none snap-start md:w-auto">
              <figure className="rounded-[20px] bg-white p-2.5 max-md:shadow-card md:rounded-none md:bg-transparent md:p-0">
                <Pair item={item} layout={layout} cols={cols} slotAspect={slotAspect} />
                <figcaption className="px-1.5 pt-2.5 pb-1 text-small text-muted md:mt-3.5 md:p-0">
                  <ResponsiveText mobile={item.mobileCaption} desktop={item.caption} />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </ScrollRegion>
    </Container>
  );
}
