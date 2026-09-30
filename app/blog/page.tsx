import type { Metadata } from "next";
import { BlogBrowser, type BlogEntry } from "@/components/blog/BlogBrowser";
import { BlogFilterScope } from "@/components/blog/BlogFilterScope";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { sharedOpenGraph, shareImage, shareTitle } from "@/components/blog/metadata";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import { PostCard } from "@/components/blog/PostCard";
import { postFilterSlugs } from "@/components/blog/postView";
import { Responsive } from "@/components/blog/Responsive";
import { Eyebrow } from "@/components/ui";
import { blogFilters, getFeaturedPost, sortedPosts } from "@/content/blog";
import { blogPage as copy } from "@/content/pages/blog";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
  alternates: { canonical: copy.path },
  // Nested objects replace the root layout's, so the shared Open Graph fields are repeated
  // (see components/blog/metadata.ts). The share image is the featured article's photo.
  openGraph: {
    type: "website",
    ...sharedOpenGraph,
    url: copy.path,
    title: shareTitle(copy.meta.title),
    description: copy.meta.description,
    images: [shareImage(getFeaturedPost().image)],
  },
};

/** /blog — design 6blog (desktop) / mbl (mobile). */
export default function BlogPage() {
  const featured = getFeaturedPost();
  const entries: BlogEntry[] = sortedPosts().map((post) => ({
    slug: post.slug,
    filters: postFilterSlugs(post),
    hideOnMobile: Boolean(post.hideInMobileList),
    featured: post.slug === featured.slug,
    card: <PostCard post={post} />,
  }));

  const hero = (
    <>
      <Eyebrow className="md:mb-3.5">{copy.hero.eyebrow}</Eyebrow>
      <h1 className="mt-4 text-[36px] leading-[1.08] font-semibold tracking-display md:mt-0 md:mb-[18px] md:text-[52px] xl:text-h1-sm">
        {copy.hero.title}
      </h1>
      <p className="mt-4 text-[16px] leading-[1.7] text-muted md:mx-auto md:mt-0 md:max-w-[52ch] md:text-[18px] md:leading-[1.75] xl:text-lead">
        <Responsive mobile={copy.hero.introShort} desktop={copy.hero.intro} />
      </p>
    </>
  );

  return (
    <>
      <BlogFilterScope filters={blogFilters}>
        <BlogBrowser hero={hero} filters={blogFilters} featured={<FeaturedPost post={featured} />} entries={entries} />
      </BlogFilterScope>
      <NewsletterSignup />
    </>
  );
}
