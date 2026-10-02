import Link from "next/link";
import { Container } from "@/components/ui";
import type { MenPage } from "@/content/pages/men";
import { cn } from "@/lib/cn";
import { espresso, espressoTextLink, kremButton } from "./surface";

/**
 * Breadcrumb links: ≥ 44px tap area without moving the line (as TreatmentHero): vertical
 * padding, horizontal padding cancelled by the negative margin; `relative` lifts the link above
 * the H1's text box.
 */
const crumbLink = "relative -mx-1 px-1 py-[13px] underline-offset-4 hover:text-cream hover:underline md:py-3";

/**
 * Hero of /behandlinger/for-maend: an espresso band on the surface margin (rounded like every
 * hero panel; straight hairlines inside). Breadcrumb on top, then the two-line H1 (second line
 * bronze) with the lead and buttons beside it from 1024px, bottom-aligned with the H1, and the
 * three facts as a row of columns under a bronze rule (divided by hairlines). Below 1024px
 * everything stacks and the facts are a list. No photo: the page is typographic on purpose
 * (restrained imagery; the practitioners' photos come further down), and the layout leaves no
 * empty quadrant to fill.
 */
export function MenHero({ copy }: { copy: Pick<MenPage, "hero" | "breadcrumb" | "breadcrumbLabel"> }) {
  const { hero, breadcrumb } = copy;
  const parents = breadcrumb.slice(0, -1);
  const current = breadcrumb.at(-1);
  return (
    <Container gutter="surface" className="leading-[1.5]">
      <div
        className={cn(
          espresso,
          "rounded-[24px] px-5 pt-6 pb-8 md:px-10 md:pt-10 md:pb-12 lg:px-14 lg:pt-fluid-56 lg:pb-fluid-64 xl:px-16 2xl:px-20",
        )}
      >
        <nav aria-label={copy.breadcrumbLabel} className="text-small text-cream/75">
          <ol>
            {parents.map((crumb) => (
              <li key={crumb.href} className="inline">
                <Link href={crumb.href} className={crumbLink}>
                  {crumb.label}
                </Link>
                <span aria-hidden="true"> → </span>
              </li>
            ))}
            {current ? (
              <li className="inline">
                <span aria-current="page" className="text-cream">
                  {current.label}
                </span>
              </li>
            ) : null}
          </ol>
        </nav>

        <div className="lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-end lg:gap-fluid-64">
          <h1 className="mt-10 font-heading text-[36px] leading-[1.08] tracking-display text-cream md:mt-16 md:text-[56px] md:leading-[1.04] md:tracking-hero lg:mt-fluid-64 lg:text-h1 lg:leading-[1.02]">
            <span className="block text-balance">{hero.title}</span>
            <span className="block text-balance text-rule">{hero.titleAccent}</span>
          </h1>

          <div>
            <p className="mt-5 text-[16px] leading-[1.7] text-cream/80 md:mt-6 md:max-w-[46ch] md:text-lead md:leading-[1.75] lg:mt-0">
              {hero.lead}
            </p>
            <div className="mt-7 flex flex-col gap-4 md:mt-9 md:flex-row md:flex-wrap md:items-center md:gap-x-7 md:gap-y-5 xl:mt-fluid-32">
              <Link
                href={hero.primaryCta.href}
                className={kremButton({ size: "md", mobileSize: "lg", fullWidth: "mobile" })}
              >
                {hero.primaryCta.label}
              </Link>
              <Link href={hero.secondaryCta.href} className={cn(espressoTextLink, "self-center md:self-auto")}>
                {hero.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 lg:mt-fluid-64">
          <p
            className="border-b border-rule pb-3 text-micro font-bold tracking-[2px] text-rule uppercase"
            id="men-hero-facts"
          >
            {hero.factsLabel}
          </p>
          <ul aria-labelledby="men-hero-facts" className="lg:grid lg:grid-cols-3">
            {hero.facts.map((fact) => (
              <li
                key={fact.title}
                className="border-b border-cream/15 py-4 last:border-b-0 last:pb-0 md:py-5 md:last:pb-0 lg:border-b-0 lg:border-l lg:px-fluid-24 lg:pt-fluid-20 lg:pb-0 lg:first:border-l-0 lg:first:pl-0! lg:last:pr-0!"
              >
                <p className="font-heading text-[18px] tracking-display text-cream md:text-h4">{fact.title}</p>
                <p className="mt-1 text-small text-cream/75 md:text-body-sm">{fact.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
