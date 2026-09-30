import { Container } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { FaqItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { FaqAccordion } from "./FaqAccordion";

/** "Ofte stillede spørgsmål" powder panel (6c/6bx, mb). */
export function FaqSection({ items, afterBand }: { items: FaqItem[]; afterBand?: boolean }) {
  return (
    <Container as="section" gutter="surface" aria-labelledby="faq" className={cn(afterBand && "mt-3 md:mt-6")}>
      <div className="rounded-[24px] bg-powder px-5 py-8 md:px-10 md:py-14 lg:px-14 lg:py-[72px]">
        <h2
          id="faq"
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:mb-8 md:text-[40px] md:leading-normal"
        >
          {copy.faq.title}
        </h2>
        <FaqAccordion items={items} />
      </div>
    </Container>
  );
}
