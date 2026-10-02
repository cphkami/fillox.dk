import { AllReviewsLink, TrustpilotStars } from "@/components/ui";
import { site } from "@/config/site";
import { treatmentPage as copy } from "@/content/pages/treatments";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { formatDecimal, formatInteger } from "@/lib/format";

/**
 * Fillox's Trustpilot score as a white card (treatment pages, next to the reviews): the score
 * large ("4,7" / "ud af 5"), five Trustpilot squares in half steps (4,7 → 4½), "Fremragende på
 * Trustpilot", "Baseret på 172 anmeldelser" and, under a hairline, "Se alle anmeldelser på
 * Trustpilot →". Values: config/site.ts → trustpilot + ui.trustpilotLabel; words:
 * content/pages/treatments.ts → reviews.score.
 *
 * Screen readers get one sentence (sr-only) instead of the visual block, which repeats the
 * score three ways (number, squares, label).
 *
 * Below 360px (the 320px reflow width) the score sits above the squares ("4,7 ud af 5" on one
 * line, no divider): side by side the card needs ~270px and the band has 252.
 */
export function TrustpilotScore({ className }: { className?: string }) {
  const { score, reviewCount } = site.trustpilot;
  const t = copy.reviews.score;
  const scoreText = formatDecimal(score);
  const count = reviewCount !== undefined ? formatInteger(reviewCount) : undefined;
  const label = t.label(ui.trustpilotLabel);

  return (
    <div className={cn("rounded-[20px] bg-white px-5 pt-5 pb-4 md:px-6 md:pt-6 md:pb-5 xl:px-fluid-28 xl:pt-fluid-24", className)}>
      <p className="sr-only">
        {count ? t.accessible(ui.trustpilotLabel, scoreText, count) : `${label}: ${scoreText} ${t.outOf}`}
      </p>
      <div aria-hidden="true" className="flex items-center gap-4 max-[359px]:flex-col max-[359px]:items-start max-[359px]:gap-3 md:gap-5">
        <div className="flex shrink-0 flex-col items-center max-[359px]:flex-row max-[359px]:items-baseline max-[359px]:gap-2">
          <span className="font-heading text-[48px] leading-none tracking-hero text-heading md:text-h1-xs">{scoreText}</span>
          <span className="mt-1.5 text-small whitespace-nowrap text-muted max-[359px]:mt-0">{t.outOf}</span>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5 border-l border-line pl-4 max-[359px]:border-l-0 max-[359px]:pl-0 md:pl-5">
          <TrustpilotStars rating={score} boxClassName="size-6 text-[17px] md:size-7 md:text-[20px]" className="gap-[3px]" />
          <span className="mt-0.5 text-body-sm font-semibold text-ink">{label}</span>
          {count ? <span className="text-small text-muted">{t.count(count)}</span> : null}
        </div>
      </div>
      <div className="mt-5 border-t border-line pt-4 md:mt-6">
        <AllReviewsLink />
      </div>
    </div>
  );
}
