import Link from "next/link";
import type { CSSProperties } from "react";
import { ButtonLink, Container, Photo, ResponsiveText } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { ImageRef } from "@/content/types";
import type { TreatmentView } from "./treatmentView";

/** Average glyph width of a title word in em (Poppins 600, display tracking), with a margin. */
const EM_PER_CHAR = 0.58;

/**
 * Breadcrumb links: ≥ 44px tap area without changing the line (inline padding: the vertical part
 * doesn't move the line, the horizontal part is cancelled by the negative margin). `relative`
 * lifts the link above the H1, whose text box (taller than its 1.02 line height) reaches up into
 * the padding and would otherwise take those taps.
 */
const crumbLink = "relative -mx-1 px-1 py-[13px] hover:text-plum md:py-3 md:hover:text-plum-deep";

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
 */
export function TreatmentHero({ view }: { view: TreatmentView }) {
  const { hero } = view;
  // The H1 keeps the design size (36px / 64px, growing to 76px on wide screens via --text-h1)
  // unless its longest word would not fit the column ("Signatur ansigtsbehandling"); then it
  // shrinks to fit (100cqi = column width).
  const longestWord = Math.max(...view.title.split(/\s+/).map((w) => w.length));
  const titleFit = { "--title-fit": (longestWord * EM_PER_CHAR).toFixed(2) } as CSSProperties;
  return (
    <Container gutter="none" className="md:px-surface">
      <div className="flex flex-col gap-4 px-5 pt-5 pb-12 max-md:@container md:grid md:grid-cols-1 md:gap-0 md:overflow-hidden md:rounded-[24px] md:bg-sand md:p-0 lg:grid-cols-2">
        <div className="contents md:flex md:flex-col md:justify-center md:px-10 md:py-14 md:@container lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
          {/* Stack gaps (breadcrumb 18, H1 22, lead and facts 30) grow ×1.2 from 1280 with the type. */}
          <nav aria-label={copy.breadcrumbLabel} className="order-1 text-small text-muted md:mb-[18px] md:font-semibold md:text-plum xl:mb-fluid-18">
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
            className="order-2 text-[length:min(36px,100cqi/var(--title-fit))] leading-[1.08] font-semibold tracking-display [overflow-wrap:break-word] md:mb-[22px] md:text-[length:min(var(--text-h1),100cqi/var(--title-fit))] md:leading-[1.02] xl:mb-fluid-22"
          >
            {view.title}
          </h1>

          <p className="order-3 text-[16px] leading-[1.7] text-muted md:mb-[30px] md:max-w-[44ch] md:text-lead md:leading-[1.75] xl:mb-fluid-30">
            <ResponsiveText mobile={hero.mobileLead} desktop={hero.lead} />
          </p>

          <dl className="order-5 grid grid-cols-2 gap-2 md:mb-[30px] md:gap-2.5 xl:mb-fluid-30">
            {hero.facts.map((fact) => (
              <div key={fact.label} className="rounded-2xl bg-white px-4 py-3.5 md:p-[18px] xl:p-fluid-18">
                {/* 12px (the design's 11, raised to the minimum); tracking 1px below 375px so
                    "KONSULTATION" fits a 320px screen's tile. */}
                <dt className="text-[12px] tracking-[1.5px] text-muted uppercase max-[374px]:tracking-[1px] md:mb-1.5 md:text-micro md:font-bold md:tracking-[2px] md:text-plum">
                  {fact.label}
                </dt>
                <dd className="mt-0.5 text-[15px] font-semibold md:mt-0 md:text-lead md:tracking-display">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="order-6 flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center md:gap-[18px]">
            <ButtonLink href={hero.primaryCta.href} size="md" mobileSize="lg" fullWidth="mobile">
              {hero.primaryCta.label}
            </ButtonLink>
            {/* From md a text link with an invisible hit area (12px above and below, as ArrowLink). */}
            <Link
              href={hero.secondaryCta.href}
              className="relative flex h-[52px] w-full items-center justify-center rounded-full border border-plum px-[26px] text-ui whitespace-nowrap text-plum transition-colors hover:bg-plum hover:text-cream md:h-auto md:w-auto md:rounded-none md:border-x-0 md:border-t-0 md:border-ink md:px-0 md:pb-[3px] md:text-ink md:after:absolute md:after:-inset-x-1 md:after:-inset-y-3 md:hover:bg-transparent md:hover:text-plum"
            >
              {hero.secondaryCta.label}
            </Link>
          </div>
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
