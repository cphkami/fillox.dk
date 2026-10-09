import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutBand } from "@/components/treatment/AboutBand";
import { BookingBand } from "@/components/treatment/BookingBand";
import { FaqSection } from "@/components/treatment/FaqSection";
import { LongformSections, endsOnPlainSection } from "@/components/treatment/LongformSections";
import { MobileBookBar } from "@/components/treatment/MobileBookBar";
import { PractitionerSection } from "@/components/treatment/PractitionerSection";
import { PriceSection } from "@/components/treatment/PriceSection";
import { RelatedPosts } from "@/components/treatment/RelatedPosts";
import { ResultsSection } from "@/components/treatment/ResultsSection";
import { ReviewsSection } from "@/components/treatment/ReviewsSection";
import { TreatmentHero } from "@/components/treatment/TreatmentHero";
import { TreatmentJsonLd } from "@/components/treatment/TreatmentJsonLd";
import { buildTreatmentView } from "@/components/treatment/treatmentView";
import { getTreatment, treatments } from "@/content/treatments";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

/** Every treatment is generated at build time; other slugs 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return {};
  const view = buildTreatmentView(treatment);
  return pageMetadata({ title: view.metaTitle, description: view.description }, view.path, view.hero.image);
}

const BOOKING_BAND_ID = "book";

/**
 * Every section root in components/treatment sets `leading-[1.5]`: Poppins' "normal", which the
 * design's unset line heights assume (Figtree's "normal" is 1.2). Text without its own leading
 * (price rows, "Godt til", hero facts, eyebrows, captions) keeps the design's spacing and the
 * 1.5 body minimum; headings, intros and FAQ answers set their own.
 *
 * A long-form page (content/types.ts → Treatment.detail.sections, e.g. rynkebehandling) renders
 * its sections after the hero instead of "Om behandlingen", and only the sections its content gives.
 */
export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  const view = buildTreatmentView(treatment);
  const hasPlainSections = Boolean(view.practitioner || view.results || view.reviews || view.prices || view.posts);
  // The FAQ panel keeps the surface margin above it unless page-level sections end right before it.
  const faqAfterBand = !hasPlainSections && !endsOnPlainSection(view.sections);

  return (
    <>
      <TreatmentJsonLd view={view} />
      <TreatmentHero view={view} />
      {view.about ? <AboutBand about={view.about} /> : null}
      {view.sections?.length ? <LongformSections sections={view.sections} /> : null}

      {hasPlainSections ? (
        <div className="pt-12 md:pt-fluid-84">
          {view.practitioner ? <PractitionerSection practitioner={view.practitioner} /> : null}
          {view.results ? <ResultsSection results={view.results} /> : null}
          {view.reviews ? <ReviewsSection reviews={view.reviews} /> : null}
          {view.prices ? <PriceSection prices={view.prices} /> : null}
          {view.posts ? <RelatedPosts posts={view.posts} /> : null}
        </div>
      ) : null}

      {view.faq?.length ? <FaqSection items={view.faq} afterBand={faqAfterBand} /> : null}

      <BookingBand id={BOOKING_BAND_ID} title={view.booking.title} text={view.booking.text} cta={view.booking.cta} />

      <MobileBookBar
        name={view.title}
        price={view.priceFromText}
        cta={view.bookBarCta}
        hideAtId={BOOKING_BAND_ID}
      />
    </>
  );
}
