/**
 * Small pure helpers shared by the blog overview and article components.
 * No copy of their own: labels come from content/pages/blog.ts.
 */
import { hasArticleBody, postFilterSlugs, sortedPosts } from "@/content/blog";
import { blogArticle, blogPage } from "@/content/pages/blog";
import { getTeamMember, teamMemberHref } from "@/content/team";
import type { BlogPost, ImageRef, Link, TeamMember } from "@/content/types";
import { postsBySlugs } from "@/lib/content";

/** Every filter chip slug a post matches (besides "alle"): its category plus its tags. */
export { postFilterSlugs };

/**
 * Who signed a post, as the bylines, the author box and the structured data show it: a
 * practitioner (`authorSlug`, content/team.ts) or the team ("Fillox-holdet",
 * content/pages/blog.ts → blogArticle.teamAuthor), which has no portrait (the Fillox mark).
 */
export type PostAuthor = {
  /** "annika" for a practitioner, "team" for the team: the author box's heading id. */
  id: string;
  /** "Annika" / "Fillox-holdet". */
  name: string;
  /** Second line in the /blog featured card (practitioners only): title from 768px, role below. */
  title?: string;
  role?: string;
  /** One line in the author box (desktop). */
  bio?: string;
  /** The author box's link: the practitioner's profile, or the team on /om-os. */
  link: Link;
  /** Portrait; undefined for the team (components/blog/AuthorAvatar.tsx draws the Fillox mark). */
  image?: ImageRef;
  /** The practitioner (structured data: Person); undefined for the team (the Organization). */
  member?: TeamMember;
};

/** The post's author: its practitioner, or the team when it names none (or an unknown slug). */
export function postAuthor(post: BlogPost): PostAuthor {
  const member = post.authorSlug ? getTeamMember(post.authorSlug) : undefined;
  if (member) {
    return {
      id: member.slug,
      name: member.name,
      title: member.title,
      role: member.role,
      bio: member.authorBio,
      link: member.link ?? { label: member.name, href: teamMemberHref(member.slug) },
      image: member.image,
      member,
    };
  }
  const team = blogArticle.teamAuthor;
  return { id: "team", name: team.name, bio: team.bio, link: team.link };
}

/**
 * "4 min læsning" (desktop meta), or undefined while the post has no written article: an
 * excerpt-only post claims no reading time anywhere (content/blog.ts → hasArticleBody), the
 * same rule as the article header.
 */
export function readingTime(post: BlogPost): string | undefined {
  return hasArticleBody(post) ? post.readingTime : undefined;
}

/** "4 min" (mobile / compact lists); falls back to the full reading time; undefined as above. */
export function shortReadingTime(post: BlogPost): string | undefined {
  if (!hasArticleBody(post)) return undefined;
  return post.readingMinutes ? blogPage.minutes(post.readingMinutes) : post.readingTime;
}

/**
 * Joins meta parts with the design's " · " separator, skipping empty ones and repeats
 * (a post whose category and kind are both "Efterpleje" reads "Efterpleje", not
 * "Efterpleje · Efterpleje").
 */
export function joinMeta(...parts: Array<string | undefined | false>): string {
  return Array.from(new Set(parts.filter((p): p is string => Boolean(p)))).join(blogPage.separator);
}

/** Resolves slugs to posts (unknown slugs and `exclude` are skipped, order kept). */
function resolve(slugs: readonly string[] | undefined, exclude: string): BlogPost[] {
  return postsBySlugs(slugs).filter((p) => p.slug !== exclude);
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
  "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-accent has-[a:focus-visible]:outline-solid";
/** The card's title link, stretched over the whole card (the card is `relative`). */
export const stretchedLink = "after:absolute after:inset-0 after:content-[''] focus-visible:outline-none";
