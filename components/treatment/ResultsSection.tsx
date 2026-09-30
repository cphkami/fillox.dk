import { Container, Photo, SectionHeading } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { ImageRef } from "@/content/types";
import { cn } from "@/lib/cn";
import { ScrollRegion } from "./ScrollRegion";
import type { TreatmentView } from "./treatmentView";
import { Swap } from "./Swap";

/** One half of a pair: 170px at 1180+, ~14% of the viewport in the 768–1179 grid, 137px in the mobile card. */
const halfSizes = "(min-width: 1180px) 170px, (min-width: 768px) 15vw, 140px";

function Half({ image, label, tone }: { image: ImageRef; label: string; tone: "before" | "after" }) {
  return (
    <div className="relative min-w-0">
      <Photo image={image} sizes={halfSizes} className="h-[200px] rounded-[14px]! md:h-full md:rounded-none!" />
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-2 left-2 rounded-full bg-cream px-2.5 py-[3px] text-[12px] font-semibold text-ink md:top-3.5 md:left-3.5 md:px-3.5 md:py-1.5 md:tracking-[.12em] md:uppercase",
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
 * 300px cards in a horizontal scroll-snap row that bleeds off the right edge).
 */
export function ResultsSection({ results }: { results: NonNullable<TreatmentView["results"]> }) {
  return (
    <Container as="section" aria-labelledby="resultater" className="pt-2 pb-12 md:pt-0 md:pb-24">
      <SectionHeading
        id="resultater"
        title={results.title}
        intro={results.intro}
        leading="normal"
        className="mb-4 max-md:text-left md:mb-12"
        introClassName="max-md:hidden"
      />
      <ScrollRegion
        label={copy.results.scrollLabel}
        className="-mr-5 snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:mr-0 md:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max gap-3 pr-5 md:grid md:w-auto md:grid-cols-3 md:gap-6 md:pr-0">
          {results.items.map((item, i) => (
            <li key={i} className="w-[300px] flex-none snap-start md:w-auto">
              <figure className="rounded-[20px] bg-white p-2.5 md:rounded-none md:bg-transparent md:p-0">
                <div className="grid grid-cols-2 gap-1.5 md:h-[300px] md:gap-[3px] md:overflow-hidden md:rounded-[24px] md:bg-cream lg:h-[400px]">
                  <Half image={item.before} label={copy.results.before} tone="before" />
                  <Half image={item.after} label={copy.results.after} tone="after" />
                </div>
                <figcaption className="px-1.5 pt-2.5 pb-1 text-[13px] text-muted md:mt-3.5 md:p-0 md:text-[14px]">
                  <Swap mobile={item.mobileCaption} desktop={item.caption} />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </ScrollRegion>
    </Container>
  );
}
