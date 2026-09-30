import Link from "next/link";
import { ArrowLink } from "@/components/ui/ArrowLink";
import type { Link as LinkItem } from "@/content/types";
import { ui } from "@/content/ui";
import type { MenuClinic } from "./menuData";

/** Desktop "Find klinik" dropdown: open clinics with address + hours, coming-soon clinics with their note. */
export function ClinicsDropdown({
  clinics,
  allHref,
  onNavigate,
}: {
  clinics: MenuClinic[];
  allHref: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="w-[340px] rounded-[20px] bg-white p-3 shadow-menu">
      <ul className="flex flex-col">
        {clinics.map((c) => (
          <li key={c.slug}>
            <Link
              href={c.href}
              onClick={onNavigate}
              className="group block rounded-[14px] px-4 py-3 transition-colors hover:bg-cream"
            >
              <span className="block text-[15px] font-semibold text-ink transition-colors group-hover:text-plum">
                {c.name}
              </span>
              {c.comingSoon ? (
                <span className="mt-1 block text-[12px] tracking-[2px] text-plum uppercase">{c.openingNote}</span>
              ) : (
                <>
                  <span className="mt-0.5 block text-[14px] leading-[1.6] text-muted">{c.address.join(", ")}</span>
                  <span className="block text-[13px] leading-[1.6] text-plum">{c.hours.join(" · ")}</span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-1 mt-2 border-t border-line px-3 pt-3.5 pb-1.5">
        <ArrowLink href={allHref} onClick={onNavigate}>
          {ui.seeAllClinics}
        </ArrowLink>
      </div>
    </div>
  );
}

/** Small desktop dropdown with a list of links (e.g. "Om os"). */
export function LinksDropdown({ items, onNavigate }: { items: LinkItem[]; onNavigate?: () => void }) {
  return (
    <div className="min-w-[230px] rounded-[20px] bg-white p-2 shadow-menu">
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className="block rounded-[12px] px-4 py-2.5 text-[14px] whitespace-nowrap text-ink transition-colors hover:bg-cream hover:text-plum"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
