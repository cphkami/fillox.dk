import { ArrowLink, Container, Eyebrow, Photo } from "@/components/ui";
import type { MenPage } from "@/content/pages/men";
import type { MenPractitioner } from "./menView";

/** Portrait crops for the 4:5 slot (both photos: dark scrubs on a beige wall, face in the top third). */
const POSITION = "50% 28%";

/**
 * The practitioners a visitor can book when he prefers a male practitioner (content/team.ts),
 * shown as practitioners: photo, name, title, short bio, "Book tid hos …" and the profile link.
 *
 * Square-cornered portraits on hairline-free cards: the page's straighter look. Below 768px each
 * practitioner is a row (112px portrait beside the text, no bio); from 768px two columns with
 * 4:5 portraits; from 1024px the heading sits in the left column of the page's 1 : 1.6 split
 * and the two cards share the right one, aligned with the lists above.
 *
 * Image `sizes`: half of the right column from 1024px ((1440 − 77) × 1.6 / 2.6 = 839px, minus a
 * 29px gap, / 2 ≈ 406px at 1600), half the content on tablets, 112px on phones. The source
 * files are 509 and 1602px wide (Dr. Tom's stays slightly soft on 2x screens until a larger
 * original exists).
 */
export function MenPractitioners({ copy, people }: { copy: MenPage["practitioners"]; people: MenPractitioner[] }) {
  const titleId = `${copy.id}-title`;
  return (
    <Container
      as="section"
      id={copy.id}
      aria-labelledby={titleId}
      className="py-14 leading-[1.5] md:py-fluid-96 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-start lg:gap-fluid-64"
    >
      <div className="mb-7 md:mb-10 lg:mb-0">
        <Eyebrow className="mb-3.5">{copy.eyebrow}</Eyebrow>
        <h2
          id={titleId}
          className="font-heading text-[28px] leading-[1.15] text-balance tracking-display text-heading md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {copy.title}
        </h2>
        <p className="mt-4 max-w-[44ch] text-body leading-[1.7] text-muted md:leading-[1.75]">{copy.intro}</p>
        <ArrowLink href={copy.teamLink.href} className="mt-6">
          {copy.teamLink.label}
        </ArrowLink>
      </div>

      <ul className="grid gap-6 md:grid-cols-2 md:gap-fluid-24">
        {people.map(({ member, profileHref, bookingHref }) => (
          <li key={member.slug} className="flex gap-4 md:flex-col md:gap-0">
            <Photo
              image={member.image}
              position={POSITION}
              sizes="(min-width: 1600px) 406px, (min-width: 1024px) 27vw, (min-width: 768px) 46vw, 112px"
              className="aspect-[4/5] w-[112px] shrink-0 self-start md:w-full"
            />
            <div className="flex min-w-0 flex-col md:mt-5 xl:mt-fluid-20">
              <h3 className="font-heading text-[22px] leading-[1.2] tracking-display text-heading md:text-h3">
                {member.fullName ?? member.name}
              </h3>
              <p className="mt-1 text-small text-muted">{member.title ?? member.role}</p>
              {member.bioShort ? (
                <p className="mt-3 text-body leading-[1.7] text-muted max-md:hidden md:max-w-[44ch]">{member.bioShort}</p>
              ) : null}
              <div className="mt-4 flex flex-col items-start gap-6 md:mt-5">
                <ArrowLink href={bookingHref}>{copy.bookLabel(member.name)}</ArrowLink>
                <ArrowLink href={profileHref} tone="ink">
                  {copy.profileLabel(member.name)}
                </ArrowLink>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
