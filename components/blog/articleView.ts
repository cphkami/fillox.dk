/**
 * Resolves a BlogPost into everything the article page renders: author, body blocks
 * (with the excerpt-only fallback), breadcrumb links and "Læs også" entries.
 * Pure data — no React, no copy of its own (labels come from content/pages/blog.ts).
 */
import { site } from "@/config/site";
import { blogFilters, blogPostHref } from "@/content/blog";
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
    related: relatedEntries(post, blogArticle.related.count, blogArticle.related.countMobile),
  };
}

/** Absolute URL for a site path. */
export function absoluteUrl(path: string): string {
  return new URL(path, site.url).toString();
}
