import Link from "next/link";
import type { CSSProperties } from "react";
import { ButtonLink, Container, Eyebrow, Photo } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";

type AboutHeroProps = { hero: AboutPageCopy["hero"]; titleId: string };

/**
 * Om os hero.
 * - Desktop (6om, ≥1024px): sand panel, text left and photo right, min 600px high (680px on the
 *   1600px canvas; the panel spans the surface band). The owner's intro (October 2026) is three
 *   paragraphs, so the text column is the wider one (1.3 : 1; 1.15 : 1 from 1280, where the H1
 *   has room) and the H1 one step smaller than
 *   6om's 64px: "Ekspertbehandling" is one long word (≈ 9.05em of Poppins 500), which must fit
 *   the column on one line: 48px at 1024–1279 (`text-h1-xs`: 434px in a 440px column at 1024),
 *   52 → 60px from 1280 (`text-h1-sm`).
 * - Photo crop: `image.position` (centred) below 1024px, where the wide cell shows the whole
 *   logo; `imagePositionDesktop` from 1024px, where the cell is a narrow portrait slice.
 * - Mobile (mo): rounded photo on top, text on cream below, full-width CTA. The H1 is 36px from
 *   396px and 9.1vw below (30px at 320), so the word fits the 280–350px column.
 * - Text: the eyebrow is the source's page title, the H1 its bold opening line, then the first
 *   paragraph as the lead (`text-lead`, ink, 42ch ≈ 60 characters) and the other two as body
 *   text (`text-body`, muted, 48ch ≈ 68 characters).
 * - Type: the H1 is the heading font (Poppins 500, espresso `text-heading`; -0.025em from 768px
 *   like the home H1); the rest is Figtree. "Mød vores team ↓" (the source's "[Mød vores team]")
 *   is the site's text link: ink over a plum underline, accent on hover. Beside the
 *   button from 768px (6om); below 768px centred under the full-width button (mo has no such
 *   link, but the owner's text puts the team after five long sections, so phones get the jump
 *   too). Its 12px `after:` hit area keeps it ≥ 44px high without touching the button.
 */
export function AboutHero({ hero, titleId }: AboutHeroProps) {
  // The desktop crop (content: `hero.imagePositionDesktop`) as a variable on the panel; from
  // 1024px the <img> uses it over Photo's inline `image.position` (`!` beats the inline style).
  const photoVars = { "--about-hero-photo-lg": hero.imagePositionDesktop } as CSSProperties;
  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId}>
      <div
        style={photoVars}
        className="lg:grid lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:overflow-hidden lg:rounded-[24px] lg:bg-sand"
      >
        <Photo
          image={hero.image}
          imgClassName="lg:object-(--about-hero-photo-lg)!"
          // Desktop: the landscape photo (3:2) covers the photo column at the panel's height
          // (≈ 760–850px with this text), so it is drawn ≈ 1.5 × that wide: ≈ 1140px from 1024,
          // ≈ 1280px on the 1600 canvas. Mobile: 280px high → ≈ 420px wide (the full band from
          // 768). The current file is only 800px wide (see the TODO in content/pages/about.ts);
          // these sizes are ready for a larger original.
          sizes="(min-width: 1600px) 1280px, (min-width: 1024px) 1140px, (min-width: 768px) 100vw, 420px"
          priority
          radius="var(--hero-photo-radius)"
          className="mt-2 h-[280px] [--hero-photo-radius:24px] md:h-[440px] lg:order-last lg:mt-0 lg:h-auto lg:min-h-fluid-600/680 lg:[--hero-photo-radius:0px]"
        />
        <div className="flex flex-col px-2 pt-8 pb-10 md:px-4 md:pt-12 md:pb-14 lg:justify-center lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
          <Eyebrow className="mb-4 lg:mb-[18px]">{hero.eyebrow}</Eyebrow>
          <h1
            id={titleId}
            className="mb-5 font-heading text-[clamp(30px,9.1vw,36px)] leading-[1.08] tracking-display text-balance text-heading md:mb-[26px] md:text-[52px] md:leading-[1.04] md:tracking-hero lg:text-h1-xs xl:text-h1-sm"
          >
            {hero.title}
          </h1>
          <p className="text-lead leading-[1.6] text-pretty text-ink md:max-w-[42ch]">{hero.lead}</p>
          <div className="mt-4 grid gap-3.5 text-body leading-[1.7] text-pretty text-muted md:mt-5 md:max-w-[48ch] md:leading-[1.75]">
            {hero.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
          <div className="mt-7 flex flex-col items-stretch gap-[18px] md:mt-[34px] md:flex-row md:items-center">
            <ButtonLink href={hero.primaryCta.href} size="md" mobileSize="lg" fullWidth="mobile">
              {hero.primaryCta.label}
            </ButtonLink>
            <Link
              href={hero.teamLink.href}
              className="relative self-center border-b border-rule-strong pb-[3px] text-ui-sm whitespace-nowrap text-ink transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 hover:border-accent hover:text-accent max-md:mt-1"
            >
              {hero.teamLink.label} <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
