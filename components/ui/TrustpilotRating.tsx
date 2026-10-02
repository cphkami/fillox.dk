import { site } from "@/config/site";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { formatDecimal } from "@/lib/format";
import { trustpilotSummary } from "@/lib/reviews";

type TrustpilotRatingProps = {
  /** "md" = 20px squares (desktop), "sm" = 18px squares (mobile). */
  size?: "sm" | "md";
  /** "ink" on light surfaces, "band" on a rose band. */
  tone?: "ink" | "band";
  /** Score 0–5; defaults to site.trustpilot.score. Stars are shown in half steps. */
  score?: number;
  /** Label before the stars; defaults to ui.trustpilotLabel ("Fremragende"). */
  label?: string;
  /** Link the rating to the Trustpilot profile (site.trustpilot.url, new tab) with a 44px hit area. */
  linked?: boolean;
  /** Show the aggregate after the stars: "4,7 ud af 5 · 172 anmeldelser" (needs trustpilot.reviewCount). */
  showSummary?: boolean;
  /** Use for font-size / alignment, e.g. "max-md:text-[13px] justify-center". Default text 14px (`text-small`, 15 at 1600). */
  className?: string;
};

const textTones = { ink: "text-ink", band: "text-on-band" } as const;
const summaryTones = { ink: "text-muted", band: "text-band-body" } as const;

/**
 * "Fremragende ★★★★½" — label + five green Trustpilot squares, last one partly filled. The
 * accessible name adds the review count when config/site.ts has one ("4,7 ud af 5 · 172
 * anmeldelser · Trustpilot").
 */
export function TrustpilotRating({
  size = "md",
  tone = "ink",
  score = site.trustpilot.score,
  label = ui.trustpilotLabel,
  linked = false,
  showSummary = false,
  className,
}: TrustpilotRatingProps) {
  // Trustpilot shows stars in half steps (4.7 → 4.5 stars).
  const shown = Math.round(score * 2) / 2;
  const scoreText = formatDecimal(score);
  // The count belongs to the site's own score only (not to a `score` passed in).
  const summary = score === site.trustpilot.score ? trustpilotSummary() : undefined;
  const visibleSummary = showSummary ? summary : undefined;
  const box = size === "md" ? "size-5 text-small" : "size-[18px] text-[13px]";

  const content = (
    <>
      <span className="font-semibold decoration-1 underline-offset-[3px] group-hover/tp:underline">{label}</span>
      <span role="img" aria-label={visibleSummary ? ui.trustpilot : `${summary ?? `${scoreText} ${ui.outOf} 5`} · ${ui.trustpilot}`} className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, shown - i)) * 100;
          return (
            <span
              key={i}
              aria-hidden="true"
              className={cn("flex items-center justify-center leading-none text-white", box)}
              style={{
                background:
                  fill >= 100
                    ? "var(--color-trustpilot)"
                    : `linear-gradient(90deg, var(--color-trustpilot) ${fill}%, var(--color-trustpilot-empty) ${fill}%)`,
              }}
            >
              ★
            </span>
          );
        })}
      </span>
      {visibleSummary ? <span className={summaryTones[tone]}>{visibleSummary}</span> : null}
    </>
  );

  const classes = cn("flex flex-wrap items-center gap-x-2.5 gap-y-1 text-small", textTones[tone], className);

  if (linked) {
    return (
      // The invisible ::after (12px above and below) makes the ~20px row a 44px touch target.
      <a
        href={site.trustpilot.url}
        target="_blank"
        rel="noopener"
        className={cn(classes, "group/tp relative w-fit after:absolute after:-inset-x-1 after:-inset-y-3")}
      >
        {content}
        <span className="sr-only">{` (${ui.opensInNewTab})`}</span>
      </a>
    );
  }
  return <div className={classes}>{content}</div>;
}
