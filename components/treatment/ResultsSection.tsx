import { Container, Photo, ResponsiveText, SectionHeading } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { ImageRef } from "@/content/types";
import { cn } from "@/lib/cn";
import { ScrollRegion } from "./ScrollRegion";
import type { TreatmentView } from "./treatmentView";

/** Aspect assumed for a photo without `width`/`height`: landscape 5 : 3, the widest current pair photo (2000 × 1228). */
const DEFAULT_ASPECT = 5 / 3;
/** Width : height of the half slot from 1024px (≈ 143 × 400 … 231 × 520); narrower photos are painted slot-wide. */
const SLOT_ASPECT = 0.45;
/** The same at 768–1023px (≈ 105 × 300 … 148 × 300) and in the mobile card (137 × 200). */
const SLOT_ASPECT_MD = 0.5;
const SLOT_ASPECT_MOBILE = 0.69;

/**
 * `sizes` of one half of a pair. The half is a tall, narrow slot (≈ 231 × 520px on the
 * 1600px canvas, 170 × 400 at the 1180 design width), so object-cover crops the photo
 * from the sides and paints it slot-HEIGHT × the photo's aspect wide (a 5 : 3 photo in a
 * 520px slot: ≈ 867px). From 1024px the value is that painted width: height 400px up to
 * 1280, 400 → 520px (h-fluid-400/520 = 0.375vw − 80px) up to 1600, then 520px; times the
 * aspect (from `width`/`height`, else DEFAULT_ASPECT: over-asking is capped by the file's own
 * size, under-asking makes landscape photos soft on 1x screens) and `image.zoom`.
 * Below 1024 the slot is just as narrow, so it is the same painted width: 300px tall in the
 * 768–1023 grid, 200px in the mobile card.
 */
function halfSizes(image: ImageRef): string {
  const aspect = image.width && image.height ? image.width / image.height : DEFAULT_ASPECT;
  const zoom = Math.max(1, image.zoom ?? 1);
  const k = Math.max(aspect, SLOT_ASPECT) * zoom;
  return [
    `(min-width: 1600px) ${Math.ceil(520 * k)}px`,
    `(min-width: 1280px) calc(${(37.5 * k).toFixed(2)}vw - ${Math.floor(80 * k)}px)`,
    `(min-width: 1024px) ${Math.ceil(400 * k)}px`,
    `(min-width: 768px) ${Math.ceil(300 * Math.max(aspect, SLOT_ASPECT_MD) * zoom)}px`,
    `${Math.ceil(200 * Math.max(aspect, SLOT_ASPECT_MOBILE) * zoom)}px`,
  ].join(", ");
}

function Half({ image, label, tone }: { image: ImageRef; label: string; tone: "before" | "after" }) {
  return (
    <div className="relative min-w-0">
      <Photo image={image} sizes={halfSizes(image)} className="h-[200px] rounded-[14px]! md:h-full md:rounded-none!" />
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-2 left-2 rounded-full bg-cream px-2.5 py-[3px] text-micro font-semibold text-ink md:top-3.5 md:left-3.5 md:px-3.5 md:py-1.5 md:tracking-[.12em] md:uppercase",
          tone === "after" && "md:bg-plum md:text-cream",
        )}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * "Resultater med …" before/after pairs (6c/6bx: three 400px pairs in a grid; mb: white
 * 300px cards in a horizontal scroll-snap row that bleeds off the right edge). On wide
 * screens the three columns fill the canvas and the pairs grow 400 → 520px tall, keeping
 * roughly the design's 340 × 400 proportion.
 */
export function ResultsSection({ results }: { results: NonNullable<TreatmentView["results"]> }) {
  return (
    <Container as="section" aria-labelledby={copy.sectionIds.results} className="pt-2 pb-12 md:pt-0 md:pb-fluid-96">
      <SectionHeading
        id={copy.sectionIds.results}
        title={results.title}
        intro={results.intro}
        leading="normal"
        className="mb-4 max-md:text-left md:mb-fluid-48"
        introClassName="max-md:hidden"
      />
      <ScrollRegion
        label={copy.results.scrollLabel}
        className="-mr-5 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:mr-0 md:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-3 pr-5 md:grid md:w-auto md:grid-cols-3 md:gap-fluid-24 md:pr-0">
          {results.items.map((item, i) => (
            <li key={i} className="w-[300px] flex-none snap-start md:w-auto">
              <figure className="rounded-[20px] bg-white p-2.5 md:rounded-none md:bg-transparent md:p-0">
                <div className="grid grid-cols-2 gap-1.5 md:h-[300px] md:gap-[3px] md:overflow-hidden md:rounded-[24px] md:bg-cream lg:h-fluid-400/520">
                  <Half image={item.before} label={copy.results.before} tone="before" />
                  <Half image={item.after} label={copy.results.after} tone="after" />
                </div>
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
