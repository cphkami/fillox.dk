import Link from "next/link";
import { ButtonLink, Container, Eyebrow, Photo, ResponsiveText } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { ImageRef } from "@/content/types";
import type { TreatmentView } from "./treatmentView";

/** Photo slot height at 768–1023px and below 768px (h-[440px] / h-[400px]). */
const SLOT_H_MD = 440;
const SLOT_H_MOBILE = 400;

/**
 * Photo `sizes`: the slot is 574px wide on the 1600px canvas (1 : 1.4 split of the 1440px
 * content width), ~36vw from 1024px. A design crop's zoom (`image.zoom`, which paints the
 * photo that much wider) is included so the photo stays sharp.
 * Below 1024 the slot is (100vw − 120px) / 2.4 × 440px (768–1023) and (100vw − 40px) × 400px:
 * a photo wider than the slot's shape (known `width`/`height`) is painted slot-height × aspect
 * wide (object-cover), until the viewport is wide enough for the slot to be the wider.
 */
function photoSizes(image: ImageRef): string {
  const z = Math.max(1, image.zoom ?? 1);
  const aspect = image.width && image.height ? image.width / image.height : 0;

  const mdBox = `calc((100vw - 120px) * ${(z / 2.4).toFixed(4)})`;
  const mdCover = `${Math.ceil(SLOT_H_MD * aspect * z)}px`;
  const mdFrom = Math.ceil(SLOT_H_MD * aspect * 2.4) + 120;
  const md =
    mdFrom <= 768
      ? [`(min-width: 768px) ${mdBox}`]
      : mdFrom >= 1024
        ? [`(min-width: 768px) ${mdCover}`]
        : [`(min-width: ${mdFrom}px) ${mdBox}`, `(min-width: 768px) ${mdCover}`];

  const mobileBox = z > 1 ? `calc((100vw - 40px) * ${z})` : "calc(100vw - 40px)";
  const mobileCover = `${Math.ceil(SLOT_H_MOBILE * aspect * z)}px`;
  const mobileFrom = Math.ceil(SLOT_H_MOBILE * aspect) + 40;
  const mobile =
    mobileFrom <= 320
      ? [mobileBox]
      : mobileFrom >= 768
        ? [mobileCover]
        : [`(min-width: ${mobileFrom}px) ${mobileBox}`, mobileCover];

  return [`(min-width: 1600px) ${Math.ceil(574 * z)}px`, `(min-width: 1024px) ${Math.ceil(36 * z)}vw`, ...md, ...mobile].join(
    ", ",
  );
}

/**
 * "Din behandler" (6c/6bx: photo left, heading + text + quote + "Mød hele teamet →";
 * mb: photo, name in plum, title, short text and a full-width "Book hos …" button).
 * Wide screens: the 1 : 1.4 split fills the canvas and the photo grows 520 → 640px tall
 * (≈ the design's 418 × 520 portrait proportion at every width).
 */
export function PractitionerSection({ practitioner: p }: { practitioner: NonNullable<TreatmentView["practitioner"]> }) {
  return (
    <Container
      as="section"
      aria-labelledby={copy.sectionIds.practitioner}
      className="flex flex-col gap-4 pt-2 pb-14 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-center md:gap-10 md:pt-0 md:pb-fluid-84 lg:gap-fluid-64"
    >
      <Photo
        image={p.image}
        sizes={photoSizes(p.image)}
        radius={24}
        className="h-[400px] shrink-0 md:h-[440px] lg:h-fluid-520/640"
      />
      <div className="flex flex-col gap-4 md:block">
        <Eyebrow className="md:mb-[18px]">{copy.practitioner.eyebrow}</Eyebrow>
        <h2
          id={copy.sectionIds.practitioner}
          className="text-[28px] font-semibold tracking-display text-plum md:mb-4 md:text-[32px] md:leading-[1.1] md:text-ink lg:text-[40px] xl:text-h2"
        >
          <ResponsiveText mobile={p.member.name} desktop={p.heading} />
        </h2>
        {p.mobileTitle ? <p className="-mt-2 text-[14px] text-muted md:hidden">{p.mobileTitle}</p> : null}
        <p className="text-body leading-[1.7] text-muted md:mb-[18px] md:max-w-[52ch] md:leading-[1.75]">
          <ResponsiveText mobile={p.mobileText} desktop={p.text} />
        </p>
        {p.quote ? (
          <blockquote className="mb-[22px] text-h3 leading-[1.4] font-semibold tracking-display text-plum max-md:hidden">
            <p>{copy.practitioner.quote(p.quote)}</p>
          </blockquote>
        ) : null}
        <Link
          href={p.link.href}
          // Invisible hit area (12px above and below) as on ArrowLink: a 44px target, the line doesn't move.
          className="relative inline-block border-b border-ink pb-[3px] text-ui-sm text-ink transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 hover:border-plum hover:text-plum max-md:hidden"
        >
          {p.link.label} <span aria-hidden="true">→</span>
        </Link>
        <ButtonLink href={p.mobileCta.href} size="lg" fullWidth className="md:hidden">
          {p.mobileCta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}
