import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { posts, blogPostHref } from "@/content/blog";
import { footerNav, legalNav, mainNav } from "@/content/navigation";
import { team, teamMemberHref } from "@/content/team";
import { treatmentHref, treatments } from "@/content/treatments";

/** Absolute URL for a site path ("/" → "https://fillox.dk"). */
const abs = (path: string) => (path === "/" ? site.url : `${site.url}${path}`);

/** Every internal route linked from the navigation (hash + query stripped, deduped). */
function navRoutes(): string[] {
  const hrefs = [
    "/",
    site.booking.href,
    ...mainNav.flatMap((item) => (item.kind === "menu" ? [item.href, ...item.items.map((i) => i.href)] : [item.href])),
    ...footerNav.map((l) => l.href),
    ...legalNav.map((l) => l.href),
  ];
  const paths = hrefs.filter((h) => h.startsWith("/")).map((h) => h.split(/[?#]/)[0] || "/");
  return Array.from(new Set(paths));
}

/** /sitemap.xml — static routes from the navigation plus every treatment, practitioner and post. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...navRoutes().map((path) => ({ url: abs(path), priority: path === "/" ? 1 : 0.8 })),
    ...treatments.map((t) => ({ url: abs(treatmentHref(t.slug)), priority: 0.7 })),
    ...team.map((m) => ({ url: abs(teamMemberHref(m.slug)), priority: 0.5 })),
    ...posts.map((p) => ({ url: abs(blogPostHref(p.slug)), lastModified: p.date, priority: 0.6 })),
  ];
}
