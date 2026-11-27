import Link from "next/link";
import { ResponsiveText } from "@/components/ui";
import { practitionerPage } from "@/content/pages/practitioner";
import { contactLinks, drawnWidthScale, framedPortrait, hasProfilePage, teamMemberHref, teamSlots } from "@/content/team";
import type { ImageRef, TeamRosterMember } from "@/content/types";
import { cn } from "@/lib/cn";
import { CardClinics } from "./CardClinics";
import { ContactLinks } from "./ContactLinks";
import { CropPhoto } from "./CropPhoto";
import { PortraitPlaceholder } from "./PortraitPlaceholder";
import { TitleParts } from "./TitleParts";

type PractitionerCardProps = {
  member: TeamRosterMember;
  /** Heading level of the name (h2 on /behandlere). */
  headingLevel?: "h2" | "h3";
  /** Above the fold: load the portrait eagerly with high priority. */
  priority?: boolean;
};

/** The photo slot: 33:34 below 768px, 4:5 from there. The placeholder's too. */
const SLOT = "aspect-[33/34] rounded-[18px] md:aspect-[4/5] md:rounded-[24px]";

/** A member's portrait in its two crops (framed from the face table, content/team.ts). */
function Portrait({
  member,
  priority,
}: {
  member: { slug: string; image: ImageRef; crops?: { about?: ImageRef } };
  priority?: boolean;
}) {
  const portrait = member.crops?.about ?? member.image;
  const square = framedPortrait(member, teamSlots.square);
  // How much wider than its slot each crop is drawn (zoom), so `sizes` keeps it sharp.
  const zoom = drawnWidthScale(portrait, teamSlots.portrait.aspect);
  const squareZoom = drawnWidthScale(square, teamSlots.square.aspect);
  return (
    <CropPhoto
      mobile={square}
      desktop={portrait}
      // Card widths on the 1600px canvas: (1440 − 2 × 32) / 3 ≈ 459px; 3 columns from 1024px
      // (≈ 30vw), 2 from 560px, 1 below (at most 26rem = 416px). × the crop's zoom.
      sizes={[
        `(min-width: 1600px) ${Math.ceil(459 * zoom)}px`,
        `(min-width: 1024px) ${Math.ceil(30 * zoom)}vw`,
        `(min-width: 768px) ${Math.ceil(48 * zoom)}vw`,
        `(min-width: 560px) ${Math.ceil(48 * squareZoom)}vw`,
        `${Math.ceil(400 * squareZoom)}px`,
      ].join(", ")}
      priority={priority}
      className={SLOT}
    />
  );
}

/**
 * Team card on /behandlere, styled like the /om-os team cards (6om / mo), and the same for every
 * member (no wide "featured" block):
 *
 * - Portrait: framed from the face table (content/team.ts → framedPortrait), so all faces are
 *   framed alike: the 4:5 team-card crop (`crops.about`) from 768px, the squarer 33:34 crop
 *   (mo's 330 × 340) below, as on /om-os. A member without a photo gets the placeholder in the
 *   same slot (PortraitPlaceholder), chosen by the missing `image`.
 * - Mobile (mo): a white card with the portrait, name, short title, short bio and a 44px arrow
 *   link. From 768px the cards are borderless on the page.
 * - Under the title, the member's clinics (CardClinics: accent, medium, the title's size; Alberte,
 *   2026-11-26), as on /om-os and the home cards.
 * - Type follows the fluid scale ("Wide layout" in ARCHITECTURE.md): the design sizes up to
 *   1280px, then name 24 → 28, title 14 → 15, bio 16 → 18, link 14 → 16 at 1600px.
 *
 * A member with a profile page: the whole card is clickable (stretched link to /behandlere/<slug>).
 * A card-only member (content/types.ts: no profile page yet): the same card as plain content, with
 * name, title and clinics in the same type and places, and no link to a profile (nothing to hover);
 * its only links are the work contact at the bottom (ContactLinks: the e-mail, Instagram once live),
 * which has no profile page to sit on.
 */
export function PractitionerCard({ member, headingLevel: Heading = "h2", priority }: PractitionerCardProps) {
  const href = hasProfilePage(member) ? teamMemberHref(member.slug) : undefined;
  // The card's own link label when it leads to the profile ("Se hvad X tilbyder"), else a neutral one.
  const label = member.link && member.link.href === href ? member.link.label : practitionerPage.index.cardLinkLabel(member.name);
  const name = member.fullName ?? member.name;

  return (
    <article className="relative flex w-full flex-col rounded-[24px] bg-white px-2.5 pt-2.5 pb-5 max-md:shadow-card md:bg-transparent md:p-0">
      {member.image ? (
        <Portrait member={{ ...member, image: member.image }} priority={priority} />
      ) : (
        <PortraitPlaceholder name={member.name} className={SLOT} />
      )}

      <div className="flex flex-1 flex-col gap-1.5 px-2.5 pt-4 md:gap-0 md:p-0">
        <Heading className="font-heading text-[22px] tracking-display text-accent md:mt-[22px] md:mb-1 md:text-[24px] xl:text-h3-md">
          {name}
        </Heading>
        <div className="flex flex-col gap-0.5 md:mb-3.5">
          <p className="text-[13px] text-muted md:text-small">
            <ResponsiveText
              mobile={member.titleShort && <TitleParts text={member.titleShort} />}
              desktop={<TitleParts text={member.title ?? member.role} />}
            />
          </p>
          <CardClinics member={member} className="text-[13px] font-medium text-accent md:text-small" />
        </div>
        {member.bio ? (
          <p className="text-[15px] leading-[1.65] text-pretty text-muted md:text-body md:leading-[1.75]">
            <ResponsiveText mobile={member.bioShort} desktop={member.bio} />
          </p>
        ) : null}
        {href ? (
          <div className="mt-auto md:pt-4">
            <Link
              href={href}
              className={cn(
                "inline-flex h-11 items-center text-[15px] font-semibold whitespace-nowrap text-accent transition-colors hover:text-accent-deep",
                "after:absolute after:inset-0 after:rounded-[24px]",
                // The site's text link from 768px: plum underline (Button textLink).
                "md:inline md:h-auto md:border-b md:border-rule-strong md:pb-[3px] md:text-ui-sm md:font-normal md:hover:border-accent-deep",
              )}
            >
              {label}
              <span aria-hidden="true">&nbsp;→</span>
            </Link>
          </div>
        ) : (
          // No profile page to carry the work contact, so the card shows it, right under the clinics.
          <ContactLinks name={member.name} links={contactLinks(member)} className="pt-2 md:pt-1" />
        )}
      </div>
    </article>
  );
}
