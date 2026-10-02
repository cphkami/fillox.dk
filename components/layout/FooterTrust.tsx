import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import { formatDecimal, formatInteger } from "@/lib/format";
import { fillTemplate } from "@/lib/template";

/**
 * "Fremragende ★★★★½ 4,7 ud af 5 · 172 anmeldelser på Trustpilot": the Trustpilot strip at the
 * very bottom of the footer, on every page (owner, 2026-10). The numbers are config/site.ts →
 * trustpilot (as shown on the profile; update them together), the label is ui.trustpilotLabel,
 * the line content/layout.ts → footer.trust.summary.
 *
 * One link to the Trustpilot profile (new tab, rel="noopener"): a translucent white pill on the
 * beige (the contact cards' white), at least 44px high, centred; below 768px a full-width card
 * like the contact cards, with the summary on a second line. The stars are the hero's (`TrustpilotRating`): five green squares, the last one partly
 * filled in half steps (4.7 → 4.5). They are decorative here: the link text says the score.
 */
export function FooterTrust({ className }: { className?: string }) {
  const { score, reviewCount, url } = site.trustpilot;
  // Without a review count (a market whose profile has none yet): "4,7 ud af 5 · Trustpilot".
  const summary =
    reviewCount === undefined
      ? `${formatDecimal(score)} ${ui.outOf} 5${ui.separator}${ui.trustpilot}`
      : fillTemplate(layoutCopy.footer.trust.summary, { score: formatDecimal(score), count: formatInteger(reviewCount) });
  // Trustpilot shows stars in half steps.
  const shown = Math.round(score * 2) / 2;

  return (
    <div className={cn("flex justify-center", className)}>
      <a
        href={url}
        target="_blank"
        rel="noopener"
        className="group flex min-h-11 w-full flex-col items-center gap-1.5 rounded-[18px] bg-footer-card px-6 py-3.5 text-center md:w-auto transition-colors hover:bg-footer-card-hover focus-visible:bg-footer-card-hover md:flex-row md:flex-wrap md:justify-center md:gap-x-3.5 md:gap-y-1 md:rounded-full md:px-6 md:py-2.5 xl:px-fluid-24/28"
      >
        <span className="flex items-center gap-3">
          <span className="text-body-sm font-semibold text-on-footer decoration-1 underline-offset-[3px] group-hover:underline group-focus-visible:underline">
            {ui.trustpilotLabel}
          </span>
          <span aria-hidden="true" className="flex gap-0.5">
            {[0, 1, 2, 3, 4].map((i) => {
              const fill = Math.max(0, Math.min(1, shown - i)) * 100;
              return (
                <span
                  key={i}
                  className="flex size-5 items-center justify-center text-[14px] leading-none text-white xl:size-[clamp(20px,calc(12px+0.625vw),22px)] xl:text-[clamp(14px,calc(6px+0.625vw),16px)]"
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
        </span>
        {/* Balanced, so a narrow card (320px) never leaves "Trustpilot" alone on a third line. */}
        <span className="text-small text-balance text-footer-body">{summary}</span>
        <span className="sr-only">{` (${ui.opensInNewTab})`}</span>
      </a>
    </div>
  );
}
