import { buttonClasses, type ButtonStyleProps } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * The men's page's dark surface: espresso (the `heading` colour, #3B2A28) as a fill, with offwhite
 * text (13.0:1). Used for the hero, the closing booking band and the teaser on /behandlinger;
 * the page has no rosa bands.
 *
 * Text on espresso:
 * - `text-cream` headings and names (offwhite, 13.0:1);
 * - `text-cream/80` running text (8.9:1), `text-cream/75` small text (8.0:1);
 * - `text-rule` Sandbeige (#CDBEA7) for the H1's second line, eyebrows and numbers (7.4:1, AA as
 *   body text too; on light surfaces Sandbeige is decorative only);
 * - `border-cream/15` hairlines (decorative), `border-rule` for the one Sandbeige rule.
 * The accent (plum) is only 1.5:1 on espresso, so the site-wide accent focus ring turns
 * offwhite inside the surface (13.0:1), and buttons are offwhite pills with accent text
 * (`kremButton`).
 */
export const espresso = "bg-heading text-cream [&_:focus-visible]:outline-cream";

/**
 * An offwhite ("krem") pill on espresso: the site's pill sizes (Button.tsx) with an offwhite fill
 * and accent text (8.8:1), sand on hover, keyboard focus and press (as the primary pill darkens;
 * accent-deep on sand 10.1:1). Not white: offwhite → white is ΔE 2, an invisible state change.
 * The `!` overrides the primary colours and their states (no class merging in `cn`).
 */
export function kremButton(props: Omit<ButtonStyleProps, "variant"> = {}): string {
  return cn(
    buttonClasses({ variant: "primary", ...props }),
    // outline-cream at rest too: the pill's transition-colors would otherwise fade the ring in
    // from its accent text colour (currentColor) on focus.
    "bg-cream! text-accent! outline-cream hover:bg-sand! hover:text-accent-deep! focus-visible:bg-sand! active:bg-sand!",
  );
}

/**
 * Secondary text link on espresso: offwhite text over a Sandbeige underline (the `textLink` button on
 * light surfaces), with an invisible 44px hit area (12px above and below, as ArrowLink).
 */
export const espressoTextLink =
  "relative inline-block border-b border-rule pb-[3px] text-ui text-cream transition-colors hover:border-cream after:absolute after:-inset-x-1 after:-inset-y-3";
