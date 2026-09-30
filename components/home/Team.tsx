import Link from "next/link";
import { ArrowLink, Container, Photo, SectionHeading } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import type { TeamMember } from "@/content/types";
import { cn } from "@/lib/cn";
import { teamMemberHref } from "@/lib/content";
import { ScrollRow } from "./ScrollRow";

/**
 * "Mød hele teamet →". It sits under the heading on desktop and under the row on
 * mobile, so it is rendered in both places (one hidden) to keep the focus order equal
 * to the visual order.
 */
function TeamLink({ link, className }: { link: HomePage["team"]["link"]; className: string }) {
  return (
    <p className={className}>
      <ArrowLink href={link.href} className="max-lg:text-[15px] lg:font-normal">
        {link.label}
      </ArrowLink>
    </p>
  );
}

/**
 * "Mød dem, der behandler dig". Desktop (6a): powder panel, five portraits in a row,
 * "Mød hele teamet →" under the heading. Mobile (mf): horizontal scroll row on the page
 * background, link under the row.
 */
export function Team({ copy, members }: { copy: HomePage["team"]; members: TeamMember[] }) {
  return (
    <Container as="section" gutter="surface" aria-labelledby="home-team-title">
      <div className="flex flex-col gap-4 px-2 py-14 md:px-4 lg:gap-0 lg:rounded-[24px] lg:bg-powder lg:px-14 lg:py-[84px]">
        <SectionHeading
          id="home-team-title"
          title={copy.title}
          align="left"
          leading="normal"
          className="lg:mb-3.5 lg:text-center"
        />

        <TeamLink link={copy.link} className="mb-12 text-center text-[14px] leading-[normal] max-lg:hidden" />

        <ScrollRow
          aria-label={copy.listLabel}
          className="-mr-5 scroll-pr-5 pr-5 md:-mr-10 md:scroll-pr-10 md:pr-10 lg:mr-0 lg:grid lg:grid-cols-5 lg:items-start lg:gap-5 lg:pr-0"
        >
          {members.map((member) => (
            <li key={member.slug} className="w-[150px] flex-none snap-start lg:w-auto">
              <Link href={teamMemberHref(member.slug)} className="group block rounded-[18px] lg:rounded-[20px]">
                {/* The visible name and role label the link, so the portrait is decorative here.
                    `sizes` allows for the cover crop: a 0.83 portrait in the 188 × 268 box renders ~224px wide. */}
                <Photo
                  image={{ ...member.image, alt: "" }}
                  sizes="(min-width: 1024px) 230px, 160px"
                  radius="var(--photo-radius)"
                  className="h-[190px] [--photo-radius:18px] lg:h-[268px] lg:[--photo-radius:20px]"
                  imgClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <h3
                  className={cn(
                    "mt-2.5 text-[16px] font-semibold text-plum",
                    "lg:mt-[18px] lg:border-t lg:border-plum lg:pt-3.5 lg:text-[20px] lg:tracking-display lg:text-ink lg:group-hover:text-plum",
                  )}
                >
                  {member.name}
                </h3>
                <p className="text-[13px] text-muted lg:mt-1 lg:text-[12px] lg:tracking-[2px] lg:text-plum lg:uppercase">
                  {member.role}
                </p>
              </Link>
            </li>
          ))}
        </ScrollRow>

        <TeamLink link={copy.link} className="text-[15px] leading-[44px] lg:hidden" />
      </div>
    </Container>
  );
}
