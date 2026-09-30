import { Fragment } from "react";
import { ButtonLink, Container, Eyebrow, Photo, TrustpilotRating } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import { cn } from "@/lib/cn";
import { ResponsiveText } from "./ResponsiveText";

/**
 * Front page hero (6a / mf): sand panel with eyebrow, H1, lead, CTAs, Trustpilot and
 * stats; photo on the right (desktop) or on top (mobile).
 */
export function Hero({ hero }: { hero: HomePage["hero"] }) {
  return (
    <Container as="section" gutter="surface" aria-labelledby="home-hero-title">
      <div className="grid overflow-hidden rounded-[24px] bg-sand lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
        <div className="flex flex-col justify-center gap-4 px-[22px] pt-7 pb-[30px] md:gap-0 md:px-10 md:pt-12 md:pb-14 lg:pt-[120px] lg:pr-8 lg:pb-[72px] lg:pl-14 xl:pl-[72px]">
          <Eyebrow tone="muted" className="md:mb-[22px] md:text-[14px] md:font-semibold md:tracking-[.2em]">
            {hero.eyebrow}
          </Eyebrow>

          <h1
            id="home-hero-title"
            className="text-[36px] leading-[1.08] font-semibold tracking-display md:mb-[30px] md:text-[56px] md:leading-[1.02] md:tracking-hero lg:text-[64px]"
          >
            <span className="md:whitespace-nowrap">{hero.title}</span>{" "}
            <span className="text-plum lg:block">
              {hero.titleAccent.map((word, i) => (
                <Fragment key={word}>
                  {i > 0 ? " " : null}
                  <span className="lg:block">{word}</span>
                </Fragment>
              ))}
            </span>
          </h1>

          <p className="text-[16px] leading-[1.7] text-muted md:mb-[34px] md:max-w-[40ch] md:text-[18px] md:leading-[1.75]">
            <ResponsiveText short={hero.leadShort} long={hero.lead} />
          </p>

          <div className="flex items-center gap-4 md:mb-[22px] md:gap-[18px]">
            <ButtonLink href={hero.primaryCta.href} size="md" mobileSize="lg">
              {hero.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="textLink"
              className="max-md:h-11 max-md:border-0 max-md:pb-0 max-md:text-[15px] max-md:font-semibold max-md:text-plum max-md:hover:text-plum-deep"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>

          {/* cn() does not merge Tailwind classes, so the 13px override needs a variant to beat the base 14px. */}
          <TrustpilotRating size="sm" className="max-md:text-[13px] md:hidden" />
          <TrustpilotRating size="md" className="mb-11 max-md:hidden" />

          <dl className="grid grid-cols-[repeat(3,minmax(max-content,1fr))] gap-2 border-t border-rule pt-3 md:flex md:gap-7 md:border-0 md:pt-0">
            {hero.stats.map((stat, i) => (
              <div key={stat.label} className={cn("flex flex-col", i > 0 && "md:border-l md:border-rule md:pl-7")}>
                <dt className="order-2 mt-0.5 text-[11px] tracking-[1.5px] text-muted uppercase max-[374px]:tracking-[.5px] md:mt-1 md:text-[12px] md:tracking-[2px]">
                  {stat.label}
                </dt>
                <dd className="order-1 text-[21px] font-semibold tracking-display text-plum md:text-[26px]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* From lg the portrait photo is cover-cropped into a ~534 × 791 box, so it renders
            at box height × aspect ratio (~634px), wider than the box. */}
        <Photo
          image={hero.image}
          sizes="(min-width: 1024px) 640px, 100vw"
          priority
          className="order-first h-[380px] md:h-[520px] lg:order-none lg:h-auto lg:min-h-[720px]"
        />
      </div>
    </Container>
  );
}
