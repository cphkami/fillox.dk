import { site } from "@/config/site";
import { ui } from "@/content/ui";
import { ArrowLink } from "./ArrowLink";

type AllReviewsLinkProps = {
  /**
   * ArrowLink's tone: "accent" (default) on light surfaces, "band" on a rose band; extra classes
   * may switch it per breakpoint.
   */
  tone?: "accent" | "band";
  className?: string;
};

/** "Se alle anmeldelser på Trustpilot →" — the Trustpilot profile (site.trustpilot.url) in a new tab. */
export function AllReviewsLink({ tone = "accent", className }: AllReviewsLinkProps) {
  return (
    <ArrowLink href={site.trustpilot.url} target="_blank" rel="noopener" tone={tone} className={className}>
      {ui.seeAllReviews}
      <span className="sr-only">{` (${ui.opensInNewTab})`}</span>
    </ArrowLink>
  );
}
