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
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { practitionerPage } from "@/content/pages/practitioner";
import { getTeamMember, team, teamMemberHref } from "@/content/team";

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
  // The short (mobile) intro fits a search snippet; the desktop intro runs ~240 characters.
  const description = profile.introShort ?? profile.intro ?? profile.title;
  const href = teamMemberHref(member.slug);

  return {
    title,
    description,
    alternates: { canonical: href },
    openGraph: {
      type: "profile",
      siteName: site.name,
      locale: site.locale.replace("-", "_"),
      url: href,
      title: layoutCopy.meta.titleTemplate.replace("%s", title),
      description,
      images: [{ url: profile.desktopImage.src, alt: profile.desktopImage.alt }],
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
    profile.approach || profile.offers || profile.experience || profile.reviews.length > 0,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.displayName,
    jobTitle: profile.title,
    description: profile.intro,
    image: new URL(profile.desktopImage.src, site.url).toString(),
    url: new URL(teamMemberHref(member.slug), site.url).toString(),
    worksFor: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col gap-3 md:gap-6">
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
        {profile.reviews.length > 0 ? <ReviewSection reviews={profile.reviews} /> : null}
        {hasSections ? (
          <BookingBand booking={profile.booking} titleId={id("booking")} />
        ) : (
          <TeamRow members={team.filter((m) => m.slug !== member.slug)} titleId={id("team")} />
        )}
      </div>
    </>
  );
}
