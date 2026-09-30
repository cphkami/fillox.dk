import type { Metadata } from "next";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { contactPage } from "@/content/pages/contact";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/metadata";

const { hero, form } = contactPage;

export const metadata: Metadata = {
  ...pageMetadata({ title: form.success.title, description: form.success.text }, routes.contactThanks),
  robots: { index: false, follow: true },
};

/**
 * /kontakt/tak — thank-you page after the contact form is sent WITHOUT JavaScript: the form
 * posts to `form.noJsAction` (public/__kontakt-sendt.html), Netlify Forms stores it and serves
 * that file, which forwards here. With JavaScript the form shows the same text in place.
 * Not in the design; styled like the /kontakt hero panel. From lg the panel is two columns
 * like /kontakt: the text on the left, the contact cards on the right (as with JavaScript,
 * where the success text replaces the form next to the cards). Below lg the cards stack
 * under the text, as on /kontakt (mc).
 * Not in the sitemap (noindex).
 */
export default function ContactThanksPage() {
  return (
    <Container as="section" gutter="none" aria-labelledby="kontakt-tak-title" className="md:px-surface md:pb-fluid-64">
      <div className="px-5 pt-6 pb-12 md:rounded-[24px] md:bg-sand md:px-10 md:py-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:py-fluid-80 min-[73.75rem]:gap-fluid-56 min-[73.75rem]:px-14 xl:px-16 2xl:px-20">
        <div>
          <Eyebrow className="mb-[18px] max-md:hidden">{hero.eyebrow}</Eyebrow>
          <h1
            id="kontakt-tak-title"
            className="text-[36px] leading-[1.08] font-semibold tracking-display text-balance text-ink md:mb-[22px] md:text-[52px] md:leading-[1.02] lg:text-h1"
          >
            {form.success.title}
          </h1>
          <p className="mt-4 text-[16px] leading-[1.7] text-muted md:mt-0 md:max-w-[42ch] md:text-lead md:leading-[1.75]">
            {form.success.text}
          </p>
          <ButtonLink href={routes.contact} size="md" mobileSize="lg" fullWidth="mobile" className="mt-8 md:mt-9">
            {form.success.again}
          </ButtonLink>
        </div>
        <div className="mt-10 lg:mt-0">
          <ContactChannels channels={contactPage.channels} label={contactPage.channelsLabel} />
        </div>
      </div>
    </Container>
  );
}
