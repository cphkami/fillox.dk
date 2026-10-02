import { ButtonLink, Container } from "@/components/ui";
import type { Link } from "@/content/types";

/**
 * Closing band "Klar til at booke?" (6c/6bx: 16×42 button; mb: full-width 52px button). Also used
 * on /behandlinger. A rose band with the primary (accent) button, as on every band ("Støvet rosa &
 * beige"; the design's dark band had a light pill).
 */
export function BookingBand({ id, title, text, cta }: { id: string; title: string; text: string; cta: Link }) {
  return (
    <Container as="section" id={id} gutter="surface" aria-labelledby={`${id}-title`} className="mt-surface leading-[1.5]">
      <div
        data-surface="band"
        className="flex flex-col gap-3.5 rounded-[24px] bg-band px-[22px] py-9 text-center md:block md:px-10 md:py-fluid-84 lg:px-14"
      >
        <h2
          id={`${id}-title`}
          className="font-heading text-[28px] leading-[1.15] tracking-display text-on-band md:mb-3.5 md:py-[.2em] md:text-[40px] md:leading-[1.1] xl:text-h2"
        >
          {title}
        </h2>
        <p className="text-body leading-[1.7] text-band-body md:mb-7 md:leading-[1.5]">{text}</p>
        <ButtonLink
          href={cta.href}
          size="xl"
          mobileSize="lg"
          fullWidth="mobile"
          className="max-md:whitespace-normal"
        >
          {cta.label}
        </ButtonLink>
      </div>
    </Container>
  );
}
