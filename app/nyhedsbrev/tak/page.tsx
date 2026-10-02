import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { layoutCopy } from "@/content/layout";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/metadata";

const copy = layoutCopy.newsletterThanks;

export const metadata: Metadata = {
  ...pageMetadata({ title: copy.title, description: copy.text }, routes.newsletterThanks),
  robots: { index: false, follow: true },
};

/**
 * /nyhedsbrev/tak — thank-you page after the newsletter signup is sent WITHOUT JavaScript: the
 * form (components/ui/NewsletterForm, footer and /blog) posts to content/forms.ts →
 * newsletterNoJsAction (public/__nyhedsbrev-tilmeldt.html), Netlify Forms stores the signup and
 * serves that file, which forwards here. With JavaScript the form shows its success text in place.
 * Not in the design; styled like the /kontakt/tak panel, one centred column.
 * `data-newsletter-thanks` hides the footer's signup on this page (components/layout/FooterNewsletter).
 * Not in the sitemap (noindex).
 */
export default function NewsletterThanksPage() {
  return (
    <Container as="section" gutter="none" aria-labelledby="nyhedsbrev-tak-title" className="md:px-surface md:pb-fluid-64">
      <div
        data-newsletter-thanks=""
        className="flex flex-col items-start px-5 pt-6 pb-12 md:items-center md:rounded-[24px] md:bg-sand md:px-10 md:py-fluid-80 md:text-center"
      >
        <Eyebrow className="mb-[18px] max-md:hidden xl:mb-fluid-18">{copy.eyebrow}</Eyebrow>
        <h1
          id="nyhedsbrev-tak-title"
          className="font-heading text-[36px] leading-[1.08] tracking-display text-balance text-heading md:mb-[22px] md:text-[52px] md:leading-[1.02] md:tracking-hero lg:text-h1 xl:mb-fluid-22"
        >
          {copy.title}
        </h1>
        <p className="mt-4 text-[16px] leading-[1.7] text-pretty text-muted md:mt-0 md:max-w-[46ch] md:text-lead md:leading-[1.75]">
          {copy.text}
        </p>
        <div className="mt-8 flex w-full flex-col gap-2.5 md:mt-9 md:w-auto md:flex-row md:justify-center md:gap-3 xl:mt-fluid-36">
          <ButtonLink href={copy.primaryCta.href} size="md" mobileSize="lg" fullWidth="mobile">
            {copy.primaryCta.label}
          </ButtonLink>
          <ButtonLink href={copy.secondaryCta.href} variant="outline" size="md" mobileSize="lg" fullWidth="mobile">
            {copy.secondaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
