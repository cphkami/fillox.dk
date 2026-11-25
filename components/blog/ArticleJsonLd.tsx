import { JsonLd, ORGANIZATION_ID, WEBSITE_ID, absoluteUrl, breadcrumbList } from "@/components/seo";
import { site } from "@/config/site";
import { blogArticle } from "@/content/pages/blog";
import { teamMemberHref } from "@/content/team";
import { getTreatment } from "@/content/treatments";
import type { Treatment } from "@/content/types";
import type { ArticleView } from "./articleView";

/**
 * schema.org BlogPosting + BreadcrumbList for an article page (all data from /content).
 * The publisher, and the author of a post signed by the team, is the site-wide Organization
 * node rendered by the root layout. Only published posts have a page (content/blog.ts → posts).
 */
export function ArticleJsonLd({ view }: { view: ArticleView }) {
  const { post } = view;
  const { member } = view.author;
  const url = absoluteUrl(view.path);
  const organization = { "@id": ORGANIZATION_ID };

  const about = (post.treatmentSlugs ?? [])
    .map((slug) => getTreatment(slug))
    .filter((t): t is Treatment => Boolean(t))
    .map((t) => ({ "@type": "Thing", name: t.detail?.title ?? t.name }));

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
    // An excerpt-only post (no written body yet) claims no reading time.
    ...(view.hasBody && post.readingMinutes ? { timeRequired: `PT${post.readingMinutes}M` } : {}),
    ...(about.length ? { about } : {}),
    // A practitioner is a Person (same @id as on their /behandlere profile); the team
    // ("Fillox-holdet") is the organisation itself, the same node as the root layout's.
    author: member
      ? {
          "@type": "Person",
          "@id": `${absoluteUrl(teamMemberHref(member.slug))}#person`,
          name: member.fullName ?? member.name,
          jobTitle: member.title ?? member.role,
          url: absoluteUrl(teamMemberHref(member.slug)),
          image: absoluteUrl(member.image.src),
          worksFor: organization,
        }
      : { "@type": "MedicalOrganization", "@id": ORGANIZATION_ID, name: site.name, url: site.url },
    publisher: organization,
  };

  // Blog → article. The category crumb is left out: its /blog?kategori= URL canonicalises
  // to /blog (same as TreatmentJsonLd); articleSection already carries the category.
  const crumbs = [blogArticle.blogCrumb, { label: post.title, href: view.path }];
  return <JsonLd data={{ "@context": "https://schema.org", "@graph": [article, breadcrumbList(crumbs)] }} />;
}
