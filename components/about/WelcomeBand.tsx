import { ButtonLink, Container } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import { AboutHeading } from "./Prose";

type WelcomeBandProps = { copy: AboutPageCopy["welcome"] };

/**
 * Closing band "Velkommen til Fillox": a rose band (like the treatment pages' "Klar til at
 * booke?"), so it stays distinct from the beige footer right under it. Centred heading and text,
 * then the source's two buttons in its order: "Find din klinik" (outline) and "Book en
 * konsultation" (primary, the page's main action). Side by side from 768px; full-width 52px pills
 * stacked below.
 */
export function WelcomeBand({ copy }: WelcomeBandProps) {
  const titleId = `${copy.id}-title`;
  return (
    <Container
      as="section"
      gutter="surface"
      id={copy.id}
      aria-labelledby={titleId}
      className="mt-6 leading-[1.5] md:mt-10 lg:mt-fluid-56"
    >
      <div
        data-surface="band"
        className="flex flex-col items-center rounded-[24px] bg-band px-5 py-10 text-center md:px-10 md:py-fluid-84 lg:px-14"
      >
        <AboutHeading id={titleId} tone="band">
          {copy.title}
        </AboutHeading>
        <p className="mt-3.5 max-w-[44ch] text-body leading-[1.7] text-pretty text-band-body md:mt-4">{copy.text}</p>
        <div className="mt-7 flex w-full flex-col gap-3 md:mt-9 md:w-auto md:flex-row md:gap-4">
          <ButtonLink href={copy.clinicsCta.href} variant="outline" size="md" mobileSize="lg" fullWidth="mobile">
            {copy.clinicsCta.label}
          </ButtonLink>
          <ButtonLink href={copy.bookingCta.href} size="md" mobileSize="lg" fullWidth="mobile">
            {copy.bookingCta.label}
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
