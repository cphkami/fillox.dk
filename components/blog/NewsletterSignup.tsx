import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { blogPage } from "@/content/pages/blog";
import { Responsive } from "./Responsive";

const copy = blogPage.newsletter;

/** The band appears once per page (the bottom of /blog), so its ids are fixed. */
const ids = { title: "blog-newsletter-title", text: "blog-newsletter-text" } as const;

/**
 * "Få tips og tilbud i din indbakke" band at the bottom of /blog (6blog: text left,
 * e-mail + "Tilmeld" right; mbl: stacked, full-width field and button). The form, its
 * validation and the Netlify Forms post are the shared `NewsletterForm` (components/ui), the
 * same one as in the footer.
 *
 * `data-newsletter-band` hides the footer's own signup on this page (components/layout/
 * FooterNewsletter), so /blog doesn't ask twice in a row.
 *
 * The design's pale rose band is the rose band here (`bg-band`, on-band text), not the
 * `secondary` beige: it sits directly above the beige footer, and the two beiges read as one
 * block. Rose over beige keeps the design's contrast between this band and the footer.
 */
export function NewsletterSignup() {
  return (
    <Container gutter="surface" className="md:mt-fluid-48">
      <section
        aria-labelledby={ids.title}
        data-surface="band"
        data-newsletter-band=""
        className="flex flex-col gap-3 rounded-[24px] bg-band px-5 py-7 md:gap-8 md:p-10 lg:grid lg:grid-cols-2 lg:items-center lg:gap-fluid-48 lg:px-14 lg:py-fluid-56 xl:px-fluid-64/80"
      >
        <div className="flex flex-col gap-3">
          <h2
            id={ids.title}
            className="font-heading text-[28px] leading-[1.15] tracking-display text-balance text-on-band md:text-[32px] xl:text-h2-sm"
          >
            <Responsive mobile={copy.titleShort} desktop={copy.title} />
          </h2>
          <p id={ids.text} className="text-body leading-[1.7] text-band-body md:leading-[1.75]">
            <Responsive mobile={copy.textShort} desktop={copy.text} />
          </p>
        </div>

        {/* In the band's flow at every width: the field, error and note are one block, centred on
            the text column from lg (6blog has no note), so the band's padding always holds them. */}
        <NewsletterForm copy={copy} tone="band" placement="blog" describedBy={ids.text} />
      </section>
    </Container>
  );
}
