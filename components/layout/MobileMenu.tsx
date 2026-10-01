"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { HoursSummary } from "@/components/ui/HoursSummary";
import { JoinedLines } from "@/components/ui/JoinedLines";
import { TrustpilotRating } from "@/components/ui/TrustpilotRating";
import { site } from "@/config/site";
import type { NavItem } from "@/content/types";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";
import type { HeaderData } from "./menuData";
import { useAriaCurrent } from "./NavLink";

type MobileMenuProps = Pick<HeaderData, "categories" | "clinics"> & {
  items: NavItem[];
  navLabel: string;
  homeLabel: string;
};

type Section = "treatments" | "clinics" | string;

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Row style for a top-level item (60px + 1px line separator, as in the design). */
function rowClasses(expanded = false) {
  return cn(
    "flex min-h-[61px] w-full items-center justify-between border-b border-line text-left text-[18px] transition-colors",
    expanded ? "font-semibold text-plum" : "font-medium text-ink",
  );
}

/**
 * Burger button + fullscreen mobile menu (< 1024px; designs mm1/mm2/mm3).
 * Accordions for Behandlinger / Find klinik / Om os, a sliding level 2 per
 * treatment category, and a fixed "Book tid" + Trustpilot footer.
 */
export function MobileMenu({ items, categories, clinics, navLabel, homeLabel }: MobileMenuProps) {
  const pathname = usePathname();
  const ariaCurrent = useAriaCurrent();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Section | null>("treatments");
  const [level2, setLevel2] = useState(false);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef(false);
  const wasOpen = useRef(false);
  const id = useId();

  // Close on navigation (adjusting state during render, per React docs).
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // While open: lock page scroll, move focus into the menu, trap Tab / handle Escape at the
  // document level (so it still works after a click on a non-focusable area of the menu),
  // and close when resized to desktop.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    /** Visible, non-inert focusables inside the dialog, in DOM order. */
    const trapNodes = () =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => !el.closest("[inert]") && !el.closest("[hidden]"),
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        restoreFocus.current = true;
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = trapNodes();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const index = active ? nodes.indexOf(active) : -1;
      if (index === -1) {
        // Focus is on the dialog itself, on <body> or somewhere else: wrap into the trap.
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      } else if (e.shiftKey && index === 0) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && index === nodes.length - 1) {
        e.preventDefault();
        first.focus();
      }
    };

    // Focus that escapes the dialog (e.g. assistive tech) is pulled back in.
    const onFocusIn = (e: FocusEvent) => {
      const dialog = dialogRef.current;
      if (dialog && e.target instanceof Node && !dialog.contains(e.target)) trapNodes()[0]?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  // Return focus to the burger when the menu was closed by the user (not by navigating).
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (wasOpen.current) {
      wasOpen.current = false;
      if (restoreFocus.current) burgerRef.current?.focus();
    }
  }, [open]);

  const openMenu = () => {
    setExpanded("treatments");
    setLevel2(false);
    setCategorySlug(null);
    restoreFocus.current = false;
    setOpen(true);
  };

  const closeMenu = () => {
    restoreFocus.current = true;
    setOpen(false);
  };

  /** Links inside the menu: close without stealing focus back to the burger. */
  const onNavigate = () => {
    restoreFocus.current = false;
    setOpen(false);
  };

  const toggle = (section: Section) => setExpanded((cur) => (cur === section ? null : section));

  const showCategory = (slug: string) => {
    setCategorySlug(slug);
    setLevel2(true);
    requestAnimationFrame(() => backRef.current?.focus());
  };

  const hideCategory = () => {
    setLevel2(false);
    const slug = categorySlug;
    requestAnimationFrame(() =>
      dialogRef.current?.querySelector<HTMLElement>(`[data-category-trigger="${slug}"]`)?.focus(),
    );
  };

  const category = categories.find((c) => c.slug === categorySlug);
  const treatmentsItem = items.find((i) => i.kind === "treatments");
  const dialogId = `${id}-menu`;

  return (
    <>
      <button
        ref={burgerRef}
        type="button"
        aria-label={ui.openMenu}
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={openMenu}
        className="flex size-11 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-full bg-sand"
      >
        <span className="h-0.5 w-[18px] rounded-[2px] bg-ink" />
        <span className="h-0.5 w-[18px] rounded-[2px] bg-ink" />
        <span className="h-0.5 w-[18px] rounded-[2px] bg-ink" />
      </button>

      {open ? (
        <div
          ref={dialogRef}
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-label={ui.menu}
          tabIndex={-1}
          className="fixed inset-0 z-[70] flex animate-fade-in flex-col bg-cream outline-none lg:hidden"
        >
          {/* Top bar: logo + round close button */}
          <div className="flex items-center justify-between px-5 py-3.5 md:px-10">
            <Link
              href="/"
              aria-label={homeLabel}
              onClick={onNavigate}
              // White plate behind the dark logo in Windows high contrast (dark canvas), as in the header.
              className="flex min-h-11 items-center rounded-sm forced-colors:bg-white forced-colors:outline-[color:CanvasText] forced-colors:forced-color-adjust-none"
            >
              <Image
                src={site.brand.logoDark}
                alt=""
                width={site.brand.logoWidth}
                height={site.brand.logoHeight}
                className="h-[22px] w-auto"
              />
            </Link>
            <button
              ref={closeRef}
              type="button"
              aria-label={ui.closeMenu}
              onClick={closeMenu}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-sand text-[20px] text-ink"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>

          {/* Levels: level 1 (accordions) and level 2 (category) slide horizontally */}
          <div className="relative flex-1 overflow-hidden">
            <nav
              aria-label={navLabel}
              inert={level2}
              className={cn(
                "absolute inset-0 overflow-y-auto overscroll-contain px-5 pt-1 pb-6 transition-transform duration-300 ease-out md:px-10",
                level2 ? "-translate-x-full" : "translate-x-0",
              )}
            >
              <ul>
                {items.map((item) => {
                  // Priser has a desktop dropdown but is a plain row in the mobile menu (design mm1).
                  if (item.kind === "link" || item.kind === "prices") {
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          aria-current={ariaCurrent(item.href)}
                          className={rowClasses()}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }
                  const section: Section = item.kind === "menu" ? `menu-${item.href}` : item.kind;
                  const isOpen = expanded === section;
                  const panelId = `${id}-${section}`;
                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggle(section)}
                        className={cn(rowClasses(isOpen), "cursor-pointer")}
                      >
                        <span>{item.label}</span>
                        <span aria-hidden="true" className={cn("text-[22px]", isOpen ? "text-plum" : "text-muted")}>
                          {isOpen ? "–" : "+"}
                        </span>
                      </button>

                      {item.kind === "treatments" ? (
                        <div id={panelId} hidden={!isOpen} className="border-b border-line pt-1.5 pb-2.5 pl-1">
                          <ul>
                            {categories.map((c) => (
                              <li key={c.slug}>
                                <button
                                  type="button"
                                  data-category-trigger={c.slug}
                                  onClick={() => showCategory(c.slug)}
                                  className="flex min-h-[46px] w-full cursor-pointer items-center justify-between text-left text-[16px] text-ink"
                                >
                                  <span>{c.label}</span>
                                  <span aria-hidden="true" className="text-muted">
                                    ›
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                          <Link
                            href={item.href}
                            onClick={onNavigate}
                            aria-current={ariaCurrent(item.href)}
                            className="flex min-h-[46px] items-center text-[15px] font-semibold text-plum"
                          >
                            {ui.seeAllTreatments}&nbsp;<span aria-hidden="true">→</span>
                          </Link>
                        </div>
                      ) : null}

                      {item.kind === "clinics" ? (
                        <ul id={panelId} hidden={!isOpen} className="border-b border-line pt-1 pb-2">
                          {clinics.map((c) => (
                            <li key={c.slug} className="flex items-start justify-between gap-3 py-2">
                              <div className="text-[14px] leading-[1.55] text-muted">
                                <Link
                                  href={c.href}
                                  onClick={onNavigate}
                                  aria-current={ariaCurrent(c.href)}
                                  className="block text-[16px] font-semibold text-ink"
                                >
                                  {c.name}
                                </Link>
                                {c.comingSoon ? (
                                  <span className="font-semibold text-plum">{c.openingNote}</span>
                                ) : (
                                  <>
                                    {/* Lines break only between the address lines and the hours parts. */}
                                    <JoinedLines parts={c.address} separator=", " />
                                    <HoursSummary as="span" parts={c.hours} />
                                  </>
                                )}
                              </div>
                              {c.comingSoon ? null : (
                                <Link
                                  href={c.bookingHref}
                                  onClick={onNavigate}
                                  aria-label={`${ui.bookAt} ${c.name}`}
                                  className="relative pt-0.5 text-[14px] font-semibold whitespace-nowrap text-plum after:absolute after:-inset-3"
                                >
                                  {ui.book}&nbsp;<span aria-hidden="true">→</span>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {item.kind === "menu" ? (
                        <ul id={panelId} hidden={!isOpen} className="border-b border-line pt-1.5 pb-2.5 pl-1">
                          {item.items.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={onNavigate}
                                aria-current={ariaCurrent(sub.href)}
                                className="flex min-h-[46px] items-center text-[16px] text-ink"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div
              inert={!level2}
              className={cn(
                "absolute inset-0 overflow-y-auto overscroll-contain px-5 pt-1 pb-6 transition-transform duration-300 ease-out md:px-10",
                level2 ? "translate-x-0" : "translate-x-full",
              )}
            >
              {category ? (
                <>
                  <button
                    ref={backRef}
                    type="button"
                    onClick={hideCategory}
                    aria-label={`${ui.back}: ${treatmentsItem?.label ?? ""}`}
                    className="flex min-h-12 cursor-pointer items-center text-[15px] text-muted"
                  >
                    <span aria-hidden="true">‹&nbsp;</span>
                    {treatmentsItem?.label}
                  </button>
                  <h2 className="mt-1 mb-3 text-[28px] font-semibold tracking-display">{category.name}</h2>
                  <ul>
                    {category.treatments.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={t.href}
                          onClick={onNavigate}
                          aria-current={ariaCurrent(t.href)}
                          className="flex min-h-[61px] items-center justify-between gap-3 border-b border-line"
                        >
                          <span className="text-[17px] font-medium">{t.mobileName}</span>
                          <span className="text-[14px] whitespace-nowrap text-muted">
                            {t.price}&nbsp;<span aria-hidden="true">›</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={category.href}
                    onClick={onNavigate}
                    aria-current={ariaCurrent(category.href)}
                    className="flex min-h-14 items-center text-[15px] font-semibold text-plum"
                  >
                    {category.allLabel}&nbsp;<span aria-hidden="true">→</span>
                  </Link>
                </>
              ) : null}
            </div>
          </div>

          {/* Fixed bottom: Book tid + Trustpilot */}
          <div className="flex flex-col gap-2.5 border-t border-line px-5 pt-3.5 pb-[max(16px,env(safe-area-inset-bottom))] md:px-10">
            <ButtonLink href={site.booking.href} size="lg" fullWidth onClick={onNavigate}>
              {ui.bookCta}
            </ButtonLink>
            <TrustpilotRating size="sm" className="justify-center" />
          </div>
        </div>
      ) : null}
    </>
  );
}
