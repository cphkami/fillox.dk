import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutBand } from "@/components/treatment/AboutBand";
import { BookingBand } from "@/components/treatment/BookingBand";
import { FaqSection } from "@/components/treatment/FaqSection";
import { MobileBookBar } from "@/components/treatment/MobileBookBar";
import { PractitionerSection } from "@/components/treatment/PractitionerSection";
import { PriceSection } from "@/components/treatment/PriceSection";
import { RelatedPosts } from "@/components/treatment/RelatedPosts";
import { ResultsSection } from "@/components/treatment/ResultsSection";
import { TreatmentHero } from "@/components/treatment/TreatmentHero";
import { TreatmentJsonLd } from "@/components/treatment/TreatmentJsonLd";
import { treatmentsMetadata } from "@/components/treatment/metadata";
import { buildTreatmentView } from "@/components/treatment/treatmentView";
import { getTreatment, treatments } from "@/content/treatments";
import { ui } from "@/content/ui";

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
  return treatmentsMetadata({
    title: view.title,
    description: view.description,
    path: view.path,
    image: view.hero.image,
  });
}

const BOOKING_BAND_ID = "book";

export default async function TreatmentPage({ params }: Props) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  const view = buildTreatmentView(treatment);
  const hasPlainSections = Boolean(view.practitioner || view.results || view.prices || view.posts);

  return (
    <>
      <TreatmentJsonLd view={view} />
      <TreatmentHero view={view} />
      <AboutBand about={view.about} />

      {hasPlainSections ? (
        <div className="pt-12 md:pt-[84px]">
          {view.practitioner ? <PractitionerSection practitioner={view.practitioner} /> : null}
          {view.results ? <ResultsSection results={view.results} /> : null}
          {view.prices ? <PriceSection prices={view.prices} /> : null}
          {view.posts ? <RelatedPosts posts={view.posts} /> : null}
        </div>
      ) : null}

      {view.faq?.length ? <FaqSection items={view.faq} afterBand={!hasPlainSections} /> : null}

      <BookingBand id={BOOKING_BAND_ID} title={view.booking.title} text={view.booking.text} cta={view.booking.cta} />

      <MobileBookBar
        name={view.title}
        price={view.priceFromText}
        cta={{ label: ui.bookCta, href: view.booking.cta.href }}
        hideAtId={BOOKING_BAND_ID}
      />
    </>
  );
}
