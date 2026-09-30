import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { ArticleHeader, readingColumn } from "@/components/blog/ArticleHeader";
import { ArticleJsonLd } from "@/components/blog/ArticleJsonLd";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { buildArticleView } from "@/components/blog/articleView";
import { sharedOpenGraph, shareImage, shareTitle } from "@/components/blog/metadata";
import { getPost, posts } from "@/content/blog";

type Props = { params: Promise<{ slug: string }> };

/** Every post is generated at build time; other slugs 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const view = buildArticleView(post);
  const author = view.author ? [view.author.fullName ?? view.author.name] : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: view.path },
    authors: author?.map((name) => ({ name })),
    // Replaces the root layout's openGraph as a whole (see components/blog/metadata.ts).
    openGraph: {
      type: "article",
      ...sharedOpenGraph,
      title: shareTitle(post.title),
      description: post.excerpt,
      url: view.path,
      publishedTime: post.date,
      authors: author,
      section: post.category,
      tags: [post.category, post.kind].filter((t): t is string => Boolean(t)),
      images: [shareImage(post.image)],
    },
  };
}

/** /blog/[slug] — design 6art (desktop) / mar (mobile). */
export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const view = buildArticleView(post);

  return (
    <>
      <ArticleJsonLd view={view} />
      <article>
        <ArticleHeader view={view} />
        <div className={`${readingColumn} flex flex-col gap-4 pt-7 pb-8 md:gap-[18px] md:pt-14 md:pb-6`}>
          <ArticleBody blocks={view.blocks} />
          {view.author ? <AuthorBox author={view.author} /> : null}
        </div>
      </article>
      <RelatedArticles entries={view.related} />
    </>
  );
}
