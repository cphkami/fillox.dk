import Link from "next/link";
import type { CSSProperties } from "react";
import { ButtonLink, Container, Photo, ResponsiveText, ScrollRow, buttonClasses } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { ImageRef } from "@/content/types";
import { cn } from "@/lib/cn";
import type { TreatmentView } from "./treatmentView";

/**
 * Average glyph width of a title word in em, with a margin: Poppins 500 at the display / hero
 * tracking measures ≤ 0.552 ("Næsekorrektion"; "ansigtsbehandling" 0.540).
 */
const EM_PER_CHAR = 0.58;

const SOFT_HYPHEN = "­";

/** H1 size from 768px: the page H1, or the article H1 for a long "compact" one (detail.headingSize). */
const h1Size = {
  default: "md:text-[length:min(var(--text-h1),100cqi/var(--title-fit))]",
  compact: "md:text-[length:min(var(--text-h1-xs),100cqi/var(--title-fit))]",
};

/**
 * Breadcrumb links: ≥ 44px tap area without changing the line (inline padding: the vertical part
 * doesn't move the line, the horizontal part is cancelled by the negative margin). `relative`
 * lifts the link above the H1, whose text box (taller than its 1.02 line height) reaches up into
 * the padding and would otherwise take those taps.
 */
const crumbLink = "relative -mx-1 px-1 py-[13px] hover:text-accent md:py-3 md:hover:text-accent-deep";

/**
 * Photo slot height `sizes` assumes at 1024–1599px: min-h-fluid-640/720 reaches 720 at 1600, and at
 * 1024–1280 the narrower text column makes the panel about as tall (≈ 660–720px).
 */
const SLOT_MAX_H = 720;
/**
 * The same from 1600px, where the fluid type and stack gaps make most panels taller than the
 * 720 minimum (732px; Botox / Lip Filler 767, the longest 809). Asked only there, so the
 * 1024–1599 range keeps its smaller file.
 */
const SLOT_WIDE_H = 768;
/** Photo slot below 768px: (100vw − 40px) × 300px. */
const MOBILE_SLOT_H = 300;

/**
 * Photo `sizes`. The slot is ≈ square from 1024px (488–768px wide, 640–720 tall), so a
 * landscape photo (known `width`/`height`) is cropped from the sides and painted
 * slot-height × aspect wide (e.g. 2000 × 1228 → ≈ 1173px), wider than the slot. Its size
 * is that painted width, so it stays sharp on 1x screens. Other photos keep the slot width
 * (50/50 split of the panel: 768px on the 1600px canvas). The `image.zoom` scale is included.
 * 768–1023: the photo spans the panel (420px tall, wide enough for photos up to ≈ 1.7 : 1).
 * Below 768 the 300px-tall slot paints a landscape photo 300px × aspect wide (2000 × 1228 →
 * 489px) until the viewport is wide enough for the slot to be wider than that.
 */
function heroSizes(image: ImageRef): string {
  const zoom = Math.max(1, image.zoom ?? 1);
  const aspect = image.width && image.height ? image.width / image.height : 0;
  const box = zoom > 1 ? `calc((100vw - 40px) * ${zoom})` : "calc(100vw - 40px)";
  const coverFrom = Math.ceil(MOBILE_SLOT_H * aspect) + 40; // viewport from which the slot is the wider
  const coverPx = `${Math.ceil(MOBILE_SLOT_H * aspect * zoom)}px`;
  const mobile =
    coverFrom <= 320 ? box : coverFrom >= 768 ? coverPx : `(min-width: ${coverFrom}px) ${box}, ${coverPx}`;
  const below = `(min-width: 768px) ${zoom > 1 ? `${Math.ceil(100 * zoom)}vw` : "100vw"}, ${mobile}`;
  const painted = Math.ceil(SLOT_MAX_H * aspect * zoom);
  const paintedWide = Math.ceil(SLOT_WIDE_H * aspect * zoom);
  if (painted > 768 * zoom) return `(min-width: 1600px) ${paintedWide}px, (min-width: 1024px) ${painted}px, ${below}`;
  return `(min-width: 1600px) ${Math.ceil(768 * zoom)}px, (min-width: 1024px) ${Math.ceil(50 * zoom)}vw, ${below}`;
}

/**
 * Treatment hero (6c/6bx top, mb top).
 * Desktop ≥1024: sand panel, text left (breadcrumb, H1, lead, 4 fact cards, CTAs) and photo right;
 * from 1280 the panel follows the wide canvas (50/50 split, padding and min-height grow).
 * 768–1023: same panel, photo below the text. Mobile: no panel; the photo sits between
 * lead and fact cards (the text column dissolves with `display: contents`).
 * Long-form pages (no facts): more intro paragraphs after the lead (below the photo on mobile),
 * the CTAs only when the content sets them, and optional jump links to the page's sections
 * (white chips as on /behandlinger; a scroll row below 768px).
 */
export function TreatmentHero({ view }: { view: TreatmentView }) {
  const { hero } = view;
  const hasIntro = Boolean(hero.intro?.length);
  // The H1 keeps the design size (36px / 64px, growing to 76px on wide screens via --text-h1; a
  // "compact" H1 48 → 56px from 768 via --text-h1-xs) unless its longest word would not fit the
  // column ("Signatur ansigtsbehandling"); then it shrinks to fit (100cqi = column width). A word
  // with a soft hyphen counts as its parts, each with the hyphen the break adds
  // ("behandlings-" + "muligheder").
  const longestWord = Math.max(
    ...view.heading
      .split(/\s+/)
      .flatMap((word) => word.split(SOFT_HYPHEN).map((part, i, parts) => part.length + (i < parts.length - 1 ? 1 : 0))),
  );
  const titleFit = { "--title-fit": (longestWord * EM_PER_CHAR).toFixed(2) } as CSSProperties;
  return (
    <Container gutter="none" className="leading-[1.5] md:px-surface">
      <div className="flex flex-col gap-4 px-5 pt-5 pb-12 max-md:@container md:grid md:grid-cols-1 md:gap-0 md:overflow-hidden md:rounded-[24px] md:bg-sand md:p-0 lg:grid-cols-2">
        <div className="contents md:flex md:flex-col md:justify-center md:px-10 md:py-14 md:@container lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
          {/* Stack gaps (breadcrumb 18, H1 22, lead and facts 30) grow ×1.2 from 1280 with the type. */}
          <nav aria-label={copy.breadcrumbLabel} className="order-1 text-small text-muted md:mb-[18px] md:font-semibold md:text-accent xl:mb-fluid-18">
            <ol>
              <li className="inline">
                <Link href={view.overviewLink.href} className={crumbLink}>
                  {view.overviewLink.label}
                </Link>
              </li>
              {view.category ? (
                <li className="inline">
                  <span aria-hidden="true"> → </span>
                  <Link href={view.category.href} className={crumbLink}>
                    {view.category.name}
                  </Link>
                </li>
              ) : null}
              <li className="inline max-md:hidden">
                <span aria-hidden="true"> → </span>
                <span aria-current="page" className="text-ink">
                  {view.title}
                </span>
              </li>
            </ol>
          </nav>

          <h1
            style={titleFit}
            className={cn(
              "order-2 font-heading text-[length:min(36px,100cqi/var(--title-fit))] leading-[1.08] tracking-display text-heading [overflow-wrap:break-word] md:mb-[22px] md:leading-[1.02] md:tracking-hero xl:mb-fluid-22",
              h1Size[view.headingSize ?? "default"],
            )}
          >
            {view.heading}
            {view.headingAccent ? (
              // The H1's second part on a line of its own, smaller and in the accent words' colour
              // (as /priser's "Gennemsigtige / priser"), starting with the separator's dash; the
              // separator's leading space is collapsed at the line start, so the H1's text reads
              // "Title – accent" for screen readers and search engines.
              <span className="mt-2 block text-[22px] leading-[1.25] tracking-display text-pretty text-emphasis md:mt-3 md:text-h3-lg md:leading-[1.2] md:tracking-display">
                {copy.headingSeparator}
                {view.headingAccent}
              </span>
            ) : null}
          </h1>

          <p
            className={
              hasIntro
                ? "order-3 text-[16px] leading-[1.7] text-muted md:mb-4 md:max-w-[44ch] md:text-lead md:leading-[1.75] xl:mb-fluid-16"
                : "order-3 text-[16px] leading-[1.7] text-muted md:mb-[30px] md:max-w-[44ch] md:text-lead md:leading-[1.75] xl:mb-fluid-30"
            }
          >
            <ResponsiveText mobile={hero.mobileLead} desktop={hero.lead} />
          </p>

          {hasIntro ? (
            // Body size under the larger lead; 49ch at 16px ends where the lead's 44ch at 18px does.
            <div className="order-5 grid gap-3 text-[16px] leading-[1.7] text-pretty text-muted md:mb-[30px] md:max-w-[49ch] md:text-body md:leading-[1.75] md:last:mb-0 xl:mb-fluid-30">
              {hero.intro?.map((text) => <p key={text}>{text}</p>)}
            </div>
          ) : null}

          {hero.facts.length ? (
            <dl className="order-5 grid grid-cols-2 gap-2 md:mb-[30px] md:gap-2.5 xl:mb-fluid-30">
              {hero.facts.map((fact) => (
                <div key={fact.label} className="rounded-2xl bg-white px-4 py-3.5 md:p-[18px] xl:p-fluid-18">
                  {/* 12px (the design's 11, raised to the minimum); tracking 1px below 375px so
                      "KONSULTATION" fits a 320px screen's tile. */}
                  <dt className="text-[12px] tracking-[1.5px] text-muted uppercase max-[374px]:tracking-[1px] md:mb-1.5 md:text-micro md:font-bold md:tracking-[2px] md:text-accent">
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-[15px] font-semibold md:mt-0 md:font-heading md:text-lead md:tracking-display md:text-heading">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {hero.jump ? (
            <nav aria-label={hero.jump.label} className="order-6 md:mb-[30px] md:last:mb-0 xl:mb-fluid-30">
              {/* Below 768px a scroll row bleeding to the right edge, as the /behandlinger chips. */}
              <ScrollRow
                unstyled
                className="-my-1.5 -mr-5 -ml-1.5 flex snap-x scroll-pr-5 scroll-pl-1.5 gap-2 overflow-x-auto py-1.5 pr-5 pl-1.5 [scrollbar-width:none] md:m-0 md:flex-wrap md:overflow-visible md:p-0 [&::-webkit-scrollbar]:hidden"
              >
                {/* Plain in-page anchors (not next/link): the browser then moves the keyboard's
                    starting point to the section and updates :target (the card's outline). */}
                {hero.jump.links.map((link) => (
                  <li key={link.href} className="shrink-0 snap-start">
                    <a href={link.href} className={buttonClasses({ variant: "white", size: "chip" })}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ScrollRow>
            </nav>
          ) : null}

          {hero.primaryCta || hero.secondaryCta ? (
            <div className="order-6 flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center md:gap-[18px]">
              {hero.primaryCta ? (
                <ButtonLink href={hero.primaryCta.href} size="md" mobileSize="lg" fullWidth="mobile">
                  {hero.primaryCta.label}
                </ButtonLink>
              ) : null}
              {/* From md a text link with an invisible hit area (12px above and below, as ArrowLink). */}
              {hero.secondaryCta ? (
                <Link
                  href={hero.secondaryCta.href}
                  className="relative flex h-[52px] w-full items-center justify-center rounded-full border border-accent px-[26px] text-ui whitespace-nowrap text-accent transition-colors hover:bg-accent hover:text-on-accent focus-visible:bg-accent focus-visible:text-on-accent active:bg-accent active:text-on-accent md:h-auto md:w-auto md:rounded-none md:border-x-0 md:border-t-0 md:border-rule-strong md:px-0 md:pb-[3px] md:text-ink md:after:absolute md:after:-inset-x-1 md:after:-inset-y-3 md:hover:border-accent md:hover:bg-transparent md:hover:text-accent md:focus-visible:border-accent md:focus-visible:bg-transparent md:focus-visible:text-accent md:active:border-accent md:active:bg-transparent md:active:text-accent"
                >
                  {hero.secondaryCta.label}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>

        <Photo
          image={hero.image}
          sizes={heroSizes(hero.image)}
          priority
          className="order-4 h-[300px] shrink-0 rounded-[24px]! md:order-none md:h-[420px] md:rounded-none! lg:h-auto lg:min-h-fluid-640/720"
        />
      </div>
    </Container>
  );
}
