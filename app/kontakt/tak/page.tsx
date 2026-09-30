import type { Metadata } from "next";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { contactPage } from "@/content/pages/contact";

const CONTACT_PATH = "/kontakt";
const { hero, form } = contactPage;

export const metadata: Metadata = {
  title: form.success.title,
  description: form.success.text,
  alternates: { canonical: `${CONTACT_PATH}/tak` },
  robots: { index: false, follow: true },
};

/**
 * /kontakt/tak — thank-you page after the contact form is sent WITHOUT JavaScript: the form
 * posts to `form.noJsAction` (public/__kontakt-sendt.html), Netlify Forms stores it and serves
 * that file, which forwards here. With JavaScript the form shows the same text in place.
 * Not in the design; styled like the /kontakt hero panel. Not in the sitemap (noindex).
 */
export default function ContactThanksPage() {
  return (
    <section aria-labelledby="kontakt-tak-title" className="mx-auto w-full max-w-[1180px] md:px-6 md:pb-16">
      <div className="px-5 pt-6 pb-12 md:rounded-[24px] md:bg-sand md:px-10 md:py-14 lg:px-14 lg:py-20">
        <Eyebrow className="mb-[18px] max-md:hidden">{hero.eyebrow}</Eyebrow>
        <h1
          id="kontakt-tak-title"
          className="text-[36px] leading-[1.08] font-semibold tracking-display text-ink md:mb-[22px] md:text-[52px] md:leading-[1.02] lg:text-[64px]"
        >
          {form.success.title}
        </h1>
        <p className="mt-4 text-[16px] leading-[1.7] text-muted md:mt-0 md:max-w-[42ch] md:text-[18px] md:leading-[1.75]">
          {form.success.text}
        </p>
        <ButtonLink href={CONTACT_PATH} size="md" mobileSize="lg" fullWidth="mobile" className="mt-8 md:mt-9">
          {form.success.again}
        </ButtonLink>
      </div>
    </section>
  );
}
