import { site } from "@/config/site";
import type { CustomerReview } from "@/content/types";
import { ui } from "@/content/ui";
import { formatDecimal, formatInteger } from "./format";
import { fillTemplate } from "./template";

/** One review as components/ui/ReviewRotator renders it: plain, serialisable strings. */
export type ReviewSlide = {
  id: string;
  /** The excerpt (`short`) or, when the review has none, its full text. */
  quote: string;
  author: string;
  /** ISO date for <time dateTime>. */
  date: string;
  /** The date in the market's format, e.g. "23. sep. 2026". */
  dateLabel: string;
  rating: number;
  source: string;
  url: string;
};

// The ISO date is the date the source shows; format it as that calendar day in every time zone.
const reviewDateFormat = new Intl.DateTimeFormat(site.locale, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-09-23" → "23. sep. 2026" (DK). */
export function formatReviewDate(isoDate: string): string {
  return reviewDateFormat.format(new Date(`${isoDate}T00:00:00Z`));
}

/**
 * Reviews → rotator slides, formatted on the server (dates in site.locale), so the client
 * component only gets strings and the first render matches the server's HTML.
 */
export function toReviewSlides(reviews: CustomerReview[]): ReviewSlide[] {
  return reviews.map((review) => ({
    id: review.id,
    // A no-break space before "…" keeps an ellipsis on the line of the sentence before it.
    quote: (review.short ?? review.text).trim().replace(/ …/g, "\u00a0…"),
    author: review.author.trim(),
    date: review.date,
    dateLabel: formatReviewDate(review.date),
    rating: Math.max(0, Math.min(5, Math.round(review.rating))),
    source: review.source,
    url: review.url,
  }));
}

/** "4,7 ud af 5 · 172 anmeldelser" (config/site.ts → trustpilot); undefined without a review count. */
export function trustpilotSummary(): string | undefined {
  const { score, reviewCount } = site.trustpilot;
  if (reviewCount === undefined) return undefined;
  return fillTemplate(ui.trustpilotSummary, { score: formatDecimal(score), count: formatInteger(reviewCount) });
}
