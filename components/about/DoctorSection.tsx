import { CropPhoto } from "@/components/practitioner/CropPhoto";
import { ArrowLink, Container, Photo } from "@/components/ui";
import type { AboutPageCopy } from "@/content/pages/about";
import { drawnWidthScale, framedPortrait, teamMemberHref, teamSlots } from "@/content/team";
import type { ImageRef, TeamMember } from "@/content/types";
import { AboutHeading, Prose } from "./Prose";

/** `image` is optional whatever the content sets: a market without the photo drops the key. */
type DoctorSectionProps = { copy: Omit<AboutPageCopy["doctor"], "image"> & { image?: ImageRef }; member: TeamMember };

/**
 * "En læge, der er en del af hverdagen": the medically responsible doctor, in a sand panel (the
 * home of the old "Fagligt ansvarlig" band on /om-os).
 *
 * - From 768px: his portrait flush left (2 : 3 of the panel, the hero's flush-photo look,
 *   mirrored), the text right: heading, the opening sentence as a lead, the paragraphs (his name
 *   in bold links to his profile) and "Se hvad Dr. Tom tilbyder →" (content/team.ts → link).
 * - Below 768px: the portrait on top of the card (the team cards' squarer 33:34 crop), the text
 *   under it.
 * - The photo: the section's own (`copy.image`, his photo in the clinic), else his team-card
 *   portrait cropped from the face table (content/team.ts → framedPortrait), so his face sits as
 *   on the team cards. The photo cell is as tall as the text (min 480px); `sizes` asks for the
 *   width the cover crop draws.
 */
export function DoctorSection({ copy, member }: DoctorSectionProps) {
  const titleId = `${copy.id}-title`;
  const profile = member.link ?? { label: member.fullName ?? member.name, href: teamMemberHref(member.slug) };

  return (
    <Container as="section" gutter="surface" id={copy.id} aria-labelledby={titleId} className="leading-[1.5]">
      <div className="overflow-hidden rounded-[24px] bg-sand md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {copy.image ? <OwnPhoto image={copy.image} /> : <TeamPortrait member={member} />}
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

/** The photo cell: the card's square-ish top below 768px, the panel's left column (as tall as the text) from 768px. */
const photoCell = "aspect-[33/34] max-md:max-h-[480px] max-md:w-full md:aspect-auto md:h-full md:min-h-[480px]";

/**
 * The section's own photo (`copy.image`, near-square): one crop (`position`) at every width. The
 * column from 768px is 2/5 of the surface band (≈ 290–615px) and as tall as the text (measured:
 * 822px at 768, 735 at 1024–1280, 783 at 1440, 831 on the 1600 canvas), so the photo is drawn at
 * height × aspect where that is wider than the column (≈ 780–790px for his photo).
 */
function OwnPhoto({ image }: { image: ImageRef }) {
  const aspect = image.width && image.height ? image.width / image.height : 1;
  return (
    <Photo
      image={image}
      sizes={[
        `(min-width: 1600px) ${Math.ceil(Math.max(615, 860 * aspect))}px`,
        `(min-width: 1024px) ${Math.ceil(Math.max(560, 840 * aspect))}px`,
        `(min-width: 768px) ${Math.ceil(860 * aspect)}px`,
        "100vw",
      ].join(", ")}
      className={photoCell}
    />
  );
}

/** His team-card portrait, framed from the face table (content/team.ts → framedPortrait). */
function TeamPortrait({ member }: { member: TeamMember }) {
  const portrait = framedPortrait(member, teamSlots.portrait);
  const square = framedPortrait(member, teamSlots.square);
  const zoom = drawnWidthScale(portrait, teamSlots.portrait.aspect);
  const squareZoom = drawnWidthScale(square, teamSlots.square.aspect);
  return (
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
      className={photoCell}
    />
  );
}
