import Link from "next/link";
import { Photo } from "@/components/ui";
import { blogPostHref } from "@/content/blog";
import { blogPage as copy } from "@/content/pages/blog";
import type { BlogPost } from "@/content/types";
import { cn } from "@/lib/cn";
import { cardFocusRing, joinMeta, shortReadingTime, stretchedLink } from "./postView";

type PostCardProps = {
  post: BlogPost;
  /**
   * Mobile look (below 768px): "list" = row with a hairline under it (mbl overview list),
   * "plain" = row without the hairline (mar "Læs også"). From 768px both are the white
   * photo card from 6blog / 6art.
   */
  variant?: "list" | "plain";
  /** Heading level of the title (h3 under a section h2). */
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Blog post teaser. Below 768px a compact row (88px thumbnail, "Filler · 4 min",
 * title); from 768px a white card (220px photo, growing on wide screens, "FILLER · 4 MIN
 * LÆSNING", title, "Læs artiklen →"). The whole card is clickable through the title link.
 */
export function PostCard({ post, variant = "list", headingLevel: Heading = "h3", className }: PostCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full items-center gap-3.5 rounded-[6px]",
        variant === "list" && "max-md:border-b max-md:border-line max-md:pb-3.5",
        cardFocusRing,
        "md:flex-col md:items-stretch md:gap-0 md:overflow-hidden md:rounded-[20px] md:bg-white md:transition-shadow md:duration-200 md:hover:shadow-menu",
        className,
      )}
    >
      {/* Photo 220px high; from 1024px it keeps the design's 340 × 220 shape (1.55:1) as the
          card grows with the canvas (220px at 1180, ~300px at 1600), never below 220px. */}
      <div className="size-[88px] shrink-0 overflow-hidden rounded-[14px] md:h-[220px] md:w-full md:rounded-none lg:aspect-[340/220] lg:h-auto lg:min-h-[220px]">
        <Photo
          image={{ ...post.image, alt: "" }}
          position={post.blogImagePosition}
          sizes="(min-width: 1600px) 464px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 88px"
          className="size-full"
        />
      </div>

      <div className="min-w-0 md:flex md:flex-1 md:flex-col md:gap-2.5 md:px-[26px] md:pt-6 md:pb-7 xl:px-fluid-26/32 xl:pt-fluid-24 xl:pb-fluid-28">
        <p className="text-[12px] text-muted md:hidden">{joinMeta(post.category, shortReadingTime(post))}</p>
        <p className="text-micro font-bold tracking-[2px] text-plum uppercase max-md:hidden">
          {post.category}
          {copy.separator}
          <span className="font-semibold text-muted">{post.readingTime}</span>
        </p>

        {/* 19px (6blog / 6art), from 1280px growing to 22px at 1600 (19 → 22, the token formula):
            the size of the treatment pages' blog-card titles (text-h4), and in step with the
            photo, which grows ~1.36× with the canvas. */}
        <Heading className="mt-0.5 text-[16px] leading-[1.4] font-semibold md:mt-0 md:text-[19px] md:leading-[1.35] md:tracking-[-.01em] xl:text-[length:clamp(19px,calc(7px+0.9375vw),22px)]">
          <Link
            href={blogPostHref(post.slug)}
            className={cn(stretchedLink, "transition-colors group-hover:text-plum md:group-hover:text-ink")}
          >
            {post.title}
          </Link>
        </Heading>

        {/* mt-auto pins the link to the card bottom when a neighbour's longer title makes the
            row taller; pt-1 keeps the design's 4px extra gap. */}
        <span aria-hidden="true" className="text-ui-sm font-semibold text-plum max-md:hidden md:mt-auto md:pt-1">
          {copy.list.readArticle}{" "}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </article>
  );
}
