import { Container } from "@/components/ui";
import { blogArticle as copy } from "@/content/pages/blog";
import { cn } from "@/lib/cn";
import { PostCard } from "./PostCard";
import type { RelatedEntry } from "./postView";

const HEADING_ID = "related-posts";

/**
 * "Læs også" under an article: three photo cards on desktop (6art), two compact rows
 * on mobile (mar). Between 768 and 1023px two cards fit per row, so only two show.
 */
export function RelatedArticles({ entries }: { entries: RelatedEntry[] }) {
  if (!entries.length) return null;
  const desktopSlugs = entries.filter((e) => e.show !== "mobile").map((e) => e.post.slug);

  return (
    <Container as="section" aria-labelledby={HEADING_ID} className="pb-10 md:pt-fluid-56 md:pb-6">
      <h2
        id={HEADING_ID}
        className="mb-4 font-heading text-[28px] leading-[1.15] tracking-display text-heading md:mb-7 md:py-[.2em] md:text-center md:text-[32px] md:leading-[1.1] xl:mb-fluid-28 xl:text-h2-sm"
      >
        {copy.related.title}
      </h2>
      <ul className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-fluid-24 lg:grid-cols-3">
        {entries.map(({ post, show }) => {
          const index = desktopSlugs.indexOf(post.slug);
          return (
            <li
              key={post.slug}
              className={cn(
                show === "desktop" && "max-md:hidden",
                show === "mobile" && "md:hidden",
                index >= 2 && "md:max-lg:hidden",
              )}
            >
              <PostCard post={post} variant="plain" />
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
