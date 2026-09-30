import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";

type ResponsibleBandProps = { copy: AboutPageCopy["responsible"] };

/** Powder band "Fagligt ansvarlig · Æstetisk læge Tom Haugland" + CTA (desktop 6om only; not in mo). */
export function ResponsibleBand({ copy }: ResponsibleBandProps) {
  return (
    <Container gutter="surface" className="mt-14 max-md:hidden lg:mt-fluid-56">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-[24px] bg-powder px-10 py-12 lg:px-14 lg:py-fluid-48 xl:px-16 2xl:px-20">
        <div>
          <Eyebrow className="mb-2">{copy.eyebrow}</Eyebrow>
          {/* 24px as in 6om; grows to 28px on the wide canvas, in step with the section H2s. */}
          <p className="text-[24px] font-semibold tracking-display xl:text-h3-md">{copy.name}</p>
        </div>
        <ButtonLink href={copy.cta.href} size="md">
          {copy.cta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}
