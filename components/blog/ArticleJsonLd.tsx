import { ORGANIZATION_ID, WEBSITE_ID } from "@/components/seo";
import { site } from "@/config/site";
import { blogArticle } from "@/content/pages/blog";
import { teamMemberHref } from "@/content/team";
import { getTreatment } from "@/content/treatments";
import { absoluteUrl, type ArticleView } from "./articleView";

/**
 * schema.org BlogPosting + BreadcrumbList for an article page (all data from /content).
 * The publisher is the site-wide Organization node rendered by the root layout.
 */
export function ArticleJsonLd({ view }: { view: ArticleView }) {
  const { post, author } = view;
  const url = absoluteUrl(view.path);
  const organization = { "@id": ORGANIZATION_ID };

  const about = (post.treatmentSlugs ?? [])
    .map((slug) => getTreatment(slug))
    .filter((t) => Boolean(t))
    .map((t) => ({ "@type": "Thing", name: t!.detail?.title ?? t!.name }));

  const article: Record<string, unknown> = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [absoluteUrl(post.image.src)],
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: site.lang,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url, isPartOf: { "@id": WEBSITE_ID } },
    articleSection: post.category,
    ...(post.readingMinutes ? { timeRequired: `PT${post.readingMinutes}M` } : {}),
    ...(about.length ? { about } : {}),
    author: author
      ? {
          "@type": "Person",
          // Same @id as the Person node on the author's /behandlere profile.
          "@id": `${absoluteUrl(teamMemberHref(author.slug))}#person`,
          name: author.fullName ?? author.name,
          jobTitle: author.title ?? author.role,
          url: absoluteUrl(teamMemberHref(author.slug)),
          image: absoluteUrl(author.image.src),
          worksFor: organization,
        }
      : organization,
    publisher: organization,
  };

  // Blog → article. The category crumb is left out: its /blog?kategori= URL canonicalises
  // to /blog (same as TreatmentJsonLd); articleSection already carries the category.
  const crumbs = [blogArticle.blogCrumb, { label: post.title, href: view.path }];
  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };

  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": [article, breadcrumbs] }).replace(
    /</g,
    "\\u003c",
  );
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
