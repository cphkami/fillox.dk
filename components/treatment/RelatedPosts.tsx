import Link from "next/link";
import { ButtonLink, Container, Eyebrow, Photo } from "@/components/ui";
import { blogPostHref } from "@/content/blog";
import { treatmentPage as copy } from "@/content/pages/treatments";
import { cn } from "@/lib/cn";
import type { TreatmentView } from "./treatmentView";

/**
 * Desktop grid, photo height and card image `sizes` by number of posts (one post: a wide
 * card, photo left). Photos are 220px tall up to 1280px and grow to 300px at the 1600px
 * canvas, so they keep the design's proportion as the columns widen. `sizes` = the widest
 * slot on the 1600px canvas (1440px content width; gaps 24px up to 1280, 29px at 1600, so the
 * values ask for a few px more than the slot).
 * Three posts on a tablet (768–1023px) would be 213px-wide columns with 4-line titles, so
 * there they stack as wide cards (photo left, 2 : 3) and become the design's 3 columns at lg.
 */
const layouts = {
  1: {
    grid: "md:grid-cols-1",
    card: "md:grid md:grid-cols-2",
    photo: "md:h-full md:min-h-fluid-300/380",
    body: "",
    longMetaFrom: "md",
    sizes: "(min-width: 1600px) 720px, 50vw",
  },
  2: {
    grid: "md:grid-cols-2",
    card: "",
    photo: "h-fluid-220/300",
    body: "",
    longMetaFrom: "md",
    sizes: "(min-width: 1600px) 708px, 50vw",
  },
  3: {
    grid: "md:grid-cols-1 lg:grid-cols-3",
    card: "md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:flex",
    photo: "md:h-full md:min-h-[220px] lg:h-fluid-220/300 lg:min-h-0",
    body: "md:px-8 md:py-7 lg:px-7 lg:pt-[26px] lg:pb-[30px] xl:px-fluid-28 xl:pt-fluid-26 xl:pb-fluid-30",
    // "FOREBYGGELSE · 3 MIN LÆSNING" wraps in columns narrower than the design canvas's.
    longMetaFrom: "canvas",
    sizes: "(min-width: 1600px) 464px, (min-width: 1024px) 30vw, 40vw",
  },
} as const;

/**
 * "Fra bloggen · Læs mere om …" (6c/6bx: header with "Alle artikler om …" and three
 * photo cards; mb: heading and compact text cards).
 */
export function RelatedPosts({ posts }: { posts: NonNullable<TreatmentView["posts"]> }) {
  const layout = layouts[Math.min(posts.items.length, 3) as 1 | 2 | 3];
  const single = posts.items.length === 1;
  return (
    <Container as="section" aria-labelledby={copy.sectionIds.posts} className="pt-2 pb-12 leading-[1.5] md:pt-0 md:pb-fluid-96">
      <div className="mb-4 md:mb-9 md:flex md:items-end md:justify-between md:gap-6 xl:mb-fluid-36">
        <div>
          <Eyebrow className="mb-3.5 max-md:hidden">{posts.eyebrow}</Eyebrow>
          <h2
            id={copy.sectionIds.posts}
            className="font-heading text-[28px] leading-[1.15] tracking-display text-heading md:mb-3 md:text-[40px] md:leading-[1.1] xl:text-h2"
          >
            {posts.title}
          </h2>
          {posts.intro ? (
            <p className="max-w-[52ch] text-body leading-[1.75] text-pretty text-muted max-md:hidden">{posts.intro}</p>
          ) : null}
        </div>
        {posts.link ? (
          <ButtonLink href={posts.link.href} variant="outline" size="mdTight" className="shrink-0 max-md:hidden">
            {posts.link.label}
          </ButtonLink>
        ) : null}
      </div>

      <ul className={cn("flex flex-col gap-4 md:grid md:gap-fluid-24", layout.grid)}>
        {posts.items.map((post) => {
          const kind = post.kind ?? post.category;
          return (
            <li key={post.slug} className="flex">
              <article
                className={cn(
                  "relative flex w-full flex-col overflow-hidden rounded-[18px] bg-white px-[18px] py-4 transition-shadow hover:shadow-menu md:rounded-[24px] md:p-0",
                  layout.card,
                )}
              >
                <Photo
                  image={{ ...post.image, alt: "" }}
                  sizes={layout.sizes}
                  className={cn("shrink-0 max-md:hidden", layout.photo)}
                />
                {/* Card paddings grow with the type from 1280 (`*-fluid-N`). */}
                <div
                  className={cn(
                    "flex flex-1 flex-col",
                    single
                      ? "md:justify-center md:px-10 md:pt-[26px] md:pb-[30px] lg:px-14 xl:px-fluid-56 xl:pt-fluid-26 xl:pb-fluid-30"
                      : layout.body ||
                          "md:px-5 md:pt-[26px] md:pb-[30px] lg:px-7 xl:px-fluid-28 xl:pt-fluid-26 xl:pb-fluid-30",
                  )}
                >
                  <p className="text-micro text-muted md:mb-2.5 md:font-bold md:tracking-[2px] md:text-accent md:uppercase">
                    {/* Short meta ("Guide · 4 min") on mobile, the long label from md (three
                        columns: from the 1180px design canvas). */}
                    <span className={layout.longMetaFrom === "md" ? "md:hidden" : "min-[73.75rem]:hidden"}>
                      {kind}
                      {post.readingMinutes ? ` · ${post.readingMinutes} ${copy.posts.minutes}` : ""}
                    </span>
                    <span className={layout.longMetaFrom === "md" ? "max-md:hidden" : "hidden min-[73.75rem]:inline"}>
                      {kind} · {post.readingTime}
                    </span>
                  </p>
                  {/* The single wide card's title grows 20 → 26px from 1280 (one step above the
                      excerpt's 18px at 1600), as the /blog featured card does; ≤ 1280 unchanged. */}
                  <h3
                    className={cn(
                      "mt-1 font-heading text-[16px] leading-[1.4] text-heading md:mt-0 md:mb-[18px] md:text-h4 md:leading-[1.3] md:tracking-display",
                      single && "xl:mb-fluid-18 xl:text-[length:clamp(20px,calc(-4px+1.875vw),26px)]",
                    )}
                  >
                    <Link href={blogPostHref(post.slug)} className="after:absolute after:inset-0 after:content-['']">
                      {post.title}
                    </Link>
                  </h3>
                  {single ? (
                    <p className="mb-[22px] max-w-[52ch] text-body leading-[1.75] text-muted max-md:hidden xl:mb-fluid-22">{post.excerpt}</p>
                  ) : null}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "self-start border-b border-rule-strong pb-[3px] text-ui-sm max-md:hidden",
                      !single && "mt-auto",
                    )}
                  >
                    {copy.posts.readArticle} →
                  </span>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
