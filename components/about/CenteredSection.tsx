import { Container } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import { AboutHeading, Prose, Statement } from "./Prose";

type CenteredSectionProps = { copy: AboutPageCopy["consistency"] };

/**
 * "Samme kompetence. Uanset hvilken Fillox du besøger.": one centred column on cream, between the
 * two-column sections around it. The heading is centred (balanced lines); the paragraphs are
 * left-aligned at the reading measure (52ch) in the middle of the page; the bold sentence is a
 * centred pull statement between two bronze hairlines (`rule` at 50%, decorative), and the
 * closing sentence follows it.
 * Spacing: 56px above and below on phones, 80px on tablets, 96 → 115px from 1024px.
 */
export function CenteredSection({ copy }: CenteredSectionProps) {
  const titleId = `${copy.id}-title`;
  return (
    <Container as="section" id={copy.id} aria-labelledby={titleId} className="py-14 leading-[1.5] md:py-20 lg:py-fluid-96">
      <AboutHeading id={titleId} className="mx-auto max-w-[18em] md:text-center">
        {copy.title}
      </AboutHeading>
      <Prose paragraphs={copy.paragraphs} className="mt-6 md:mx-auto md:mt-8 lg:mt-fluid-40" />
      {/* The rules span the prose measure: the wrapper is set in the prose size, so 52ch matches. */}
      <div className="my-8 border-y border-rule/50 py-7 text-body-lg md:mx-auto md:my-10 md:max-w-[52ch] md:py-9 lg:my-fluid-48 lg:py-fluid-40">
        <Statement className="md:text-center">{copy.statement}</Statement>
      </div>
      <Prose paragraphs={[copy.closing]} className="md:mx-auto" />
    </Container>
  );
}
