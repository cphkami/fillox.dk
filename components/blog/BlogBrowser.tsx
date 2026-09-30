"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Container, buttonClasses, containerClasses } from "@/components/ui";
import { blogPage as copy } from "@/content/pages/blog";
import type { BlogFilter } from "@/content/types";
import { cn } from "@/lib/cn";

/** One post in the overview, with its card rendered on the server. */
export type BlogEntry = {
  slug: string;
  /** Filter chip slugs the post matches (category + tags). */
  filters: string[];
  /** Left out of the unfiltered mobile list until "Vis flere artikler" (design mbl). */
  hideOnMobile: boolean;
  /** The featured post: shown in the big card when unfiltered, in the grid when filtered. */
  featured: boolean;
  card: ReactNode;
};

type BlogBrowserProps = {
  /** Hero text (eyebrow, H1, intro), rendered on the server; the chips go under it. */
  hero: ReactNode;
  filters: BlogFilter[];
  /** Featured post card (shown only when no filter is active). */
  featured?: ReactNode;
  entries: BlogEntry[];
};

const LIST_HEADING_ID = "latest-posts";
const LIST_ID = "post-list";

/**
 * Filterable post overview: chip row, featured card, "Seneste artikler" grid and
 * "Vis flere artikler". The active chip is kept in `?kategori=` (so treatment pages
 * can link to /blog?kategori=botox). The page is static: the initial HTML is the
 * unfiltered list (Suspense fallback), and the URL filter applies after hydration.
 * BlogFilterScope (rendered around this on the server) shows that fallback already
 * filtered for deep links, so hydration does not flash the unfiltered overview.
 */
export function BlogBrowser(props: BlogBrowserProps) {
  return (
    <Suspense
      fallback={
        <div data-blog-fallback="" className="contents">
          <BlogBrowserView {...props} active={copy.allFilter} fallback />
        </div>
      }
    >
      <BlogBrowserFromUrl {...props} />
    </Suspense>
  );
}

function BlogBrowserFromUrl(props: BlogBrowserProps) {
  const params = useSearchParams();
  const requested = params.get(copy.filterParam);
  const active = props.filters.some((f) => f.slug === requested) ? requested! : copy.allFilter;

  function select(slug: string) {
    // The native History API syncs with useSearchParams (no navigation, no scroll jump).
    const url = new URL(window.location.href);
    if (slug === copy.allFilter) url.searchParams.delete(copy.filterParam);
    else url.searchParams.set(copy.filterParam, slug);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  return <BlogBrowserView {...props} active={active} onSelect={select} />;
}

type ViewProps = BlogBrowserProps & {
  active: string;
  onSelect?: (slug: string) => void;
  /**
   * The static HTML before hydration (Suspense fallback): renders every entry and marks
   * each part with the data attributes BlogFilterScope's CSS uses to pre-apply a URL filter.
   */
  fallback?: boolean;
};

/**
 * For the fallback: under which filters each entry, "Vis flere artikler" and the empty
 * text show on the first page (space-separated slugs, for `[data-blog-item~="botox"]`).
 */
function prefilterPlan(filters: BlogFilter[], entries: BlogEntry[]) {
  const size = copy.list.pageSize;
  const items = new Map<string, string[]>(entries.map((e) => [e.slug, []]));
  const more: string[] = [];
  const empty: string[] = [];
  for (const { slug } of filters) {
    if (slug === copy.allFilter) continue;
    const matching = entries.filter((e) => e.filters.includes(slug));
    for (const e of matching.slice(0, size)) items.get(e.slug)!.push(slug);
    if (matching.length > size) more.push(slug);
    if (!matching.length) empty.push(slug);
  }
  return { items, more: more.join(" "), empty: empty.join(" ") };
}

function BlogBrowserView({ hero, filters, featured, entries, active, onSelect, fallback }: ViewProps) {
  const unfiltered = active === copy.allFilter;
  const showFeatured = unfiltered && Boolean(featured);

  const matching = unfiltered
    ? entries.filter((e) => !(showFeatured && e.featured))
    : entries.filter((e) => e.filters.includes(active));
  const total = unfiltered ? entries.length : matching.length;

  // Paging resets whenever the filter changes (state is keyed by the filter it belongs to).
  const [paging, setPaging] = useState({ filter: active, pages: 1, expanded: false });
  const current = paging.filter === active ? paging : { filter: active, pages: 1, expanded: false };
  const shown = matching.slice(0, current.pages * copy.list.pageSize);
  const hideOnMobile = (e: BlogEntry) => unfiltered && !current.expanded && e.hideOnMobile;

  const moreOnDesktop = matching.length > shown.length;
  const moreOnMobile = moreOnDesktop || shown.some(hideOnMobile);

  const plan = fallback ? prefilterPlan(filters, entries) : null;
  // The fallback renders every entry (hidden unless on this page), so a pre-applied filter can show them.
  const listItems = plan ? entries : shown;
  const onPage = new Set(shown.map((e) => e.slug));

  const listRef = useRef<HTMLUListElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  /** Index of the list item to focus after "Vis flere artikler" re-renders. */
  const focusIndex = useRef<number | null>(null);

  useEffect(() => {
    const index = focusIndex.current;
    focusIndex.current = null;
    if (index === null) return;
    listRef.current?.children[index]?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
  });

  // Keep the active chip in view in the horizontally scrolling mobile row.
  useEffect(() => {
    const row = rowRef.current;
    const chip = row?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    const left = chip.offsetLeft; // the row is the chips' offsetParent (position: relative)
    if (left < row.scrollLeft || left + chip.offsetWidth > row.scrollLeft + row.clientWidth) {
      row.scrollTo({ left: Math.max(0, left - 20), behavior: "smooth" });
    }
  }, [active]);

  function showMore() {
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    // First item that becomes visible: the next page on desktop, the first hidden row on mobile.
    const firstHidden = shown.findIndex(hideOnMobile);
    focusIndex.current = !desktop && firstHidden !== -1 ? firstHidden : shown.length;
    setPaging({ filter: active, pages: current.pages + (moreOnDesktop ? 1 : 0), expanded: true });
  }

  return (
    <>
      <div className={cn(containerClasses("content"), "pt-6 pb-[22px] md:pt-fluid-72 md:pb-fluid-48 md:text-center")}>
        {hero}
        <div
          ref={rowRef}
          role="group"
          aria-label={copy.filters.label}
          className={cn(
            "relative mt-[10px] flex gap-2 md:mt-8 md:flex-wrap md:justify-center md:gap-2.5",
            // Mobile: horizontal scroll row bleeding off the right edge (focus rings stay unclipped).
            "max-md:-mr-5 max-md:-mb-1.5 max-md:-ml-1.5 max-md:snap-x max-md:snap-mandatory max-md:scroll-pl-1.5 max-md:overflow-x-auto max-md:overscroll-x-contain max-md:py-1.5 max-md:pr-5 max-md:pl-1.5 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden",
          )}
        >
          {filters.map((filter) => {
            const isActive = filter.slug === active;
            return (
              <button
                key={filter.slug}
                type="button"
                data-blog-chip={plan ? filter.slug : undefined}
                aria-pressed={isActive}
                aria-controls={LIST_ID}
                onClick={() => onSelect?.(filter.slug)}
                className={cn(
                  buttonClasses({ variant: isActive ? "primary" : "white", size: "chip" }),
                  // Same 1px border as the inactive chips, so switching filters never shifts the row.
                  isActive && "border border-plum hover:border-plum-deep",
                  "shrink-0 snap-start",
                  filter.desktopOnly && !isActive && "max-md:hidden",
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {showFeatured ? (
        <Container gutter="surface" data-blog-featured={plan ? "" : undefined}>
          {featured}
        </Container>
      ) : null}

      <Container
        as="section"
        aria-labelledby={LIST_HEADING_ID}
        data-blog-list={plan ? "" : undefined}
        className={cn("pb-8 md:pb-6", showFeatured ? "pt-7 md:pt-fluid-72" : "pt-2 md:pt-6")}
      >
        <div className="mb-8 flex items-baseline justify-between gap-4 max-md:sr-only xl:mb-fluid-32">
          <h2 id={LIST_HEADING_ID} className="text-[32px] font-semibold tracking-display xl:text-h2-sm">
            {copy.list.title}
          </h2>
          <p aria-live="polite" data-blog-count={plan ? "" : undefined} className="shrink-0 text-[14px] text-muted">
            {copy.list.count(total)}
          </p>
        </div>

        {listItems.length ? (
          <ul ref={listRef} id={LIST_ID} className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-fluid-24 lg:grid-cols-3">
            {listItems.map((entry) => (
              <li
                key={entry.slug}
                data-blog-item={plan?.items.get(entry.slug)?.join(" ")}
                className={cn(!onPage.has(entry.slug) ? "hidden" : hideOnMobile(entry) && "max-md:hidden")}
              >
                {entry.card}
              </li>
            ))}
          </ul>
        ) : null}
        {!shown.length || plan?.empty ? (
          <p
            id={listItems.length ? undefined : LIST_ID}
            data-blog-empty={plan?.empty}
            className={cn("text-[16px] leading-[1.7] text-muted md:text-center", shown.length > 0 && "hidden")}
          >
            {copy.list.empty}
          </p>
        ) : null}

        {moreOnMobile || plan?.more ? (
          <div
            data-blog-more={plan?.more}
            className={cn("mt-4 flex justify-center md:mt-10", !moreOnMobile ? "hidden" : !moreOnDesktop && "md:hidden")}
          >
            <button
              type="button"
              aria-controls={LIST_ID}
              onClick={showMore}
              className={cn(
                buttonClasses({ variant: "outline", size: "mdTight", mobileSize: "lg", fullWidth: "mobile" }),
                "md:px-8!",
              )}
            >
              {copy.list.showMore}
            </button>
          </div>
        ) : null}
      </Container>
    </>
  );
}
