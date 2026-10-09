import Link from "next/link";
import { ButtonLink, Container, Photo } from "@/components/ui";
import type { NewHerePage } from "@/content/pages/new-here";

/**
 * Hero of /ny-hos-fillox, built like the /behandlinger overview hero: a sand panel with the text
 * left and the photo right from 1024px (1.3 : 1); below 1024px no photo, and below 768px no
 * panel (text on the page base), so the H1, the intro and "Book konsultation" come first on a
 * phone. The draft's subtitle is a paragraph in the heading font under the H1.
 *
 * Photo `sizes`: the landscape photo (1600 × 1096) covers a slot taller than wide (424 × 652px at
 * 1024, 605 × 668 at 1440, 668 × 720 from 1600), so it paints at height × 1.46: 910–1052px wide
 * at every width from 1024px (measured).
 */
export function NewHereHero({ hero, titleId }: { hero: NewHerePage["hero"]; titleId: string }) {
  return (
    <Container as="section" gutter="none" aria-labelledby={titleId} className="leading-[1.5] md:px-surface">
      <div className="px-5 pt-6 pb-2 md:grid md:grid-cols-1 md:overflow-hidden md:rounded-[24px] md:bg-sand md:p-0 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col md:justify-center md:px-10 md:py-14 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
          <h1
            id={titleId}
            className="font-heading text-[36px] leading-[1.08] tracking-display text-heading md:text-h1 md:leading-[1.02] md:tracking-hero"
          >
            {hero.title}
          </h1>
          <p className="mt-3 font-heading text-[20px] leading-[1.3] text-balance tracking-display text-heading md:mt-5 md:max-w-[30ch] md:text-h3 xl:mt-fluid-20">
            {hero.subtitle}
          </p>
          <div className="mt-4 flex flex-col gap-3 text-[16px] leading-[1.7] text-pretty text-muted md:mt-6 md:max-w-[50ch] md:text-lead md:leading-[1.7] xl:mt-fluid-24">
            {hero.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-5 md:mt-[30px] md:flex-row md:items-center md:gap-7 xl:mt-fluid-30">
            <ButtonLink href={hero.primaryCta.href} size="md" mobileSize="lg" fullWidth="mobile">
              {hero.primaryCta.label}
            </ButtonLink>
            <Link
              href={hero.secondaryCta.href}
              className="relative self-center border-b border-rule-strong pb-[3px] text-ui-sm text-ink transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 hover:border-accent hover:text-accent md:self-auto"
            >
              {hero.secondaryCta.label} <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
        <Photo
          image={hero.image}
          sizes="(min-width: 1024px) 1060px, 1px"
          priority
          className="min-h-fluid-600/720 max-lg:hidden"
        />
      </div>
    </Container>
  );
}
