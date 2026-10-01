import { AllReviewsLink, Container, ReviewRotator } from "@/components/ui";
import { practitionerPage } from "@/content/pages/practitioner";
import type { ReviewSelection } from "@/content/reviews";
import { toReviewSlides } from "@/lib/reviews";

type ReviewSectionProps = {
  selection: ReviewSelection;
  /** Practitioner's short name ("Annika", "Dr. Tom"). */
  name: string;
  titleId: string;
};

/**
 * Customer reviews, rotating (6alb: large centred quote on the page background; ma: white
 * card). The small uppercase heading names the practitioner only when every review shown
 * names them; a profile filled up with general reviews gets the generic heading, so a general
 * review is never presented as being about this practitioner. Shorter reviews sit at the top
 * of the box (valign "start"), right under the heading; the free space collects above the
 * controls.
 */
export function ReviewSection({ selection, name, titleId }: ReviewSectionProps) {
  const copy = practitionerPage.review;
  return (
    <Container gutter="surface">
      <div className="flex flex-col items-center rounded-[24px] bg-white px-[22px] py-7 text-center md:bg-transparent md:px-8 md:py-fluid-72">
        <h2 id={titleId} className="mb-4 text-micro font-bold tracking-[2px] text-plum uppercase md:mb-6">
          {selection.allSpecific ? copy.title(name) : copy.generalTitle}
        </h2>
        <ReviewRotator
          reviews={toReviewSlides(selection.reviews)}
          labelledBy={titleId}
          surface="light"
          size="large"
          align="center"
          valign="start"
          className="w-full"
        />
        <AllReviewsLink className="mt-5 md:mt-7" />
      </div>
    </Container>
  );
}
