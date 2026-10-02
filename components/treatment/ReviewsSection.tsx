import { Container, Eyebrow, ReviewRotator } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import { toReviewSlides } from "@/lib/reviews";
import { TrustpilotScore } from "./TrustpilotScore";
import type { TreatmentView } from "./treatmentView";

/**
 * "Det siger kunderne om …" — rotating customer reviews on a treatment page (no design;
 * redesigned in October 2026 at the owner's request: the quote sat small in a white card with
 * a lot of empty space, and the Trustpilot score was a 14px line).
 *
 * A sand band on the surface margin (as the hero panel). From 1024px two columns, vertically
 * centred (1 : 1.25, so the score card's label stays on one line at 1024; 1 : 1.5 from 1280px):
 * left the eyebrow, H2, intro and the Trustpilot score card (TrustpilotScore: big 4,7, stars,
 * "Fremragende på Trustpilot", review count, "Se alle anmeldelser på Trustpilot →"); right the
 * rotator as a pull quote (Poppins, `size="large"`, left-aligned). Below 1024px the same order
 * stacked: heading, score card (max 28rem wide from 768px), quote, controls; one `minmax(0, 1fr)`
 * column, so nothing inside can widen the band past its padding (320px reflow).
 * Each review's rating is drawn as Trustpilot squares (`stars="trustpilot"`), as in the score
 * card: one star style in the band.
 */
export function ReviewsSection({ reviews }: { reviews: NonNullable<TreatmentView["reviews"]> }) {
  return (
    <Container
      as="section"
      gutter="surface"
      aria-labelledby={copy.sectionIds.reviews}
      className="pb-12 leading-[1.5] md:pb-fluid-96"
    >
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 rounded-[24px] bg-sand px-[22px] py-9 md:gap-10 md:px-10 md:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-fluid-72 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
        <div>
          <Eyebrow>{reviews.eyebrow}</Eyebrow>
          <h2
            id={copy.sectionIds.reviews}
            className="mt-2.5 font-heading text-[28px] leading-[1.15] tracking-display text-heading md:mt-3.5 md:text-[40px] md:leading-[1.1] xl:text-h2"
          >
            {reviews.title}
          </h2>
          <p className="mt-3 text-body leading-[1.7] text-muted md:mt-4 md:max-w-[52ch]">{reviews.intro}</p>
          <TrustpilotScore className="mt-6 md:mt-8 md:max-w-[28rem]" />
        </div>

        <ReviewRotator
          reviews={toReviewSlides(reviews.items)}
          role="group"
          surface="light"
          size="large"
          align="start"
          stars="trustpilot"
        />
      </div>
    </Container>
  );
}
