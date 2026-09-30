import Link from "next/link";
import { ButtonLink, Container, Eyebrow, Photo } from "@/components/ui";
import { treatmentPage as copy } from "@/content/pages/treatments";
import type { TreatmentView } from "./treatmentView";
import { Swap } from "./Swap";

/**
 * "Din behandler" (6c/6bx: photo left, heading + text + quote + "Mød hele teamet →";
 * mb: photo, name in plum, title, short text and a full-width "Book hos …" button).
 */
export function PractitionerSection({ practitioner: p }: { practitioner: NonNullable<TreatmentView["practitioner"]> }) {
  return (
    <Container
      as="section"
      aria-labelledby="din-behandler"
      className="flex flex-col gap-4 pt-2 pb-14 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:items-center md:gap-10 md:pt-0 md:pb-[84px] lg:gap-16"
    >
      <Photo
        image={p.image}
        sizes="(min-width: 1180px) 418px, (min-width: 768px) 36vw, calc(100vw - 40px)"
        radius={24}
        className="h-[400px] shrink-0 md:h-[440px] lg:h-[520px]"
      />
      <div className="flex flex-col gap-4 md:block">
        <Eyebrow className="md:mb-[18px]">{copy.practitioner.eyebrow}</Eyebrow>
        <h2
          id="din-behandler"
          className="text-[28px] font-semibold tracking-display text-plum md:mb-4 md:text-[40px] md:leading-[1.1] md:text-ink"
        >
          <Swap mobile={p.member.name} desktop={p.heading} />
        </h2>
        {p.mobileTitle ? <p className="-mt-2 text-[14px] text-muted md:hidden">{p.mobileTitle}</p> : null}
        <p className="text-[16px] leading-[1.7] text-muted md:mb-[18px] md:max-w-[52ch] md:leading-[1.75]">
          <Swap mobile={p.mobileText} desktop={p.text} />
        </p>
        {p.quote ? (
          <blockquote className="mb-[22px] text-[22px] leading-[1.4] font-semibold tracking-display text-plum max-md:hidden">
            <p>{copy.practitioner.quote(p.quote)}</p>
          </blockquote>
        ) : null}
        <Link
          href={p.link.href}
          className="inline-block border-b border-ink pb-[3px] text-[14px] text-ink transition-colors hover:border-plum hover:text-plum max-md:hidden"
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
