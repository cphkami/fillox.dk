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
  const titleId = `author-${author.slug}`;

  return (
    <aside
      aria-labelledby={titleId}
      className="mt-2 flex items-center gap-3.5 rounded-[20px] bg-white p-5 md:mt-9 md:gap-[18px] md:p-6"
    >
      <Photo
        image={{ ...author.image, alt: "" }}
        sizes="72px"
        radius="50%"
        className="size-[60px] shrink-0 md:size-[72px]"
      />
      <div className="min-w-0">
        {/* The box's title ("Skrevet af Annika"), a section of the article like its h2s, so
            heading navigation reaches it; the two lines keep the design's styles. */}
        <h2 id={titleId}>
          <span className="block text-[12px] text-muted md:mb-0.5">{copy.author.writtenBy}</span>{" "}
          <span className="block text-[17px] font-semibold text-plum md:text-[18px]">{author.name}</span>
        </h2>
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
