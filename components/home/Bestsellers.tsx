import Link from "next/link";
import { ButtonLink, Container, ResponsiveText, SectionHeading } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import type { Bestseller } from "@/content/types";
import { cn } from "@/lib/cn";
import { formatPriceFrom } from "@/lib/content";
import { ArrowCircle } from "./ArrowCircle";

/** Colour change shared by the row's texts and arrow when the row is hovered, focused or pressed. */
const fade = "transition-colors duration-200 ease-out";
/** Ink on the powder row (desktop and tablet-landscape panel). */
const inkOnActive = "lg:group-hover:text-ink lg:group-focus-visible:text-ink lg:group-active:text-ink";

/**
 * The 1px line between desktop rows, inset by the row's bleed so it spans the text columns
 * only. It fades out under the active row and above it (that line belongs to the row before).
 */
const divider = cn(
  "lg:after:absolute lg:after:inset-x-7 lg:after:bottom-0 lg:after:h-px lg:after:bg-[rgba(243,237,228,.16)] xl:after:inset-x-9 2xl:after:inset-x-13",
  "lg:after:transition-opacity lg:after:duration-200 lg:after:ease-out",
  "lg:hover:after:opacity-0 lg:focus-visible:after:opacity-0 lg:active:after:opacity-0",
  "lg:[@media(hover:hover)]:[li:has(+li>a:hover)>&]:after:opacity-0",
  "lg:[li:has(+li>a:is(:focus-visible,:active))>&]:after:opacity-0",
);

/**
 * "Vores bestsellers". Desktop (6a): numbered rows on a plum panel. Mobile (mf): white cards
 * with a round arrow.
 *
 * 6a draws the Skinbooster row on powder with a filled plum arrow: that is the row's hover
 * state, not a permanent highlight. From lg every row rests on plum (cream name, blush text,
 * powder number and price, outlined arrow) and turns powder on hover, keyboard focus and
 * press (ink text, muted description, plum arrow), fading over 200ms. Tailwind's `hover:`
 * only applies on devices that can hover, so touch screens only show the press.
 */
export function Bestsellers({ copy, items }: { copy: HomePage["bestsellers"]; items: Bestseller[] }) {
  return (
    <Container as="section" aria-labelledby="home-bestsellers-title" className="py-14 md:pt-20 lg:pt-fluid-96 lg:pb-fluid-84">
      <SectionHeading
        id="home-bestsellers-title"
        title={copy.title}
        intro={<ResponsiveText mobile={copy.introShort} desktop={copy.intro} />}
        introClassName="max-md:mt-3 max-md:leading-[1.7]"
        className="mb-4 md:mb-10 lg:mb-fluid-50"
      />

      {/* 1024–1279 (design): every row is its own grid, 56px 1.1fr 1.4fr auto 48px.
          From xl the rows share one grid (subgrid through <li> and <a>), so name,
          description and price start on the same edge in every row, and the columns are
          rebalanced (0.65fr / 1.85fr) so the description gets the extra width instead of
          the short treatment names (the longest description stays on one line from 1280).
          Every row reaches into the panel padding (56 / 64 / 80px) and pads back by the same
          amount, so its hover fill keeps the design's 28px inset while the text stays on the
          panel's content edge. The divider is an ::after line inset by that bleed (the row
          height never changes on hover); it hides under and above the active row.
          The panel's 28px vertical padding gives the first and last row's fill the same 28px
          inset as the sides. 6a draws 20px, plus the hovered row's 6px margins and 1px row
          borders, which the hover state leaves out: the panel is 579px tall in 6a at 1180,
          566px with 20px padding and 582px with 28px. */}
      <ul className="flex flex-col gap-2.5 lg:gap-0 lg:rounded-[24px] lg:bg-plum lg:px-14 lg:py-7 xl:grid xl:grid-cols-[56px_minmax(0,0.65fr)_minmax(0,1.85fr)_auto_48px] xl:gap-x-6 xl:px-16 2xl:px-20">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.number} className="xl:col-span-full xl:grid xl:grid-cols-subgrid">
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3.5 rounded-[20px] bg-white py-[18px] pr-[18px] pl-5",
                  "lg:grid lg:grid-cols-[56px_1.1fr_1.4fr_auto_48px] lg:gap-6 lg:py-fluid-28",
                  "xl:col-span-full xl:grid-cols-subgrid",
                  "lg:-mx-7 lg:bg-transparent lg:px-7 xl:-mx-9 xl:px-9 2xl:-mx-13 2xl:px-13",
                  "lg:focus-visible:outline-powder",
                  fade,
                  "lg:hover:bg-powder lg:focus-visible:bg-powder lg:active:bg-powder",
                  !last && divider,
                )}
              >
                <span
                  className={cn(
                    "w-[22px] shrink-0 text-[13px] font-semibold text-plum",
                    "lg:w-auto lg:text-small lg:font-normal lg:tracking-[2px] lg:text-powder",
                    fade,
                    inkOnActive,
                  )}
                >
                  {item.number}
                </span>
                <div className="min-w-0 flex-1 lg:contents">
                  <h3 className={cn("text-[18px] font-semibold text-ink lg:text-h3 lg:tracking-display lg:text-cream", fade, inkOnActive)}>
                    {item.name}
                  </h3>
                  <p
                    className={cn(
                      "text-[13px] leading-[1.5] text-muted lg:text-body lg:leading-[normal] lg:text-blush",
                      fade,
                      "lg:group-hover:text-muted lg:group-focus-visible:text-muted lg:group-active:text-muted",
                    )}
                  >
                    <ResponsiveText mobile={item.mobileDescription} desktop={item.description} />
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 text-[14px] font-semibold text-plum",
                      "lg:mt-0 lg:text-small lg:font-normal lg:tracking-[1px] lg:text-powder lg:uppercase",
                      fade,
                      inkOnActive,
                    )}
                  >
                    {formatPriceFrom(item.priceFrom)}
                  </p>
                </div>
                <ArrowCircle
                  className={cn(
                    "bg-sand text-plum ease-out group-hover:bg-powder",
                    // 46px circle, 16px glyph up to 1280; then 52px / 18px at 1600 with the rows.
                    "lg:size-[46px] xl:size-[clamp(46px,calc(22px+1.875vw),52px)] xl:text-body",
                    "lg:border lg:border-[rgba(243,237,228,.45)] lg:bg-transparent lg:text-cream",
                    "lg:group-hover:border-plum lg:group-hover:bg-plum",
                    "lg:group-focus-visible:border-plum lg:group-focus-visible:bg-plum",
                    "lg:group-active:border-plum lg:group-active:bg-plum",
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex justify-center lg:mt-8">
        <ButtonLink
          href={copy.cta.href}
          variant="outline"
          size="lg"
          fullWidth="mobile"
          className="md:px-9 lg:h-auto lg:border-ink lg:py-3.5 lg:text-ink lg:hover:bg-ink lg:hover:text-cream xl:px-fluid-36/40 xl:py-fluid-14/15"
        >
          <span>
            {copy.cta.label}
            <span aria-hidden="true" className="max-lg:hidden">
              {" →"}
            </span>
          </span>
        </ButtonLink>
      </div>
    </Container>
  );
}
