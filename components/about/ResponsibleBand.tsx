import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";

type ResponsibleBandProps = { copy: AboutPageCopy["responsible"] };

/**
 * Sand band "Fagligt ansvarlig · Æstetisk læge Tom Haugland" + CTA (desktop 6om only; not in mo).
 * Since the owner's new "Om Fillox" text (October 2026) it closes /behandlere only; on /om-os
 * DoctorSection ("En læge, der er en del af hverdagen") introduces Dr. Tom instead.
 * The design set a pale rose band above a plum footer. It is `bg-sand` (like the hero panel), not
 * `bg-secondary`: the band sits ≈ 32px above the Sandbeige footer (#CDBEA7), and secondary
 * (#E1DCCF) is only 1.33:1 against it, so the page would end in two near-identical panels; sand
 * (#EBE8DF) is 1.49:1 and reads as its own block. The name reads as a heading (Poppins 500,
 * espresso: 11.1:1 on sand), the eyebrow and button keep the accent (plum, 7.5:1). The practitioner
 * pages solve the same case (their closing "Book tid hos …" band) with the rosa `band`; README →
 * "Før lancering" asks the owner to pick one.
 */
export function ResponsibleBand({ copy }: ResponsibleBandProps) {
  return (
    <Container gutter="surface" className="mt-14 max-md:hidden lg:mt-fluid-56">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-[24px] bg-sand px-10 py-12 lg:px-14 lg:py-fluid-48 xl:px-16 2xl:px-20">
        <div>
          <Eyebrow className="mb-2">{copy.eyebrow}</Eyebrow>
          {/* 24px as in 6om; grows to 28px on the wide canvas, in step with the section H2s. */}
          <p className="font-heading text-[24px] tracking-display text-heading xl:text-h3-md">{copy.name}</p>
        </div>
        <ButtonLink href={copy.cta.href} size="md">
          {copy.cta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}
