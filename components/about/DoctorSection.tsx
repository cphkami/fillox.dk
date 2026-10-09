import { CropPhoto } from "@/components/practitioner/CropPhoto";
import { ArrowLink, Container } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import { drawnWidthScale, framedPortrait, teamMemberHref, teamSlots } from "@/content/team";
import type { TeamMember } from "@/content/types";
import { AboutHeading, Prose } from "./Prose";

type DoctorSectionProps = { copy: AboutPageCopy["doctor"]; member: TeamMember };

/**
 * "En læge, der er en del af hverdagen": the medically responsible doctor, in a sand panel (the
 * home of the old "Fagligt ansvarlig" band on /om-os).
 *
 * - From 768px: his portrait flush left (2 : 3 of the panel, the hero's flush-photo look,
 *   mirrored), the text right: heading, the opening sentence as a lead, the paragraphs (his name
 *   in bold links to his profile) and "Se hvad Dr. Tom tilbyder →" (content/team.ts → link).
 * - Below 768px: the portrait on top of the card (the team cards' squarer 33:34 crop), the text
 *   under it.
 * - Portrait crops come from the face table (content/team.ts → framedPortrait), so his face sits
 *   as on the team cards. The photo cell is as tall as the text (min 480px); `sizes` asks for the
 *   width the cover crop draws (the photo is 509 × 800).
 */
export function DoctorSection({ copy, member }: DoctorSectionProps) {
  const titleId = `${copy.id}-title`;
  const portrait = framedPortrait(member, teamSlots.portrait);
  const square = framedPortrait(member, teamSlots.square);
  const zoom = drawnWidthScale(portrait, teamSlots.portrait.aspect);
  const squareZoom = drawnWidthScale(square, teamSlots.square.aspect);
  const profile = member.link ?? { label: member.fullName ?? member.name, href: teamMemberHref(member.slug) };

  return (
    <Container as="section" gutter="surface" id={copy.id} aria-labelledby={titleId} className="leading-[1.5]">
      <div className="overflow-hidden rounded-[24px] bg-sand md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <CropPhoto
          mobile={square}
          desktop={portrait}
          // 2/5 of the surface band: 1536 × 0.4 ≈ 615px on the 1600 canvas, ≈ 40vw from 768px;
          // the full card below 768px (at most ≈ 744px at 767). × the crop's zoom.
          sizes={[
            `(min-width: 1600px) ${Math.ceil(615 * zoom)}px`,
            `(min-width: 768px) ${Math.ceil(40 * zoom)}vw`,
            `${Math.ceil(100 * squareZoom)}vw`,
          ].join(", ")}
          className="aspect-[33/34] max-md:max-h-[480px] max-md:w-full md:aspect-auto md:h-full md:min-h-[480px]"
        />
        <div className="px-5 pt-8 pb-10 md:px-10 md:py-14 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
          <AboutHeading id={titleId}>{copy.title}</AboutHeading>
          <p className="mt-4 text-lead leading-[1.6] text-pretty text-ink md:mt-5 md:max-w-[40ch]">{copy.lead}</p>
          <Prose paragraphs={copy.paragraphs} className="mt-4 md:mt-5" />
          <ArrowLink href={profile.href} className="mt-7 md:mt-8">
            {profile.label}
          </ArrowLink>
        </div>
      </div>
    </Container>
  );
}
