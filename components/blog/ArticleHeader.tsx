import Link from "next/link";
import { Eyebrow, Photo } from "@/components/ui";
import { blogArticle as copy, blogPage } from "@/content/pages/blog";
import type { ArticleView } from "./articleView";
import { joinMeta } from "./postView";
import { Responsive } from "./Responsive";

/** Width of the reading column (720px from 800px up, side gutters below). */
export const readingColumn = "mx-auto w-full max-w-[800px] px-5 md:px-10";

/**
 * Article header (6art / mar): breadcrumb "Blog → Botox" (desktop) or "‹ Alle artikler"
 * (mobile), "BOTOX · GUIDE", H1, byline, then the wide hero photo.
 */
export function ArticleHeader({ view }: { view: ArticleView }) {
  const { post, author, category } = view;

  return (
    <header>
      <div className={`${readingColumn} flex flex-col gap-4 pt-4 pb-5 md:gap-[18px] md:pt-14 md:pb-10`}>
        <nav aria-label={copy.breadcrumbLabel} className="text-[14px] text-muted max-md:hidden">
          <ol className="flex flex-wrap items-center gap-x-1">
            <li>
              <Link href={copy.blogCrumb.href} className="transition-colors hover:text-plum">
                {copy.blogCrumb.label}
              </Link>
            </li>
            <li aria-hidden="true">→</li>
            <li>
              <Link href={category.href} className="transition-colors hover:text-plum">
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

        <h1 className="text-[36px] leading-[1.08] font-semibold tracking-display md:text-[48px]">{post.title}</h1>

        <div className="flex items-center gap-2.5 md:gap-3">
          {author ? (
            <Photo
              image={{ ...author.image, alt: "" }}
              sizes="44px"
              radius="50%"
              className="size-10 shrink-0 md:size-11"
            />
          ) : null}
          <p className="text-[13px] leading-[1.5] text-muted md:text-[14px] md:leading-normal">
            {author ? (
              <>
                <span className="font-semibold text-ink">{author.name}</span>
                {blogPage.separator}
              </>
            ) : null}
            <time dateTime={post.date}>
              <Responsive mobile={copy.formatDateShort(post.date)} desktop={copy.formatDate(post.date)} />
            </time>
            <span className="md:hidden">
              <br />
            </span>
            <span className="max-md:hidden">{blogPage.separator}</span>
            {post.readingTime}
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1180px] px-3 md:px-6 lg:px-12">
        <div className="overflow-hidden rounded-[22px] md:rounded-[24px]">
          <Photo
            image={post.image}
            position={post.blogImagePosition}
            sizes="(min-width: 1180px) 1084px, 100vw"
            priority
            className="h-[260px] md:h-[400px] lg:h-[480px]"
          />
        </div>
      </div>
    </header>
  );
}
