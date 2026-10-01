import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApproachSection } from "@/components/practitioner/ApproachSection";
import { BookingBand } from "@/components/practitioner/BookingBand";
import { ExperienceSection } from "@/components/practitioner/ExperienceSection";
import { OffersSection } from "@/components/practitioner/OffersSection";
import { PractitionerHero } from "@/components/practitioner/PractitionerHero";
import { resolveProfile } from "@/components/practitioner/profile";
import { ReviewSection } from "@/components/practitioner/ReviewSection";
import { TeamRow } from "@/components/practitioner/TeamRow";
import { JsonLd, ORGANIZATION_ID, absoluteUrl, breadcrumbList } from "@/components/seo";
import { practitionerPage } from "@/content/pages/practitioner";
import { getTeamMember, team, teamMemberHref } from "@/content/team";
import { sharedOpenGraph, shareImage, shareTitle } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

/** Only the team members in content/team.ts exist; anything else is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return team.map((member) => ({ slug: member.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) return {};
  const profile = resolveProfile(member);
  const title = practitionerPage.meta.title(profile.displayName, profile.title);
  // The first intro that fits a search snippet (70–160 characters). The full intro names the
  // person, so it wins when it fits (team bios, ~115 characters); a profile's desktop intro
  // runs ~240 characters, so profiles use their short (mobile) intro.
  const fits = (s?: string) => !!s && s.length >= 70 && s.length <= 160;
  const description =
    [profile.intro, profile.introShort].find(fits) ?? profile.introShort ?? profile.intro ?? profile.title;
  const href = teamMemberHref(member.slug);

  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: {
      type: "profile",
      ...sharedOpenGraph,
      url: href,
      title: shareTitle(title),
      description,
      images: [shareImage(profile.desktopImage)],
    },
  };
}

/** /behandlere/[slug] — practitioner profile (design 6alb desktop, ma mobile). */
export default async function PractitionerPage({ params }: Props) {
  const { slug } = await params;
  const member = getTeamMember(slug);
  if (!member) notFound();

  const profile = resolveProfile(member);
  const id = (part: string) => `${member.slug}-${part}`;
  // "Se behandlinger ↓" (#behandlinger) points at the offers section.
  const anchor = profile.secondaryCta?.href.startsWith("#") ? profile.secondaryCta.href.slice(1) : undefined;
  // The closing booking band repeats the hero's button, so it only closes a page that has
  // content between the two; a profile without sections ends with the rest of the team.
  const hasSections = Boolean(
    profile.approach || profile.offers || profile.experience || profile.reviews.reviews.length > 0,
  );

  const url = absoluteUrl(teamMemberHref(member.slug));
  // The visible breadcrumb ("Om os → Behandlere → Alberte") as a BreadcrumbList.
  const crumbs = [...practitionerPage.breadcrumb.items, { label: profile.name, href: teamMemberHref(member.slug) }];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        // Same @id as the blog author node, so a profile and its articles are one entity.
        "@id": `${url}#person`,
        name: profile.displayName,
        jobTitle: profile.title,
        description: profile.intro,
        image: absoluteUrl(profile.desktopImage.src),
        url,
        worksFor: { "@id": ORGANIZATION_ID },
      },
      breadcrumbList(crumbs),
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex flex-col gap-surface">
        <PractitionerHero profile={profile} titleId={id("name")} />
        {profile.approach ? <ApproachSection approach={profile.approach} titleId={id("approach")} /> : null}
        {profile.offers ? (
          <OffersSection
            offers={profile.offers}
            bookingHref={profile.offersCtaHref}
            id={anchor ?? practitionerPage.offersId}
            titleId={id("offers")}
          />
        ) : null}
        {profile.experience ? (
          <ExperienceSection experience={profile.experience} titleId={id("experience")} />
        ) : null}
        {profile.reviews.reviews.length > 0 ? (
          <ReviewSection selection={profile.reviews} name={profile.name} titleId={id("reviews")} />
        ) : null}
        {hasSections ? (
          <BookingBand booking={profile.booking} titleId={id("booking")} />
        ) : (
          <TeamRow members={team.filter((m) => m.slug !== member.slug)} titleId={id("team")} />
        )}
      </div>
    </>
  );
}
