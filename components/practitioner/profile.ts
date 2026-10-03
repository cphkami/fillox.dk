import { site } from "@/config/site";
import { practitionerPage } from "@/content/pages/practitioner";
import { reviewsFor, type ReviewSelection } from "@/content/reviews";
import { framedPortrait, type FaceSlot } from "@/content/team";
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
  /** Hero crop at 640–767px, where the mobile slot turns landscape (applies to `mobileImage`). */
  smCrop: Pick<ImageRef, "position" | "zoom">;
  /** Hero crop from 768px (design `6alb`: s6alb-hero). */
  desktopImage: ImageRef;
  primaryCta: Link;
  secondaryCta?: Link;
  facts: TeamProfile["facts"];
  approach?: TeamProfile["approach"];
  offers?: TeamProfile["offers"];
  offersCtaHref: string;
  experience?: TeamProfile["experience"];
  /** Verified reviews that name the practitioner, filled up with general ones (content/reviews.ts). */
  reviews: ReviewSelection;
  booking: NonNullable<TeamProfile["booking"]>;
};

/**
 * Crop for portraits shown in a slot the design gave no crop for, when the photo's face is not
 * measured (content/team.ts → faces), and in the profile TeamRow. `image` is the centred card
 * crop; in a slot wider than the portrait, centring cuts the head (Dr. Tom's hair starts ~5%
 * from the top of his photo) — keep the top of the photo, with a little headroom, instead.
 */
export const PORTRAIT_TOP_POSITION = "50% 5%";

/**
 * The profile hero's photo slots (PractitionerHero), width / height at a reference width, with
 * the eye line of the team cards. The crops come from the face table (content/team.ts →
 * framedPortrait), so every face sits at about the same height whatever is above it in the
 * photo (Annika's has a mirror and the ceiling): with the top of the photo kept instead, her eyes
 * landed halfway down the slot.
 */
const HERO_SLOTS = {
  /** Below 640px: 440px high, 366px wide at 390. */
  mobile: { aspect: 366 / 440, eyes: 0.28 },
  /** 640–767px: 560px high and landscape, ≈ 680px wide. */
  sm: { aspect: 680 / 560, eyes: 0.28 },
  /** From 768px: half the panel, 616 × 675 at 1280 (≈ 0.79 at 1024, 0.96 at 1600). */
  desktop: { aspect: 616 / 675, eyes: 0.28 },
} satisfies Record<string, FaceSlot>;

/**
 * The practitioner's verified reviews (the ones that name them), filled up to 3 with general
 * ones under the generic heading (reviewsFor; general reviews that praise one unnamed person
 * are left out on profiles, content/reviews.ts → generalNotOnProfiles). A practitioner without a
 * single review of their own (Kubra) gets no section: general reviews only would read as
 * testimonials about someone no review names.
 */
function ownReviews(slug: string): ReviewSelection {
  const selection = reviewsFor({ practitioner: slug, seed: slug });
  return selection.specificCount > 0 ? selection : { reviews: [], specificCount: 0, allSpecific: false };
}

/** `image` with the top of the photo kept (PORTRAIT_TOP_POSITION), unzoomed. */
const topOf = (image: ImageRef): ImageRef => ({ ...image, position: PORTRAIT_TOP_POSITION, zoom: undefined });

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
    // With a designed hero crop (6alb) the mobile hero shows the portrait centred (ma); without
    // one, the crops frame the face (or keep the top of the portrait, so the head is never cut).
    mobileImage: p?.heroImage ? member.image : framedPortrait(member, HERO_SLOTS.mobile, topOf(member.image)),
    smCrop: framedPortrait(member, HERO_SLOTS.sm, topOf(member.image)),
    desktopImage: p?.heroImage ?? framedPortrait(member, HERO_SLOTS.desktop, topOf(member.image)),
    primaryCta,
    secondaryCta,
    facts: p?.facts ?? [],
    approach: p?.approach && p.approach.items.length > 0 ? p.approach : undefined,
    offers,
    offersCtaHref: bookingHref,
    experience: p?.experience && p.experience.items.length > 0 ? p.experience : undefined,
    reviews: ownReviews(member.slug),
    booking: p?.booking ?? {
      title: copy.booking.title(member.name),
      text: copy.booking.text,
      cta: primaryCta,
    },
  };
}
