import { ArrowLink, ButtonLink, Container, SectionHeading } from "@/components/ui";
import type { NewHerePage } from "@/content/pages/new-here";

/**
 * "Hvad skal jeg booke første gang?": two white cards side by side from 768px (stacked below),
 * each with its H3, text and button at the bottom (lined up). The first card is the
 * consultation (the primary button); the second sends the visitor to the contact page for help
 * (outline button), with "Se alle behandlinger" beside it.
 */
export function FirstVisitSection({ copy }: { copy: NewHerePage["firstVisit"] }) {
  const titleId = `${copy.id}-title`;
  return (
    <Container as="section" id={copy.id} aria-labelledby={titleId} className="py-14 leading-[1.5] md:py-fluid-96">
      <SectionHeading id={titleId} title={copy.title} align="left" className="mb-8 md:mb-10 xl:mb-fluid-48" titleClassName="text-balance" />
      <ul className="grid gap-3 md:grid-cols-2 md:gap-fluid-24">
        {copy.blocks.map((block, i) => (
          <li key={block.title} className="flex">
            <div className="flex w-full flex-col rounded-[18px] bg-white px-5 py-7 md:rounded-[24px] md:px-8 md:py-9 lg:px-10 xl:px-fluid-40 xl:py-fluid-40">
              <h3 className="font-heading text-[22px] leading-[1.25] text-balance tracking-display text-heading md:text-h3-md">
                {block.title}
              </h3>
              <div className="mt-3 mb-7 flex max-w-[52ch] flex-col gap-3 text-body leading-[1.7] text-pretty text-muted md:mt-4">
                {block.text.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-5 md:flex-row md:flex-wrap md:items-center md:gap-x-7">
                <ButtonLink
                  href={block.cta.href}
                  variant={i === 0 ? "primary" : "outline"}
                  size="md"
                  mobileSize="lg"
                  fullWidth="mobile"
                >
                  {block.cta.label}
                </ButtonLink>
                {block.secondary ? (
                  <ArrowLink href={block.secondary.href} className="self-start md:self-auto">
                    {block.secondary.label}
                  </ArrowLink>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
