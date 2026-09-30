import { ArrowLink, Photo } from "@/components/ui";
import { blogArticle as copy } from "@/content/pages/blog";
import type { TeamMember } from "@/content/types";
import { teamMemberHref } from "@/content/team";

/**
 * "Skrevet af" card at the end of an article (6art: 72px portrait, name, one-line bio,
 * link to the practitioner's profile; mar: 60px portrait, no bio).
 */
export function AuthorBox({ author }: { author: TeamMember }) {
  const link = author.link ?? { label: author.name, href: teamMemberHref(author.slug) };

  return (
    <aside
      aria-label={`${copy.author.writtenBy} ${author.name}`}
      className="mt-2 flex items-center gap-3.5 rounded-[20px] bg-white p-5 md:mt-9 md:gap-[18px] md:p-6"
    >
      <Photo
        image={{ ...author.image, alt: "" }}
        sizes="72px"
        radius="50%"
        className="size-[60px] shrink-0 md:size-[72px]"
      />
      <div className="min-w-0">
        <p className="text-[12px] text-muted md:mb-0.5">{copy.author.writtenBy}</p>
        <p className="text-[17px] font-semibold text-plum md:text-[18px]">{author.name}</p>
        {author.authorBio ? (
          <p className="text-[14px] leading-[1.6] text-muted max-md:hidden">{author.authorBio}</p>
        ) : null}
        {/* Mobile: 45px tap target (py-3) whose margin box stays the design's 21px line + 4px gap. */}
        <ArrowLink href={link.href} className="max-md:-mt-2 max-md:-mb-3 max-md:py-3 md:mt-1.5">
          {link.label}
        </ArrowLink>
      </div>
    </aside>
  );
}
