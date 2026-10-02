import { buttonClasses, type ButtonStyleProps } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * The men's page's dark surface: espresso (the `heading` colour, #3B2A28) as a fill, with krem
 * text (12.2:1). Used for the hero, the closing booking band and the teaser on /behandlinger;
 * the page has no rose bands.
 *
 * Text on espresso:
 * - `text-cream` headings and names (12.2:1);
 * - `text-cream/80` running text (8.4:1), `text-cream/75` small text (7.6:1);
 * - `text-rule` bronze (#BAA586) for the H1's second line, eyebrows and numbers (5.7:1, AA as
 *   body text too; on light surfaces bronze is decorative only);
 * - `border-cream/15` hairlines (decorative), `border-rule` for the one bronze rule.
 * The accent (plum-brown) is only 1.2:1 on espresso, so the site-wide accent focus ring turns
 * krem inside the surface, and buttons are krem pills with accent text (`kremButton`).
 */
export const espresso = "bg-heading text-cream [&_:focus-visible]:outline-cream";

/**
 * A krem pill on espresso: the site's pill sizes (Button.tsx) with a krem fill and accent text
 * (10:1), white on hover, keyboard focus and press (as the primary pill darkens). The `!`
 * overrides the primary colours and their states (no class merging in `cn`).
 */
export function kremButton(props: Omit<ButtonStyleProps, "variant"> = {}): string {
  return cn(
    buttonClasses({ variant: "primary", ...props }),
    // outline-cream at rest too: the pill's transition-colors would otherwise fade the ring in
    // from its accent text colour (currentColor) on focus.
    "bg-cream! text-accent! outline-cream hover:bg-white! hover:text-accent-deep! focus-visible:bg-white! active:bg-white!",
  );
}

/**
 * Secondary text link on espresso: krem text over a bronze underline (the `textLink` button on
 * light surfaces), with an invisible 44px hit area (12px above and below, as ArrowLink).
 */
export const espressoTextLink =
  "relative inline-block border-b border-rule pb-[3px] text-ui text-cream transition-colors hover:border-cream after:absolute after:-inset-x-1 after:-inset-y-3";
