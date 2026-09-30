import { site } from "@/config/site";
import { practitionerPage } from "@/content/pages/practitioner";
import type { ImageRef, Link, TeamMember, TeamProfile } from "@/content/types";

/**
 * Everything the profile page renders, with the fallbacks applied, so members
 * without a full `profile` (or with a partial one) still get a complete page.
 * Optional sections stay `undefined` and are simply not rendered.
 */
export type ResolvedProfile = {
  slug: string;
  /** Short name used in CTAs ("Dr. Tom"). */
  name: string;
  /** H1 ("Dr. Tom Haugland"). */
  displayName: string;
  /** Title under the H1 (desktop) / eyebrow above it (mobile). */
  title: string;
  titleShort?: string;
  intro?: string;
  introShort?: string;
  /** Hero crop below 768px (design `ma`: the uncropped portrait). */
  mobileImage: ImageRef;
  /** Hero crop from 768px (design `6alb`: s6alb-hero). */
  desktopImage: ImageRef;
  primaryCta: Link;
  secondaryCta?: Link;
  facts: TeamProfile["facts"];
  approach?: TeamProfile["approach"];
  offers?: TeamProfile["offers"];
  offersCtaHref: string;
  experience?: TeamProfile["experience"];
  reviews: NonNullable<TeamProfile["reviews"]>;
  booking: NonNullable<TeamProfile["booking"]>;
};

/**
 * Crop for portraits shown in a slot the design gave no crop for (profile hero without
 * profile.heroImage, /behandlere cards on mobile). `image` is the centred card crop; in a
 * slot wider than the portrait, centring cuts the head (Dr. Tom's hair starts ~5% from the
 * top of his photo) — keep the top of the photo, with a little headroom, instead.
 */
export const PORTRAIT_TOP_POSITION = "50% 5%";

/** The profile page of `member`: its `profile` content, completed with the fallbacks. */
export function resolveProfile(member: TeamMember): ResolvedProfile {
  const p = member.profile;
  const copy = practitionerPage.fallback;
  const bookingHref = member.bookingHref ?? site.booking.href;
  const primaryCta = p?.primaryCta ?? { label: copy.bookCta(member.name), href: bookingHref };
  const offers = p?.offers && p.offers.items.length > 0 ? p.offers : undefined;
  // An in-page secondary CTA ("Se behandlinger ↓") only makes sense when its target exists.
  const secondaryCta =
    p?.secondaryCta && (!p.secondaryCta.href.startsWith("#") || offers) ? p.secondaryCta : undefined;

  return {
    slug: member.slug,
    name: member.name,
    displayName: member.fullName ?? member.name,
    title: member.title ?? member.role,
    titleShort: member.titleShort,
    intro: p?.intro ?? member.bio,
    introShort: p ? p.introShort : member.bioShort,
    // With a designed hero crop (6alb) the mobile hero shows the portrait centred (ma);
    // without one, both crops keep the top of the portrait so the head is never cut.
    mobileImage: p?.heroImage ? member.image : { ...member.image, position: PORTRAIT_TOP_POSITION, zoom: undefined },
    desktopImage: p?.heroImage ?? { ...member.image, position: PORTRAIT_TOP_POSITION, zoom: undefined },
    primaryCta,
    secondaryCta,
    facts: p?.facts ?? [],
    approach: p?.approach && p.approach.items.length > 0 ? p.approach : undefined,
    offers,
    offersCtaHref: bookingHref,
    experience: p?.experience && p.experience.items.length > 0 ? p.experience : undefined,
    reviews: p?.reviews ?? [],
    booking: p?.booking ?? {
      title: copy.booking.title(member.name),
      text: copy.booking.text,
      cta: primaryCta,
    },
  };
}
