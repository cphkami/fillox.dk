import type { Metadata } from "next";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactJsonLd } from "@/components/contact/ContactJsonLd";
import { VisitClinics } from "@/components/contact/VisitClinics";
import { Container, Eyebrow, ResponsiveText } from "@/components/ui";
import { clinics, openClinics } from "@/content/clinics";
import { contactPage } from "@/content/pages/contact";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/metadata";

const PATH = routes.contact;
const { meta, hero } = contactPage;
const clinicsHref = routes.clinics;

export const metadata: Metadata = pageMetadata(meta, PATH);

/** /kontakt — Kontakt (design 6ko desktop, mc mobile). */
export default function ContactPage() {
  return (
    <>
      <ContactJsonLd path={PATH} title={meta.title} />

      {/* Mobile (mc) has no sand panel: the section is full-bleed and the text sets its own gutter. */}
      <Container as="section" gutter="none" aria-labelledby="kontakt-title" className="md:px-surface">
        <div className="md:rounded-[24px] md:bg-sand md:px-10 md:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-10 lg:py-fluid-80 min-[73.75rem]:gap-fluid-56 min-[73.75rem]:px-14 xl:px-16 2xl:px-20">
          <div className="flex flex-col gap-4 px-5 pt-6 pb-8 md:block md:p-0">
            <Eyebrow className="mb-[18px] max-md:hidden xl:mb-fluid-18">{hero.eyebrow}</Eyebrow>
            <h1
              id="kontakt-title"
              className="text-[36px] leading-[1.08] font-semibold tracking-display text-ink md:mb-[22px] md:text-[52px] md:leading-[1.02] lg:text-h1 xl:mb-fluid-22"
            >
              {hero.title}
            </h1>
            <p className="text-[16px] leading-[1.7] text-muted md:mb-9 md:max-w-[42ch] md:text-lead md:leading-[1.75] xl:mb-fluid-36">
              <ResponsiveText mobile={hero.introShort} desktop={hero.intro} />
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
      </Container>

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
