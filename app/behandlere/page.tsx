import type { Metadata } from "next";
import { PractitionerCard } from "@/components/practitioner/PractitionerCard";
import { Container, Eyebrow } from "@/components/ui";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { practitionerPage } from "@/content/pages/practitioner";
import { team } from "@/content/team";

const PATH = "/behandlere";
const copy = practitionerPage.index;
const { ogImage, titleTemplate } = layoutCopy.meta;

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: PATH },
  // Nested objects replace the root layout's, so repeat the shared Open Graph fields.
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale.replace("-", "_"),
    url: PATH,
    title: titleTemplate.replace("%s", copy.meta.title),
    description: copy.meta.description,
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
  },
};

/**
 * /behandlere — every practitioner as a card linking to /behandlere/<slug>, laid out like
 * "Mød vores behandlere" on /om-os (6om / mo): the featured member (fagligt ansvarlig) as a
 * wide block, the others in a 4-column grid (2 on tablets). Below 768px every member is a
 * white card: one column, two from 640px.
 */
export default function PractitionersIndexPage() {
  const featured = team.filter((m) => m.featured);
  const others = team.filter((m) => !m.featured);

  return (
    <Container as="section" aria-labelledby="behandlere-title" className="pt-8 pb-14 md:pt-16 md:pb-24">
      <div className="mb-5 md:mb-14 md:text-center">
        <Eyebrow className="mb-3 md:mb-3.5">{copy.eyebrow}</Eyebrow>
        <h1
          id="behandlere-title"
          className="text-[36px] leading-[1.08] font-semibold tracking-display md:text-[52px] md:leading-[1.02] lg:text-[64px]"
        >
          {copy.title}
        </h1>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-x-7 md:gap-y-12 lg:grid-cols-4">
        {featured.map((member, i) => (
          <li key={member.slug} className="flex md:col-span-2 md:mb-6 lg:col-span-4">
            <PractitionerCard member={member} featured priority={i === 0} />
          </li>
        ))}
        {others.map((member, i) => (
          <li key={member.slug} className="flex">
            {/* Without a featured member the first grid card is the top of the page. */}
            <PractitionerCard member={member} priority={featured.length === 0 && i === 0} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
