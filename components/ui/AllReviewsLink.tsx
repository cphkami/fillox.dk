import { site } from "@/config/site";
import { ui } from "@/content/ui";
import { ArrowLink } from "./ArrowLink";

type AllReviewsLinkProps = {
  /** "plum" on light surfaces, "powder" on plum; extra classes may switch it per breakpoint. */
  tone?: "plum" | "powder";
  className?: string;
};

/** "Se alle anmeldelser på Trustpilot →" — the Trustpilot profile (site.trustpilot.url) in a new tab. */
export function AllReviewsLink({ tone = "plum", className }: AllReviewsLinkProps) {
  return (
    <ArrowLink href={site.trustpilot.url} target="_blank" rel="noopener" tone={tone} className={className}>
      {ui.seeAllReviews}
      <span className="sr-only">{` (${ui.opensInNewTab})`}</span>
    </ArrowLink>
  );
}
