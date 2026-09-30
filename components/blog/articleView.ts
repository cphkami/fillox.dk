/**
 * Resolves a BlogPost into everything the article page renders: author, body blocks
 * (with the excerpt-only fallback), breadcrumb links and "Læs også" entries.
 * Pure data — no React, no copy of its own (labels come from content/pages/blog.ts).
 */
import { blogFilters, blogPostHref, hasArticleBody } from "@/content/blog";
import { blogArticle, blogPage } from "@/content/pages/blog";
import { getTeamMember } from "@/content/team";
import type { BlogBlock, BlogPost, TeamMember } from "@/content/types";
import { relatedEntries, type RelatedEntry } from "./postView";

export type ArticleView = {
  post: BlogPost;
  path: string;
  author?: TeamMember;
  /** Filter chip of the post's category, for the breadcrumb ("Blog → Botox"). */
  category: { label: string; href: string };
  blocks: BlogBlock[];
  /**
   * False for an excerpt-only post (no written `body` yet): the page is noindex and shows
   * no reading time (content/blog.ts → hasArticleBody).
   */
  hasBody: boolean;
  related: RelatedEntry[];
};

/**
 * Posts without a written body (excerpt-only until Fillox delivers the text) still get
 * a complete page: the excerpt as the lead and a booking card for the treatment.
 */
function fallbackBlocks(post: BlogPost): BlogBlock[] {
  const treatmentSlug = post.treatmentSlugs?.[0];
  return [
    { type: "lead", text: post.excerpt },
    ...(treatmentSlug
      ? [{ type: "booking", treatmentSlug, eyebrow: blogArticle.bookingEyebrow } satisfies BlogBlock]
      : []),
  ];
}

/** Everything /blog/[slug] renders for `post`, with the fallbacks applied. */
export function buildArticleView(post: BlogPost): ArticleView {
  const filter = blogFilters.find((f) => f.slug === post.categorySlug);
  return {
    post,
    path: blogPostHref(post.slug),
    author: post.authorSlug ? getTeamMember(post.authorSlug) : undefined,
    category: {
      label: post.category,
      href: filter ? blogPage.filterHref(filter.slug) : blogPage.path,
    },
    blocks: post.body?.length ? post.body : fallbackBlocks(post),
    hasBody: hasArticleBody(post),
    related: relatedEntries(post, blogArticle.related.count, blogArticle.related.countMobile),
  };
}
