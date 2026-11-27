import { practitionerPage } from "@/content/pages/practitioner";
import type { ContactLink } from "@/content/team";
import { cn } from "@/lib/cn";

type ContactLinksProps = {
  /** The practitioner's short name: names the list for screen readers ("Kontakt Alberte"). */
  name: string;
  /** content/team.ts → contactLinks(member): e-mail and Instagram, in that order. */
  links: ContactLink[];
  className?: string;
};

/**
 * A practitioner's work contact (Alberte, 2026-11-26): the e-mail address (mailto:) and the
 * Instagram handle, side by side and wrapping. In the profile hero under the buttons, and at the
 * bottom of the card of a member without a profile page (/om-os, /behandlere).
 *
 * Each link has its label above it in the fact cards' label style (uppercase micro, accent, bold,
 * +2px), and the link is the site's text link (ink over a 1px plum underline, accent on hover,
 * Button `textLink`). The link text keeps its line height; an invisible hit area (10px above and
 * below, as the hero's "Se behandlinger ↓") makes it a 44px target. It reaches up over the label,
 * which is not interactive, and the items are 32px apart, so two targets never overlap. A long
 * address may break anywhere rather than overflow a narrow card. Renders nothing without links
 * (Dr. Tom).
 */
export function ContactLinks({ name, links, className }: ContactLinksProps) {
  if (!links.length) return null;
  const copy = practitionerPage.contact;
  return (
    <ul aria-label={copy.label(name)} className={cn("flex flex-wrap gap-x-8 gap-y-4", className)}>
      {links.map((link) => (
        <li key={link.kind} className="flex min-w-0 flex-col gap-1.5">
          <span className="text-micro leading-[1.5] font-bold tracking-[2px] text-accent uppercase">{copy.kinds[link.kind]}</span>
          <a
            href={link.href}
            className={cn(
              "relative self-start border-b border-rule-strong pb-[3px] text-[15px] leading-[1.5] text-ink [overflow-wrap:anywhere] transition-colors",
              "hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent md:text-ui-sm",
              "after:absolute after:-inset-x-1 after:-inset-y-2.5",
            )}
          >
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
