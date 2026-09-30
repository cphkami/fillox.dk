import Link from "next/link";
import { ButtonLink, Container, Eyebrow, Photo } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import { Responsive } from "./Responsive";

type AboutHeroProps = { hero: AboutPageCopy["hero"]; titleId: string };

/**
 * Om os hero.
 * - Desktop (6om, ≥1024px): sand panel, text left and photo right, 50/50, min 600px high
 *   (grows to 680px on the 1600px canvas; the panel spans the surface band).
 * - Mobile (mo): rounded photo on top, text on cream below, full-width CTA.
 */
export function AboutHero({ hero, titleId }: AboutHeroProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId}>
      <div className="lg:grid lg:grid-cols-2 lg:overflow-hidden lg:rounded-[24px] lg:bg-sand">
        <Photo
          image={hero.image}
          // Desktop: the landscape photo (3:2) covers a taller half band, so it renders at
          // 1.5 × the panel height: 600px → 900px wide; on the 1600 canvas the text sets the
          // height (≈ 721px) → ≈ 1080px. The current file is only 800px wide (see the TODO in
          // content/pages/about.ts); these sizes are ready for a larger original.
          sizes="(min-width: 1600px) 1100px, (min-width: 1024px) 1020px, 100vw"
          priority
          radius="var(--hero-photo-radius)"
          className="mt-2 h-[280px] [--hero-photo-radius:24px] md:h-[440px] lg:order-last lg:mt-0 lg:h-auto lg:min-h-fluid-600/680 lg:[--hero-photo-radius:0px]"
        />
        <div className="flex flex-col px-2 pt-8 pb-10 md:px-4 md:pt-12 md:pb-14 lg:justify-center lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
          <Eyebrow className="mb-4 lg:mb-[18px]">{hero.eyebrow}</Eyebrow>
          <h1
            id={titleId}
            className="mb-4 text-[36px] leading-[1.08] font-semibold tracking-display md:mb-[22px] md:text-[52px] md:leading-[1.04] lg:text-h1 lg:leading-[1.02]"
          >
            {hero.title}
          </h1>
          <p className="mb-4 text-[16px] leading-[1.7] text-muted md:mb-[30px] md:max-w-[44ch] md:text-[18px] md:leading-[1.75] xl:text-lead">
            <Responsive mobile={hero.introShort} desktop={hero.intro} />
          </p>
          <div className="flex items-center gap-[18px]">
            <ButtonLink href={hero.primaryCta.href} size="md" mobileSize="lg" fullWidth="mobile">
              {hero.primaryCta.label}
            </ButtonLink>
            <Link
              href={hero.teamLink.href}
              className="border-b border-ink pb-[3px] text-[14px] text-ink transition-colors hover:border-plum hover:text-plum max-md:hidden"
            >
              {hero.teamLink.label} <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
