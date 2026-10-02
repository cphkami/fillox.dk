import { cn } from "@/lib/cn";

type TrustpilotStarsProps = {
  /** Rating 0–5, shown in Trustpilot's half steps (4.7 → 4½ squares). */
  rating: number;
  /**
   * Square size and star glyph size, e.g. "size-6 text-[17px] md:size-7 md:text-[20px]".
   * Default: 18px squares (a review's own rating).
   */
  boxClassName?: string;
  /** Gap and layout of the row; default "gap-0.5". */
  className?: string;
};

/**
 * Five Trustpilot squares (green, white star), the last one partly filled: the one look of a
 * Trustpilot rating on the treatment pages (the score card and every review in the rotator).
 * Decorative (aria-hidden): the element around it says the rating in words.
 * The hero's TrustpilotRating and the footer's FooterTrust draw the same squares.
 */
export function TrustpilotStars({ rating, boxClassName = "size-[18px] text-[13px]", className }: TrustpilotStarsProps) {
  const shown = Math.round(rating * 2) / 2;
  return (
    <span aria-hidden="true" className={cn("flex gap-0.5", className)}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, shown - i)) * 100;
        return (
          <span
            key={i}
            className={cn("flex shrink-0 items-center justify-center leading-none text-white", boxClassName)}
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
  );
}
