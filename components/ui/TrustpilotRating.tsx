import { site } from "@/config/site";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { formatDecimal } from "@/lib/format";

type TrustpilotRatingProps = {
  /** "md" = 20px squares (desktop), "sm" = 18px squares (mobile). */
  size?: "sm" | "md";
  /** "light" = cream label for plum surfaces. */
  tone?: "ink" | "light";
  /** Score 0–5; defaults to site.trustpilot.score. Stars are shown in half steps. */
  score?: number;
  /** Label before the stars; defaults to ui.trustpilotLabel ("Fremragende"). */
  label?: string;
  /** Link the rating to the Trustpilot profile (site.trustpilot.url). */
  linked?: boolean;
  /** Use for font-size / alignment, e.g. "max-md:text-[13px] justify-center". Default text 14px (`text-small`, 15 at 1600). */
  className?: string;
};

/** "Fremragende ★★★★½" — label + five green Trustpilot squares, last one partly filled. */
export function TrustpilotRating({
  size = "md",
  tone = "ink",
  score = site.trustpilot.score,
  label = ui.trustpilotLabel,
  linked = false,
  className,
}: TrustpilotRatingProps) {
  // Trustpilot shows stars in half steps (4.7 → 4.5 stars).
  const shown = Math.round(score * 2) / 2;
  const scoreText = formatDecimal(score);
  const box = size === "md" ? "size-5 text-small" : "size-[18px] text-[13px]";

  const content = (
    <>
      <span className="font-semibold">{label}</span>
      <span role="img" aria-label={`${scoreText} ${ui.outOf} 5 · ${ui.trustpilot}`} className="flex gap-0.5">
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
    </>
  );

  const classes = cn(
    "flex items-center gap-2.5 text-small",
    tone === "light" ? "text-cream" : "text-ink",
    className,
  );

  if (linked) {
    return (
      <a href={site.trustpilot.url} target="_blank" rel="noopener noreferrer" className={cn(classes, "w-fit")}>
        {content}
      </a>
    );
  }
  return <div className={classes}>{content}</div>;
}
