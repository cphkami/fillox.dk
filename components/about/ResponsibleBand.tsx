import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";

type ResponsibleBandProps = { copy: AboutPageCopy["responsible"] };

/** Powder band "Fagligt ansvarlig · Æstetisk læge Tom Haugland" + CTA (desktop 6om only; not in mo). */
export function ResponsibleBand({ copy }: ResponsibleBandProps) {
  return (
    <Container gutter="surface" className="mt-14 max-md:hidden">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-[24px] bg-powder px-10 py-12 lg:px-14">
        <div>
          <Eyebrow className="mb-2">{copy.eyebrow}</Eyebrow>
          <p className="text-[24px] font-semibold tracking-display">{copy.name}</p>
        </div>
        <ButtonLink href={copy.cta.href} size="md">
          {copy.cta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}
