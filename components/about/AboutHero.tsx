import Link from "next/link";
import { ButtonLink, Container, Eyebrow, Photo } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import { Responsive } from "./Responsive";

type AboutHeroProps = { hero: AboutPageCopy["hero"]; titleId: string };

/**
 * Om os hero.
 * - Desktop (6om, ≥1024px): sand panel, text left and photo right, 50/50, min 600px high.
 * - Mobile (mo): rounded photo on top, text on cream below, full-width CTA.
 */
export function AboutHero({ hero, titleId }: AboutHeroProps) {
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId}>
      <div className="lg:grid lg:grid-cols-2 lg:overflow-hidden lg:rounded-[24px] lg:bg-sand">
        <Photo
          image={hero.image}
          sizes="(min-width: 1180px) 566px, (min-width: 1024px) 50vw, 100vw"
          priority
          radius="var(--hero-photo-radius)"
          className="mt-2 h-[280px] [--hero-photo-radius:24px] md:h-[440px] lg:order-last lg:mt-0 lg:h-auto lg:min-h-[600px] lg:[--hero-photo-radius:0px]"
        />
        <div className="flex flex-col px-2 pt-8 pb-10 md:px-4 md:pt-12 md:pb-14 lg:justify-center lg:px-14 lg:py-[72px]">
          <Eyebrow className="mb-4 lg:mb-[18px]">{hero.eyebrow}</Eyebrow>
          <h1
            id={titleId}
            className="mb-4 text-[36px] leading-[1.08] font-semibold tracking-display md:mb-[22px] md:text-[52px] md:leading-[1.04] lg:text-[64px] lg:leading-[1.02]"
          >
            {hero.title}
          </h1>
          <p className="mb-4 text-[16px] leading-[1.7] text-muted md:mb-[30px] md:max-w-[44ch] md:text-[18px] md:leading-[1.75]">
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
