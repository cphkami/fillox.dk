import Link from "next/link";
import { Eyebrow, Photo, containerClasses } from "@/components/ui";
import { blogArticle as copy, blogPage } from "@/content/pages/blog";
import { cn } from "@/lib/cn";
import type { ArticleView } from "./articleView";
import { joinMeta } from "./postView";
import { Responsive } from "./Responsive";

/**
 * Width of the reading column (720px from 800px up, side gutters below). It stays 720px on
 * the wide canvas too: the prose inside it keeps a 57ch measure (ArticleBody), so lines
 * stay ≤ 75 characters as the text grows from 17px to 19px (1280 → 1600px).
 */
export const readingColumn = "mx-auto w-full max-w-[800px] px-5 md:px-10";

/** Breadcrumb link: an invisible hit area (12px above and below) makes it a 44px target (tablet). */
const crumbLink = "relative transition-colors after:absolute after:-inset-x-1 after:-inset-y-3 hover:text-plum";

/**
 * Article header (6art / mar): breadcrumb "Blog → Botox" (desktop) or "‹ Alle artikler"
 * (mobile), "BOTOX · GUIDE", H1, byline, then the wide hero photo.
 */
export function ArticleHeader({ view }: { view: ArticleView }) {
  const { post, author, category } = view;

  return (
    <header>
      <div className={`${readingColumn} flex flex-col gap-4 pt-4 pb-5 md:gap-[18px] md:pt-fluid-56 md:pb-fluid-40 xl:gap-fluid-18`}>
        <nav aria-label={copy.breadcrumbLabel} className="text-small text-muted max-md:hidden">
          <ol className="flex flex-wrap items-center gap-x-1">
            <li>
              <Link href={copy.blogCrumb.href} className={crumbLink}>
                {copy.blogCrumb.label}
              </Link>
            </li>
            <li aria-hidden="true">→</li>
            <li>
              <Link href={category.href} className={crumbLink}>
                {category.label}
              </Link>
            </li>
          </ol>
        </nav>
        <Link
          href={copy.backLink.href}
          // py-3/-my-3: 45px tap target (secondary taps >= 44px) without moving the 21px text line.
          className="-my-3 self-start py-3 text-[14px] text-muted transition-colors hover:text-plum md:hidden"
        >
          <span aria-hidden="true">‹ </span>
          {copy.backLink.label}
        </Link>

        <Eyebrow>{joinMeta(post.category, post.kind)}</Eyebrow>

        <h1 className="text-[36px] leading-[1.08] font-semibold tracking-display text-pretty md:text-[48px] xl:text-h1-xs">{post.title}</h1>

        <div className="flex items-center gap-2.5 md:gap-3">
          {author ? (
            <Photo
              image={{ ...author.image, alt: "" }}
              sizes="44px"
              radius="50%"
              className="size-10 shrink-0 md:size-11"
            />
          ) : null}
          <p className="text-[13px] leading-[1.5] text-muted md:text-small md:leading-normal">
            {author ? (
              <>
                <span className="font-semibold text-ink">{author.name}</span>
                {blogPage.separator}
              </>
            ) : null}
            <time dateTime={post.date}>
              <Responsive mobile={copy.formatDateShort(post.date)} desktop={copy.formatDate(post.date)} />
            </time>
            {/* An excerpt-only post (no written body yet) claims no reading time. */}
            {view.hasBody ? (
              <>
                <span className="md:hidden">
                  <br />
                </span>
                <span className="max-md:hidden">{blogPage.separator}</span>
                {post.readingTime}
              </>
            ) : null}
          </p>
        </div>
      </div>

      {/* 6art: 48px inset on the 1180px canvas. From 1280px the photo sits on the content
          gutter, in line with the logo and the "Læs også" cards. Its height grows 480 → 620px
          (1280 → 1600px) with its width, so the photo keeps the design's shape (2.26:1 in
          6art, 2.4:1 at 1280, 2.32:1 at 1600: 1440 × 620) and shows the same part of the
          picture instead of turning into a strip. */}
      <div className={cn(containerClasses("surface"), "lg:px-12 xl:px-gutter")}>
        <div className="overflow-hidden rounded-[22px] md:rounded-[24px]">
          <Photo
            image={post.image}
            position={post.blogImagePosition}
            sizes="(min-width: 1600px) 1440px, 100vw"
            priority
            className="h-[260px] md:h-[400px] lg:h-fluid-480/620"
          />
        </div>
      </div>
    </header>
  );
}
