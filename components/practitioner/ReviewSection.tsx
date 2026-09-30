import { Container, ResponsiveText } from "@/components/ui";
import { practitionerPage } from "@/content/pages/practitioner";
import type { Review } from "@/content/types";
import { ui } from "@/content/ui";

/**
 * Customer quote(s) with stars (6alb: large centred quote on the page background;
 * ma: white card).
 */
export function ReviewSection({ reviews }: { reviews: Review[] }) {
  const { quoteOpen, quoteClose, separator } = practitionerPage.review;

  return (
    <Container gutter="surface">
      <div className="flex flex-col gap-3 rounded-[24px] bg-white px-[22px] py-7 text-center md:gap-16 md:bg-transparent md:px-8 md:py-fluid-72">
        {reviews.map((review) => {
          const rating = Math.max(0, Math.min(5, Math.round(review.rating)));
          return (
            <figure key={`${review.author}-${review.quote}`} className="flex flex-col gap-2.5 md:gap-0">
              <p
                role="img"
                aria-label={`${rating} ${ui.outOf} 5`}
                className="tracking-[4px] text-plum md:mb-[18px] md:text-[18px]"
              >
                {"★".repeat(rating)}
              </p>
              <blockquote className="text-[17px] leading-[1.55] font-medium md:mx-auto md:mb-4 md:max-w-[30em] md:text-[24px] md:leading-[1.4] md:font-semibold md:tracking-display lg:text-quote">
                <p>
                  {quoteOpen}
                  <ResponsiveText mobile={review.quoteShort} desktop={review.quote} />
                  {quoteClose}
                </p>
              </blockquote>
              <figcaption className="text-[13px] text-muted md:text-[14px]">
                {review.author}
                {separator}
                {review.source}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </Container>
  );
}
