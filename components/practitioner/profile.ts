import { site } from "@/config/site";
import { practitionerPage } from "@/content/pages/practitioner";
import { reviewsFor, type ReviewSelection } from "@/content/reviews";
import { contactLinks, framedPortrait, type ContactLink, type FaceSlot } from "@/content/team";
import type { ImageRef, Link, TeamMember, TeamProfile } from "@/content/types";

/**
 * Everything the profile page renders, with the fallbacks applied, so a member with a partial
 * `profile` still gets a complete page. Optional sections stay `undefined` and are simply not
 * rendered. Only members with a `profile` have a page (content/types.ts → TeamMember); a
 * card-only member never gets here.
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
  /** Hero crop from 768px (design `6alb`; framed from the face table, as `mobileImage`). */
  desktopImage: ImageRef;
  primaryCta: Link;
  secondaryCta?: Link;
  /** Work e-mail and Instagram (content/team.ts → contactLinks), under the hero's buttons; empty for Dr. Tom. */
  contact: ContactLink[];
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
 * Crop for a portrait whose face is not measured (content/team.ts → faces): in a slot wider than
 * the portrait, centring can cut the head, so keep the top of the photo, with a little headroom.
 */
export const PORTRAIT_TOP_POSITION = "50% 5%";

/**
 * The profile hero's photo slots (PractitionerHero), width / height at a reference width, with
 * the eye line of the team cards. The crops come from the face table (content/team.ts →
 * framedPortrait), so every face sits at about the same height whatever is above it in the
 * photo. No face size: the hero shows the whole photo where it can (zoom 1), so Dr. Tom's
 * stands in the clinic and the others are half-length portraits.
 */
const HERO_SLOTS = {
  /** Below 640px: 440px high, 366px wide at 390. */
  mobile: { aspect: 366 / 440, eyes: 0.28 },
  /**
   * The widest mobile frame, 615 × 440 at 639px: a photo narrower than `mobile` (a 4:5 portrait)
   * overflows above and below and is drawn much taller here, so the vertical position must also
   * keep the crown in this frame. Eye line 34%: room for a crown 0.19 of the photo above the eyes.
   */
  mobileWide: { aspect: 615 / 440, eyes: 0.34 },
  /**
   * 640–767px: 560px high and landscape, ≈ 680px wide, so the photo fills it by its width and is
   * cut above and below. Eye line 31%: with 28% a 4:5 portrait lost the top of the hair.
   */
  sm: { aspect: 680 / 560, eyes: 0.31 },
  /**
   * From 768px: half the panel, 616 × 675 at 1280 (≈ 0.79 at 1024, 0.96 at 1600). The eye line
   * (vertical position) is placed in this slot, where a photo narrower than the frame (a 4:5
   * portrait) overflows above and below.
   */
  desktop: { aspect: 616 / 675, eyes: 0.28 },
  /**
   * The narrowest desktop frame, 360 × 636 at 768px: the face's horizontal position is placed
   * here, where the photo overflows the most at the sides (placed at 1280, where it barely
   * overflows, it clamped to 0% or 100% and pushed the face to one side at 768–1023px). At
   * 1280 and above the photo almost fills the frame, so the horizontal position hardly matters.
   */
  desktopNarrow: { aspect: 360 / 636, eyes: 0.28 },
} satisfies Record<string, FaceSlot>;

/** "50% 22.8%" → [50, 22.8] (percent). */
const positionOf = (image: ImageRef): [number, number] => {
  const [x = 50, y = 50] = (image.position ?? "50% 50%").split(" ").map((s) => parseFloat(s));
  return [x, y];
};

/**
 * The mobile hero crop (below 640px, a frame 440px high and 296–615px wide): the designed slot's
 * crop, moved up if needed so the head also stays whole in the widest frame (the smaller of the two
 * vertical positions; 0, the photo's top, for a photo that fills the designed slot's height).
 */
function mobileCrop(member: TeamMember): ImageRef {
  const designed = framedPortrait(member, HERO_SLOTS.mobile, topOf(member.image));
  const wide = framedPortrait(member, HERO_SLOTS.mobileWide, topOf(member.image));
  const [x, y] = positionOf(designed);
  return { ...designed, position: `${x}% ${Math.min(y, positionOf(wide)[1])}%` };
}

/** The desktop hero crop: horizontal position from the narrowest frame, vertical from the 1280 one. */
function desktopCrop(member: TeamMember): ImageRef {
  const wide = framedPortrait(member, HERO_SLOTS.desktop, topOf(member.image));
  const narrow = framedPortrait(member, HERO_SLOTS.desktopNarrow, topOf(member.image));
  return { ...wide, position: `${positionOf(narrow)[0]}% ${positionOf(wide)[1]}%` };
}

/**
 * The practitioner's verified reviews (the ones that name them), filled up to 3 with general
 * ones under the generic heading (reviewsFor; general reviews that praise one unnamed person
 * are left out on profiles, content/reviews.ts → generalNotOnProfiles). A practitioner without a
 * single review of their own gets no section: general reviews only would read as testimonials
 * about someone no review names.
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
  const primaryCta = p.primaryCta;
  const offers = p.offers && p.offers.items.length > 0 ? p.offers : undefined;
  // An in-page secondary CTA ("Se behandlinger ↓") only makes sense when its target exists.
  const secondaryCta =
    p.secondaryCta && (!p.secondaryCta.href.startsWith("#") || offers) ? p.secondaryCta : undefined;

  return {
    slug: member.slug,
    name: member.name,
    displayName: member.fullName ?? member.name,
    title: member.title ?? member.role,
    titleShort: member.titleShort,
    intro: p.intro,
    introShort: p.introShort,
    // With a designed hero crop (`profile.heroImage`) the mobile hero shows `image` (the team-card
    // crop); without one, the crops frame the face (or keep the top of the portrait, so the head
    // is never cut). No member has a designed crop since the new photos (2026-11-25).
    mobileImage: p.heroImage ? member.image : mobileCrop(member),
    smCrop: framedPortrait(member, HERO_SLOTS.sm, topOf(member.image)),
    desktopImage: p.heroImage ?? desktopCrop(member),
    primaryCta,
    secondaryCta,
    contact: contactLinks(member),
    facts: p.facts,
    approach: p.approach && p.approach.items.length > 0 ? p.approach : undefined,
    offers,
    offersCtaHref: bookingHref,
    experience: p.experience && p.experience.items.length > 0 ? p.experience : undefined,
    reviews: ownReviews(member.slug),
    booking: p.booking ?? {
      title: copy.booking.title(member.name),
      text: copy.booking.text,
      cta: primaryCta,
    },
  };
}
