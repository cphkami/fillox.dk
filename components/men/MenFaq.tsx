import { FaqAccordion } from "@/components/treatment/FaqAccordion";
import { Container } from "@/components/ui";
import type { MenPage } from "@/content/pages/men";

/**
 * Compact FAQ on the page base (no panel): the heading in the left column of the page's 1 : 1.6
 * split from 1024px and the treatment pages' accordion (FaqAccordion: Poppins questions, bronze
 * hairlines, first answer open on phones) on the right. It follows "Dine behandlere" (MenCare),
 * whose bottom padding is the space above, so it only pads its bottom.
 */
export function MenFaq({ copy }: { copy: MenPage["faq"] }) {
  const titleId = `${copy.id}-title`;
  return (
    <Container as="section" aria-labelledby={titleId} className="pb-14 leading-[1.5] md:pb-fluid-96">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-start lg:gap-fluid-64">
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-heading md:mb-8 md:text-[40px] md:leading-[1.1] lg:mb-0 xl:text-h2"
        >
          {copy.title}
        </h2>
        <FaqAccordion items={copy.items} />
      </div>
    </Container>
  );
}
