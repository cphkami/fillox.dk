import type { ReactNode } from "react";
import { blogPage as copy } from "@/content/pages/blog";
import type { BlogFilter } from "@/content/types";
import { InlineScript } from "./InlineScript";

/**
 * Deep links into a filter, e.g. /blog?kategori=botox from the treatment pages.
 *
 * /blog is static, so its HTML is BlogBrowser's Suspense fallback: the unfiltered
 * overview. The URL filter only applies once React hydrates. To avoid that flash (and the
 * featured card collapsing above the fold), this scope renders, before the overview:
 * - a tiny inline script that copies a known filter slug from the URL to
 *   `data-blog-filter` on this wrapper, before the overview below it is parsed;
 * - CSS (generated from the filter slugs) that shows the fallback already filtered:
 *   matching cards only, the chip pressed, no featured card, no "Vis flere" unless needed.
 * The fallback marks its parts with the data attributes these rules target (BlogBrowser).
 * The hydrated view then replaces an identical-looking fallback. Without JavaScript the
 * script does not run and the page stays the plain unfiltered overview.
 */
export function BlogFilterScope({ filters, children }: { filters: BlogFilter[]; children: ReactNode }) {
  // Slugs go into a CSS attribute selector and a script, so only plain slugs are used.
  const slugs = filters.map((f) => f.slug).filter((slug) => slug !== copy.allFilter && /^[a-z0-9-]+$/.test(slug));
  if (!slugs.length) return <>{children}</>;

  const script = `(function(s){try{var f=new URLSearchParams(location.search).get(${json(copy.filterParam)});if(s&&f&&${json(slugs)}.indexOf(f)>-1)s.setAttribute("data-blog-filter",f)}catch(e){}})(document.currentScript&&document.currentScript.parentElement)`;

  return (
    // The script adds an attribute React did not render, hence suppressHydrationWarning.
    <div data-blog-scope="" className="contents" suppressHydrationWarning>
      <InlineScript code={script} />
      <style dangerouslySetInnerHTML={{ __html: prefilterCss(slugs) }} />
      {children}
    </div>
  );
}

const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

/** Rules that turn the unfiltered fallback into the filtered view (unlayered, so they beat the utilities). */
function prefilterCss(slugs: string[]): string {
  const any = "[data-blog-filter] [data-blog-fallback]";
  const shared = [
    `${any} [data-blog-featured]{display:none}`,
    // "Seneste artikler" padding without the featured card above it (pt-2 / md:pt-6).
    `${any} [data-blog-list]{padding-top:.5rem}`,
    `@media (min-width:48rem){${any} [data-blog-list]{padding-top:1.5rem}}`,
    // The count ("3 artikler") is filled in on hydration.
    `${any} [data-blog-count]{visibility:hidden}`,
    // "Alle" loses its pressed look (the "white" chip).
    `${any} [data-blog-chip="${copy.allFilter}"]{background-color:#fff;color:var(--color-ink);border-color:var(--color-line)}`,
  ];
  const perFilter = slugs.map((slug) => {
    const scope = `[data-blog-filter="${slug}"] [data-blog-fallback]`;
    return [
      `${scope} [data-blog-item]:not([data-blog-item~="${slug}"]),${scope} [data-blog-more]:not([data-blog-more~="${slug}"]),${scope} [data-blog-empty]:not([data-blog-empty~="${slug}"]){display:none}`,
      `${scope} [data-blog-item~="${slug}"],${scope} [data-blog-empty~="${slug}"]{display:block}`,
      `${scope} [data-blog-more~="${slug}"]{display:flex}`,
      // The requested chip gets the pressed ("primary") look, also when it is desktop-only.
      `${scope} [data-blog-chip="${slug}"]{display:inline-flex;background-color:var(--color-plum);color:var(--color-cream);border-color:var(--color-plum)}`,
    ].join("");
  });
  return [...shared, ...perFilter].join("");
}
