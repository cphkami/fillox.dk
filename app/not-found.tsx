import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { site } from "@/config/site";
import { layoutCopy } from "@/content/layout";
import { ui } from "@/content/ui";

const copy = layoutCopy.notFound;

export const metadata: Metadata = {
  title: copy.metaTitle,
};

/** 404 page, rendered inside the root layout (header + footer). */
export default function NotFound() {
  return (
    <Container as="section" gutter="surface" aria-labelledby="not-found-title">
      <div className="rounded-[24px] bg-sand px-[22px] py-16 text-center md:px-14 md:py-28">
        <Eyebrow>{copy.eyebrow}</Eyebrow>
        <h1
          id="not-found-title"
          className="mt-4 text-[36px] leading-[1.08] font-semibold tracking-display md:mt-5 md:text-[64px] md:leading-[1.02] md:tracking-hero"
        >
          {copy.title}
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-[16px] leading-[1.7] text-muted md:mt-6 md:text-[18px] md:leading-[1.75]">
          {copy.text}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 md:mt-9 md:flex-row md:gap-[18px]">
          <ButtonLink href={site.booking.href} size="md" mobileSize="lg" fullWidth="mobile">
            {ui.bookCta}
          </ButtonLink>
          <ButtonLink href="/" variant="textLink">
            {copy.homeCta}
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
