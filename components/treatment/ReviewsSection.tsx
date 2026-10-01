import { AllReviewsLink, Container, Eyebrow, ReviewRotator, TrustpilotRating } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import { toReviewSlides } from "@/lib/reviews";
import type { TreatmentView } from "./treatmentView";

/**
 * "Det siger kunderne om …" — rotating customer reviews on a treatment page (no design; built
 * like the price section: heading column + content column, 1 : 1.4 from 768px). Left: eyebrow,
 * H2, intro and Fillox's Trustpilot rating with its review count; right: a white card with the
 * compact rotator. Below 768px: heading, card, then "Se alle anmeldelser på Trustpilot →".
 */
export function ReviewsSection({ reviews }: { reviews: NonNullable<TreatmentView["reviews"]> }) {
  return (
    <Container
      as="section"
      aria-labelledby={copy.sectionIds.reviews}
      className="grid gap-5 pt-2 pb-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:grid-rows-[auto_1fr] md:items-start md:gap-x-10 md:gap-y-0 md:pt-0 md:pb-fluid-96 lg:gap-x-fluid-64"
    >
      <div className="flex flex-col gap-4 md:col-start-1 md:row-start-1 md:block">
        <Eyebrow className="md:mb-3.5">{reviews.eyebrow}</Eyebrow>
        <h2
          id={copy.sectionIds.reviews}
          className="text-[28px] leading-[1.15] font-semibold tracking-display md:mb-4 md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {reviews.title}
        </h2>
        <p className="text-body leading-[1.7] text-muted md:max-w-[52ch] md:leading-[1.75]">{reviews.intro}</p>
        <TrustpilotRating showSummary className="md:mt-5" />
      </div>

      <div className="rounded-[24px] bg-white px-5 py-6 md:col-start-2 md:row-span-2 md:row-start-1 md:p-8 xl:p-fluid-40">
        <ReviewRotator
          reviews={toReviewSlides(reviews.items)}
          role="group"
          surface="light"
          size="compact"
          align="start"
        />
      </div>

      <AllReviewsLink className="justify-self-start md:col-start-1 md:row-start-2 md:mt-6" />
    </Container>
  );
}
