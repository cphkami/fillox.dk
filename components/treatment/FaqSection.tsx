import { Container } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { FaqItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { FaqAccordion } from "./FaqAccordion";

/**
 * "Ofte stillede spørgsmål" powder panel (6c/6bx, mb). From 1536px (2xl) the heading moves
 * into a left column beside the accordion (the 1 : 1.4 split of the price list), so rows
 * don't stretch 1,300px+ from question to toggle and a short list doesn't leave the band empty.
 */
export function FaqSection({ items, afterBand }: { items: FaqItem[]; afterBand?: boolean }) {
  return (
    <Container as="section" gutter="surface" aria-labelledby="faq" className={cn(afterBand && "mt-surface")}>
      <div className="rounded-[24px] bg-powder px-5 py-8 md:px-10 md:py-14 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:grid 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] 2xl:items-start 2xl:gap-fluid-64 2xl:px-20">
        <h2
          id="faq"
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:mb-8 md:py-[.2em] md:text-[40px] md:leading-[1.1] xl:text-h2 2xl:mb-0 2xl:py-0"
        >
          {copy.faq.title}
        </h2>
        <FaqAccordion items={items} />
      </div>
    </Container>
  );
}
