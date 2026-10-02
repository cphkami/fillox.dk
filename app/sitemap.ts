import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { blogPostHref, hasArticleBody, posts } from "@/content/blog";
import { routes, type RouteKey } from "@/content/routes";
import { team, teamMemberHref } from "@/content/team";
import { treatmentHref, treatments } from "@/content/treatments";

type Entry = MetadataRoute.Sitemap[number];

/** Absolute URL for a site path ("/" → "https://fillox.dk"). */
const abs = (path: string) => (path === "/" ? site.url : `${site.url}${path}`);

/** "/om-os#behandlere" → "/om-os", "/booking?klinik=x" → "/booking". */
const pathOf = (href: string) => href.split(/[?#]/)[0] || "/";

/** Newest ISO date in a list (for the blog index), or undefined. */
const newest = (dates: string[]) => dates.slice().sort().at(-1);

/** Routes that are not listed: noindex pages (the contact form's and the newsletter's thank-you pages). */
const unlisted: RouteKey[] = ["contactThanks", "newsletterThanks"];

/** Legal text pages: rarely change, low priority. */
const legal: RouteKey[] = ["terms", "privacy"];

/**
 * /sitemap.xml — fully derived from content/routes.ts and /content, so the NO site needs no
 * changes here:
 * - static routes: every route in content/routes.ts except `unlisted` (hash fragments are
 *   stripped, so the about page's team anchor collapses into the about page);
 * - detail routes: every treatment, practitioner and blog post with a written article.
 *   Excerpt-only posts are noindex (app/blog/[slug]/page.tsx) and left out until their
 *   text exists (content/blog.ts → hasArticleBody).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const listedPosts = posts.filter(hasArticleBody);
  const legalPaths = new Set<string>(legal.map((key) => routes[key]));

  const staticPaths = Array.from(
    new Set(
      (Object.keys(routes) as RouteKey[]).filter((key) => !unlisted.includes(key)).map((key) => pathOf(routes[key])),
    ),
  );

  const staticEntries: Entry[] = staticPaths.map((path) => {
    if (path === routes.home) return { url: abs(path), changeFrequency: "weekly", priority: 1 };
    if (legalPaths.has(path)) return { url: abs(path), changeFrequency: "yearly", priority: 0.3 };
    if (path === routes.blog) {
      const lastModified = newest(listedPosts.map((p) => p.date));
      return { url: abs(path), ...(lastModified ? { lastModified } : {}), changeFrequency: "weekly", priority: 0.8 };
    }
    return { url: abs(path), changeFrequency: "monthly", priority: 0.8 };
  });

  const detailEntries: Entry[] = [
    ...treatments.map((t): Entry => ({ url: abs(treatmentHref(t.slug)), changeFrequency: "monthly", priority: 0.7 })),
    ...team.map((m): Entry => ({ url: abs(teamMemberHref(m.slug)), changeFrequency: "monthly", priority: 0.5 })),
    ...listedPosts.map((p): Entry => ({ url: abs(blogPostHref(p.slug)), lastModified: p.date, priority: 0.6 })),
  ];

  // Keep one entry per URL.
  const seen = new Set<string>();
  return [...staticEntries, ...detailEntries].filter((e) => !seen.has(e.url) && seen.add(e.url));
}
