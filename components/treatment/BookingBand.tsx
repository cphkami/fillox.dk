import { ButtonLink, Container } from "@/components/ui";
import type { Link } from "@/content/types";

/**
 * Closing plum band "Klar til at booke?" with a powder button (6c/6bx: ink label,
 * 16×42 padding; mb: full-width 52px, plum label). Also used on /behandlinger.
 */
export function BookingBand({ id, title, text, cta }: { id: string; title: string; text: string; cta: Link }) {
  return (
    <Container as="section" id={id} gutter="surface" aria-labelledby={`${id}-title`} className="mt-surface">
      <div
        data-surface="plum"
        className="flex flex-col gap-3.5 rounded-[24px] bg-plum px-[22px] py-9 text-center md:block md:px-10 md:py-fluid-84 lg:px-14"
      >
        <h2
          id={`${id}-title`}
          className="text-[28px] leading-[1.15] font-semibold tracking-display text-cream md:mb-3.5 md:py-[.2em] md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {title}
        </h2>
        <p className="text-body leading-[1.7] text-blush md:mb-7 md:leading-normal">{text}</p>
        <ButtonLink
          href={cta.href}
          variant="lightInk"
          size="xl"
          mobileSize="lg"
          fullWidth="mobile"
          className="max-md:text-plum max-md:whitespace-normal"
        >
          {cta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}
