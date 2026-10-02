import Link from "next/link";
import { Eyebrow, Photo, buttonClasses } from "@/components/ui";
import { blogPostHref } from "@/content/blog";
import { blogPage as copy } from "@/content/pages/blog";
import { getTeamMember } from "@/content/team";
import type { BlogPost } from "@/content/types";
import { cn } from "@/lib/cn";
import { cardFocusRing, joinMeta, shortReadingTime, stretchedLink } from "./postView";
import { Responsive } from "./Responsive";

/**
 * Featured article on /blog (6blog: photo left, text right; mbl: photo on top, short
 * excerpt, no button). The whole card is clickable through the title link.
 */
export function FeaturedPost({ post }: { post: BlogPost }) {
  const author = post.authorSlug ? getTeamMember(post.authorSlug) : undefined;

  return (
    <article
      className={cn(
        "group relative grid overflow-hidden rounded-[24px] bg-white lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]",
        cardFocusRing,
      )}
    >
      <Photo
        image={{ ...post.image, alt: "" }}
        position={post.blogImagePosition}
        // Photo column = 1.15 / 2.15 of the surface band: 822px on the 1600px canvas (1536px band).
        sizes="(min-width: 1600px) 822px, (min-width: 1024px) 52vw, 100vw"
        priority
        className="h-[240px] md:h-[360px] lg:h-auto lg:min-h-fluid-420/520"
      />

      <div className="flex flex-col gap-2.5 px-5 pt-[22px] pb-6 md:justify-center md:gap-4 md:p-10 lg:p-14 xl:px-fluid-64/80">
        <Eyebrow>
          <Responsive
            mobile={joinMeta(post.category, post.kind, shortReadingTime(post))}
            desktop={joinMeta(post.category, post.kind, post.readingTime)}
          />
        </Eyebrow>

        <h2 className="font-heading text-[24px] leading-[1.2] tracking-display text-balance text-heading md:text-[36px] md:leading-[1.12] xl:text-h2-md">
          <Link href={blogPostHref(post.slug)} className={stretchedLink}>
            {post.title}
          </Link>
        </h2>

        {/* text-pretty: no one-word last line; 50ch keeps the one-column tablet layout (768–1023)
            at ≈ 75 characters a line and never binds in the lg two-column layout. */}
        <p className="text-body leading-[1.7] text-pretty text-muted md:max-w-[50ch] md:leading-[1.75]">
          <Responsive mobile={post.excerptShort} desktop={post.excerpt} />
        </p>

        {author ? (
          <div className="flex items-center gap-2.5 md:mt-1.5 md:gap-3">
            <Photo
              image={{ ...author.image, alt: "" }}
              sizes="44px"
              radius="50%"
              className="size-9 shrink-0 md:size-11"
            />
            <p className="text-[13px] md:text-small">
              <span className="font-semibold">{author.name}</span>
              <span className="text-muted md:hidden">
                {copy.separator}
                {author.role}
              </span>
              <span className="block text-muted max-md:hidden">{author.title ?? author.role}</span>
            </p>
          </div>
        ) : null}

        <span
          aria-hidden="true"
          className={cn(
            buttonClasses({ variant: "primary", size: "mdTight" }),
            "mt-2.5 self-start group-hover:bg-accent-deep max-md:hidden",
          )}
        >
          {copy.featured.cta}
        </span>
      </div>
    </article>
  );
}
