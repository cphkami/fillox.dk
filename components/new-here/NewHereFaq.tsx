import { FaqAccordion } from "@/components/treatment/FaqAccordion";
import { ArrowLink, ButtonLink, Container } from "@/components/ui";
import type { NewHerePage } from "@/content/pages/new-here";

/**
 * FAQ on the page base, as on the For mænd page (components/men/MenFaq): the heading in the left
 * column of a 1 : 1.6 split from 1024px, the treatment pages' accordion (FaqAccordion) on the
 * right. Under the heading (below 1024px after the accordion): "Book konsultation" (outline: the
 * rose closing band right below carries the primary one) and the two places the answers point to,
 * the price list and the contact page.
 */
export function NewHereFaq({ copy }: { copy: NewHerePage["faq"] }) {
  const titleId = `${copy.id}-title`;
  const links = [copy.pricesLink, copy.contactLink];
  return (
    <Container as="section" id={copy.id} aria-labelledby={titleId} className="py-14 leading-[1.5] md:py-fluid-96">
      {/* No column gap: the left column pads its own right side, so the rows need no row gap. */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:grid-rows-[auto_1fr] lg:items-start">
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-heading md:mb-8 md:text-[40px] md:leading-[1.1] lg:col-start-1 lg:row-start-1 lg:mb-0 lg:pr-16 xl:text-h2"
        >
          {copy.title}
        </h2>
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <FaqAccordion items={copy.items} />
        </div>
        <div className="mt-8 flex flex-col gap-7 md:flex-row md:flex-wrap md:items-center md:gap-x-8 lg:col-start-1 lg:row-start-2 lg:mt-9 lg:flex-col lg:items-start lg:pr-16 xl:mt-fluid-36">
          <ButtonLink href={copy.cta.href} variant="outline" size="md" mobileSize="lg" fullWidth="mobile">
            {copy.cta.label}
          </ButtonLink>
          <ul className="flex flex-wrap gap-x-8 gap-y-6 lg:flex-col lg:items-start">
            {links.map((link) => (
              <li key={link.href}>
                <ArrowLink href={link.href}>{link.label}</ArrowLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
