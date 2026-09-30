/**
 * Small pure helpers shared by the blog overview and article components.
 * No copy of their own: labels come from content/pages/blog.ts.
 */
import { getPost, sortedPosts } from "@/content/blog";
import { blogPage } from "@/content/pages/blog";
import type { BlogPost } from "@/content/types";

/** Every filter chip slug a post matches (besides "alle"): its category plus its tags. */
export function postFilterSlugs(post: BlogPost): string[] {
  return Array.from(new Set([post.categorySlug, ...(post.tags ?? [])].filter((s): s is string => Boolean(s))));
}

/** "4 min" (mobile / compact lists); falls back to the full reading time. */
export function shortReadingTime(post: BlogPost): string {
  return post.readingMinutes ? blogPage.minutes(post.readingMinutes) : post.readingTime;
}

/** Joins meta parts with the design's " · " separator, skipping empty ones. */
export function joinMeta(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(blogPage.separator);
}

/** Resolves slugs to posts (unknown slugs and `exclude` are skipped, order kept). */
function resolve(slugs: readonly string[] | undefined, exclude: string): BlogPost[] {
  return (slugs ?? [])
    .map((slug) => getPost(slug))
    .filter((p): p is BlogPost => Boolean(p) && p!.slug !== exclude);
}

/**
 * Fallback "Læs også" list for posts without a curated one: posts about the same
 * treatment first, then the same category/tags, then the newest.
 */
function suggestedPosts(post: BlogPost, limit: number): BlogPost[] {
  const filters = postFilterSlugs(post);
  const score = (p: BlogPost) => {
    const sameTreatment = p.treatmentSlugs?.some((t) => post.treatmentSlugs?.includes(t)) ? 2 : 0;
    const sameFilter = postFilterSlugs(p).some((f) => filters.includes(f)) ? 1 : 0;
    return sameTreatment + sameFilter;
  };
  // sortedPosts() is newest first and Array.prototype.sort is stable, so ties stay newest first.
  return sortedPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export type RelatedEntry = {
  post: BlogPost;
  /** Where the entry is shown: both layouts, desktop cards only, or the mobile list only. */
  show: "both" | "desktop" | "mobile";
};

/**
 * "Læs også" entries. Desktop (6art) and mobile (mar) may list different posts
 * (`relatedPostSlugs` / `relatedPostSlugsMobile`); they are merged into one list in
 * desktop order, with mobile-only posts appended, each marked with where it shows.
 */
export function relatedEntries(post: BlogPost, desktopCount: number, mobileCount: number): RelatedEntry[] {
  const curated = resolve(post.relatedPostSlugs, post.slug);
  const desktop = (curated.length ? curated : suggestedPosts(post, desktopCount)).slice(0, desktopCount);
  const curatedMobile = resolve(post.relatedPostSlugsMobile, post.slug);
  const mobile = (curatedMobile.length ? curatedMobile : desktop).slice(0, mobileCount);

  const mobileSlugs = new Set(mobile.map((p) => p.slug));
  const desktopSlugs = new Set(desktop.map((p) => p.slug));
  return [
    ...desktop.map((p) => ({ post: p, show: mobileSlugs.has(p.slug) ? "both" : "desktop" }) as RelatedEntry),
    ...mobile.filter((p) => !desktopSlugs.has(p.slug)).map((p) => ({ post: p, show: "mobile" }) as RelatedEntry),
  ];
}

/**
 * Focus ring for cards made clickable by a stretched title link: the ring goes around
 * the whole card instead of the title text.
 */
export const cardFocusRing =
  "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-plum has-[a:focus-visible]:outline-solid";
export const stretchedLink = "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none";
