import Link from "next/link";
import type { ReactNode } from "react";
import { ResponsiveText } from "@/components/ui";
import type { ContactChannel } from "@/content/pages/contact";
import { cn } from "@/lib/cn";

function ChannelCard({ href, className, children }: { href?: string; className: string; children: ReactNode }) {
  // No href: an information card (no link, no arrow). tel:/mailto: are plain anchors;
  // internal pages go through next/link.
  if (!href) return <div className={className}>{children}</div>;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

type ContactChannelsProps = {
  channels: ContactChannel[];
  label: string;
};

/**
 * The three contact cards (phone, e-mail, on-call doctor). Desktop (6ko): label + value
 * on the left, a note on the right, the on-call card on the rose band (`bg-band`, the
 * design's dark accent card). Mobile (mc): large tap targets with an arrow circle, the on-call card
 * in sand. A card without `href` is not a link and has no arrow (none today: the on-call card
 * calls the akut number, 35 10 00 50). The value is a card title: Poppins 500 (`font-heading`),
 * espresso on the white cards, on-band on the rose card, accent on mobile (as in mc).
 */
export function ContactChannels({ channels, label }: ContactChannelsProps) {
  return (
    <ul aria-label={label} className="flex flex-col gap-4 md:gap-3 xl:gap-fluid-12">
      {channels.map((channel) => {
        const accent = channel.tone === "accent";
        const linked = !!channel.href;
        return (
          <li key={channel.id} data-surface={accent ? "band" : undefined}>
            <ChannelCard
              href={channel.href}
              className={cn(
                "group relative flex items-center justify-between gap-4 rounded-[20px] px-5 py-[18px] transition-colors md:flex-wrap md:gap-y-1 md:px-7 md:py-[22px] xl:px-fluid-28 xl:py-fluid-22",
                accent ? "bg-sand md:bg-band" : "bg-white",
                // Hover: the band a shade deeper (8% on-band mixed in; the band text stays ≥ 5:1).
                accent && linked && "md:hover:bg-[color-mix(in_oklab,var(--color-band)_92%,var(--color-on-band))]",
              )}
            >
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-micro font-semibold tracking-[1.5px] text-muted uppercase md:mb-1.5 md:font-bold md:tracking-[2px]",
                    accent ? "md:text-band-accent" : "md:text-accent",
                  )}
                >
                  <ResponsiveText mobile={channel.labelShort} desktop={channel.label} />
                </span>
                <span
                  className={cn(
                    "mt-0.5 block font-heading text-[19px] break-words text-accent md:mt-0 md:text-h3 md:tracking-display",
                    accent ? "md:text-on-band" : "md:text-heading",
                    !accent && linked && "md:group-hover:text-accent",
                  )}
                >
                  <ResponsiveText mobile={channel.valueShort} desktop={channel.value} />
                </span>
              </span>
              {/* Mobile shows an arrow instead of the note; screen readers still get the note.
                  text-small: 14px as in the design, 15px at 1600+ where the card is wide. */}
              <span className={cn("shrink-0 text-right text-small max-md:sr-only", accent ? "text-band-body" : "text-muted")}>
                {channel.note}
              </span>
              {linked ? (
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-sand text-accent md:hidden"
                >
                  →
                </span>
              ) : null}
            </ChannelCard>
          </li>
        );
      })}
    </ul>
  );
}
