import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { blogPostHref, posts } from "@/content/blog";
import { clinics } from "@/content/clinics";
import { footerNav, legalNav, mainNav, megaMenuPromo } from "@/content/navigation";
import { team, teamMemberHref } from "@/content/team";
import { treatmentHref, treatments } from "@/content/treatments";

type Entry = MetadataRoute.Sitemap[number];

/** Absolute URL for a site path ("/" → "https://fillox.dk"). */
const abs = (path: string) => (path === "/" ? site.url : `${site.url}${path}`);

/** "/om-os#behandlere" → "/om-os", "/booking?klinik=x" → "/booking". */
const pathOf = (href: string) => href.split(/[?#]/)[0] || "/";

/** "/behandlinger/botox" → "/behandlinger". */
const parentOf = (path: string) => path.slice(0, path.lastIndexOf("/")) || "/";

const isInternal = (href: string) => href.startsWith("/");

/** Newest ISO date in a list (for the blog index), or undefined. */
const newest = (dates: string[]) => dates.slice().sort().at(-1);

/**
 * /sitemap.xml — fully derived from /content, so the NO site needs no changes here:
 * - static routes: every internal link in the navigation, footer, legal links, the
 *   booking page and clinic links, plus the index route of each collection
 *   (/behandlinger, /behandlere, /blog, derived from the detail hrefs);
 * - detail routes: every treatment, practitioner and blog post.
 * Hash fragments and query strings are stripped and duplicates removed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const postDates = posts.map((p) => p.date);
  const legalPaths = new Set(legalNav.map((l) => pathOf(l.href)));

  // Index route of each collection = parent of its detail hrefs.
  const indexOf = (hrefs: string[]) => (hrefs.length ? parentOf(pathOf(hrefs[0])) : undefined);
  const blogIndex = indexOf(posts.map((p) => blogPostHref(p.slug)));
  const collectionIndexes = [
    indexOf(treatments.map((t) => treatmentHref(t.slug))),
    indexOf(team.map((m) => teamMemberHref(m.slug))),
    blogIndex,
  ].filter((path): path is string => Boolean(path));

  const staticHrefs = [
    "/",
    site.booking.href,
    ...mainNav.flatMap((item) => (item.kind === "menu" ? [item.href, ...item.items.map((i) => i.href)] : [item.href])),
    megaMenuPromo.link.href,
    ...collectionIndexes,
    ...clinics.flatMap((c) => (c.bookingHref ? [c.bookingHref] : [])),
    ...footerNav.map((l) => l.href),
    ...legalNav.map((l) => l.href),
  ];
  const staticPaths = Array.from(new Set(staticHrefs.filter(isInternal).map(pathOf)));

  const staticEntries: Entry[] = staticPaths.map((path) => {
    if (path === "/") return { url: abs(path), changeFrequency: "weekly", priority: 1 };
    if (legalPaths.has(path)) return { url: abs(path), changeFrequency: "yearly", priority: 0.3 };
    if (path === blogIndex) {
      return { url: abs(path), lastModified: newest(postDates), changeFrequency: "weekly", priority: 0.8 };
    }
    return { url: abs(path), changeFrequency: "monthly", priority: 0.8 };
  });

  const detailEntries: Entry[] = [
    ...treatments.map((t): Entry => ({ url: abs(treatmentHref(t.slug)), changeFrequency: "monthly", priority: 0.7 })),
    ...team.map((m): Entry => ({ url: abs(teamMemberHref(m.slug)), changeFrequency: "monthly", priority: 0.5 })),
    ...posts.map((p): Entry => ({ url: abs(blogPostHref(p.slug)), lastModified: p.date, priority: 0.6 })),
  ];

  // A detail href can also appear in the navigation (e.g. a treatment in the menu): keep one entry.
  const seen = new Set<string>();
  return [...staticEntries, ...detailEntries].filter((e) => !seen.has(e.url) && seen.add(e.url));
}
