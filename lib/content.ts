/**
 * Small helpers over /content: lookups across content files and price formatting.
 * Pure functions — no React.
 */
import type { BlogPost, PriceValue, Treatment } from "@/content/types";
import { treatments } from "@/content/treatments";
import { treatmentCategories } from "@/content/navigation";
import { getPost, sortedPosts } from "@/content/blog";
import { ui } from "@/content/ui";
import { formatPrice } from "@/lib/format";

/** "fra 999 kr" */
export function formatPriceFrom(amount: number): string {
  return `${ui.from} ${formatPrice(amount)}`;
}

/** Renders a PriceValue: "999 kr", "fra 500 kr", "gratis", "efter aftale". */
export function formatPriceValue(value: PriceValue): string {
  switch (value.kind) {
    case "amount":
      return value.from ? formatPriceFrom(value.amount) : formatPrice(value.amount);
    case "free":
    case "on-request":
      return value.label;
  }
}

/** Treatments in a category, in menu order (content/navigation.ts). */
export function treatmentsInCategory(categorySlug: string): Treatment[] {
  const category = treatmentCategories.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return category.treatments
    .map((slug) => treatments.find((t) => t.slug === slug))
    .filter((t): t is Treatment => Boolean(t));
}

/** Resolves post slugs to posts, skipping unknown slugs (keeps the given order). */
export function postsBySlugs(slugs: readonly string[] | undefined): BlogPost[] {
  return (slugs ?? []).map((slug) => getPost(slug)).filter((p): p is BlogPost => Boolean(p));
}

/** Posts about a treatment (BlogPost.treatmentSlugs), newest first. */
export function postsForTreatment(treatmentSlug: string): BlogPost[] {
  return sortedPosts().filter((p) => p.treatmentSlugs?.includes(treatmentSlug));
}

/**
 * "Fra bloggen" posts on a treatment page: the curated `relatedPostSlugs` when
 * set, otherwise posts tagged with the treatment.
 */
export function relatedPostsForTreatment(treatment: Treatment, limit = 3): BlogPost[] {
  const curated = postsBySlugs(treatment.detail?.relatedPostSlugs);
  return (curated.length ? curated : postsForTreatment(treatment.slug)).slice(0, limit);
}
