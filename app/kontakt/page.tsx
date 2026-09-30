import type { Metadata } from "next";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactJsonLd } from "@/components/contact/ContactJsonLd";
import { VisitClinics } from "@/components/contact/VisitClinics";
import { Eyebrow } from "@/components/ui";
import { site } from "@/config/site";
import { clinics, openClinics } from "@/content/clinics";
import { layoutCopy } from "@/content/layout";
import { mainNav } from "@/content/navigation";
import { contactPage } from "@/content/pages/contact";

const PATH = "/kontakt";
const { meta, hero } = contactPage;
const { ogImage, titleTemplate } = layoutCopy.meta;
const clinicsHref = mainNav.find((n) => n.kind === "clinics")?.href ?? "/klinikker";

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  alternates: { canonical: PATH },
  // Nested objects replace the root layout's, so repeat the shared Open Graph fields.
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale.replace("-", "_"),
    url: PATH,
    title: titleTemplate.replace("%s", meta.title),
    description: meta.description,
    images: [{ url: ogImage.src, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
  },
};

/** /kontakt — Kontakt (design 6ko desktop, mc mobile). */
export default function ContactPage() {
  return (
    <>
      <ContactJsonLd path={PATH} title={meta.title} />

      <section aria-labelledby="kontakt-title" className="mx-auto w-full max-w-[1180px] md:px-6">
        <div className="md:rounded-[24px] md:bg-sand md:px-10 md:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-10 lg:py-20 min-[73.75rem]:gap-14 min-[73.75rem]:px-14">
          <div className="flex flex-col gap-4 px-5 pt-6 pb-8 md:block md:p-0">
            <Eyebrow className="mb-[18px] max-md:hidden">{hero.eyebrow}</Eyebrow>
            <h1
              id="kontakt-title"
              className="text-[36px] leading-[1.08] font-semibold tracking-display text-ink md:mb-[22px] md:text-[52px] md:leading-[1.02] lg:text-[64px]"
            >
              {hero.title}
            </h1>
            <p className="text-[16px] leading-[1.7] text-muted md:mb-9 md:max-w-[42ch] md:text-[18px] md:leading-[1.75]">
              <span className="md:hidden">{hero.introShort}</span>
              <span className="max-md:hidden">{hero.intro}</span>
            </p>
            <ContactChannels channels={contactPage.channels} label={contactPage.channelsLabel} />
          </div>

          <ContactForm
            copy={contactPage.form}
            clinics={openClinics.map((c) => c.name)}
            titleId="kontakt-form-title"
            className="mx-3 md:mx-0 md:mt-10 lg:mt-0"
          />
        </div>
      </section>

      <VisitClinics
        title={contactPage.visit.title}
        clinics={clinics}
        clinicsHref={clinicsHref}
        titleId="kontakt-visit-title"
        className="max-md:hidden"
      />
    </>
  );
}
