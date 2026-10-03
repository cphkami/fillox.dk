import Link from "next/link";
import { ArrowLink, Container, Eyebrow, Photo } from "@/components/ui";
import type { MenPage } from "@/content/pages/men";
import type { MenCarePerson } from "./menView";

/**
 * "Dine behandlere": the page's one human element, about care (not about a practitioner's
 * gender, and no choice of practitioner: see content/pages/men.ts → care). The heading, a short
 * intro and "Mød hele teamet" sit in the left column of the page's 1 : 1.6 split from 1024px;
 * three practitioners share the right one, each with a square-cornered 4:5 portrait (the page's
 * straighter look), name, title and their own quote under a bronze rule (decorative).
 *
 * Each card links to the practitioner's profile: the name is the link, and its ::after covers
 * the card (the <li> is the positioned box), so the whole card is the hit area; hovering the
 * card underlines the name. No "Book tid hos …" (the calendar cannot preselect a practitioner).
 *
 * Below 768px each practitioner is a row (104px portrait beside the text); from 768px three
 * columns. Image `sizes`: a third of the right column from 1024px ((1440 − 77) × 1.6 / 2.6 =
 * 839px, minus two 29px gaps, / 3 ≈ 260px at 1600; ≈ 16vw below), a third of the content on
 * tablets, 104px on phones.
 */
export function MenCare({ copy, people }: { copy: MenPage["care"]; people: MenCarePerson[] }) {
  const titleId = `${copy.id}-title`;
  return (
    <Container
      as="section"
      id={copy.id}
      aria-labelledby={titleId}
      className="py-14 leading-[1.5] md:py-fluid-96 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-start lg:gap-fluid-64"
    >
      <div className="mb-8 md:mb-10 lg:mb-0">
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

      <ul className="grid gap-7 md:grid-cols-3 md:gap-fluid-24">
        {people.map(({ member, profileHref, position }) => (
          <li key={member.slug} className="group relative flex gap-4 md:flex-col md:gap-0">
            <Photo
              image={member.image}
              position={position}
              sizes="(min-width: 1600px) 260px, (min-width: 1024px) 17vw, (min-width: 768px) 30vw, 104px"
              className="aspect-[4/5] w-[104px] shrink-0 self-start md:w-full"
            />
            <div className="min-w-0 md:mt-5 xl:mt-fluid-20">
              <h3 className="font-heading text-[20px] leading-[1.25] tracking-display text-heading md:text-h4">
                <Link
                  href={profileHref}
                  className="decoration-1 underline-offset-4 group-hover:underline after:absolute after:inset-0"
                >
                  {member.fullName ?? member.name}
                </Link>
              </h3>
              <p className="mt-1 text-small text-muted">{member.title ?? member.role}</p>
              {member.quote ? (
                <blockquote className="mt-3 border-l-2 border-rule pl-3 text-body leading-[1.6] text-pretty text-ink md:mt-4">
                  <p>{member.quote}</p>
                </blockquote>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </Container>
  );
}
