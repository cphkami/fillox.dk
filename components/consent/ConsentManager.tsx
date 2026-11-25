"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useSyncExternalStore, type KeyboardEvent, type Ref } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui";
import { consentCopy as copy } from "@/content/consent";
import { consentCategories, fullConsent, noConsent, type ConsentCategory } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { consentStore, type ConsentView } from "./consentStore";

/** Side padding of the banner's buttons (the pill's own 30px is too wide for three in a row). */
const buttonPadding = "px-4! xl:px-fluid-16!";

const linkClasses =
  "font-medium text-accent underline decoration-rule-strong underline-offset-[3px] transition-colors hover:decoration-accent";

/**
 * Cookie banner (no third-party library). Mounted once in app/layout.tsx, right after the skip
 * link, so it is the next tab stop on every page while it is open.
 *
 * Accessibility pattern: a NON-MODAL labelled region (`<section aria-labelledby>`, a region
 * landmark), not a dialog. The page stays usable while it is open (no cookie wall, no focus
 * trap, no inert background), and WAI-ARIA's dialog pattern is meant for modal dialogs. It opens
 * without taking focus on a first visit (screen readers meet it in reading order, keyboard users
 * one Tab after the skip link); reopened from the footer ("Cookieindstillinger") it takes focus,
 * Escape closes it without a change and focus returns to the button.
 *
 * - First layer: "Accepter alle" and "Afvis alle" (same component, variant, size and row: equal
 *   prominence, as Datatilsynet requires) and "Tilpas" (outline): below them under 768px, third in
 *   the row from 768px.
 * - "Tilpas": one switch per optional category (native checkbox with role="switch"), none on in
 *   advance, plus the same two buttons and "Gem valg".
 * - Fixed at the bottom (no layout shift; server HTML has no banner). Below 768px it sits above
 *   the fixed book bar of treatment pages while the bar is shown; on every page it reserves its
 *   height at the end of the page and as scroll padding, so nothing (the footer, the Gecko
 *   calendar's controls, a focused field) has to stay under it. The reserve also raises <body>'s
 *   min-height (app/layout.tsx), so on a page shorter than the viewport the footer stays put.
 * - Stacking: z-45, above the page and the mobile book bar (z-40) but below the sticky header
 *   (z-50), whose mobile menu and dropdown panels must cover the banner while they are open.
 * - Focus after a choice: back to the footer button that reopened it; otherwise, when focus was
 *   in the banner, to <main> (tabIndex -1), so keyboard and screen-reader users continue in the
 *   page instead of at <body>.
 * - 44px targets (buttons 50px, switch rows 44px), the site's focus ring, AA contrast, no motion
 *   with prefers-reduced-motion (globals.css), usable from 320px (one button per row below 360px;
 *   the card scrolls inside when the viewport is short).
 */
export function ConsentManager() {
  const state = useSyncExternalStore(consentStore.subscribe, consentStore.getSnapshot, consentStore.getServerSnapshot);
  const { open, view, current, draft, reopened } = state;
  const sectionRef = useRef<HTMLElement>(null);
  const firstSwitchRef = useRef<HTMLInputElement>(null);
  const previous = useRef<{ open: boolean; view: ConsentView }>({ open: false, view: "main" });
  /** Focus was inside the banner when it closed (it unmounts, so focus would fall to <body>). */
  const hadFocus = useRef(false);
  const ids = useId();
  const titleId = `${ids}-title`;

  useEffect(() => consentStore.init(), []);

  /** Runs a store action that may close the banner, noting first whether focus is inside it. */
  const closing = (action: () => void) => {
    hadFocus.current = Boolean(sectionRef.current?.contains(document.activeElement));
    action();
  };

  // Focus: into the banner when the footer reopens it, to the first switch on "Tilpas", and
  // back to the footer button when it closes (or to <main>, when focus was in the banner and no
  // button opened it: a first-visit choice).
  useEffect(() => {
    const was = previous.current;
    previous.current = { open, view };
    if (open && !was.open) {
      if (reopened) sectionRef.current?.focus();
    } else if (open && view === "settings" && was.view === "main") {
      firstSwitchRef.current?.focus();
    } else if (!open && was.open) {
      const opener = consentStore.takeOpener();
      if (opener?.isConnected) opener.focus();
      else if (hadFocus.current) document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
      hadFocus.current = false;
    }
  }, [open, view, reopened]);

  // Reserve the banner's height (plus 8px) while it is open: as scroll padding (a focused element
  // is scrolled clear of it) and as a spacer after the footer (the end of the page can be scrolled
  // above it). Measured from its top edge, so the book bar under it is included.
  useEffect(() => {
    const section = sectionRef.current;
    if (!open || !section) return;
    const root = document.documentElement;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const reserve = Math.max(0, Math.ceil(window.innerHeight - section.getBoundingClientRect().top + 8));
      root.style.setProperty("--consent-reserve", `${reserve}px`);
      root.style.scrollPaddingBottom = `${reserve}px`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    window.addEventListener("resize", schedule);
    // The book bar slides away near the end of treatment pages, and the banner moves down with it.
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      root.style.removeProperty("--consent-reserve");
      root.style.removeProperty("scroll-padding-bottom");
    };
  }, [open]);

  if (!open) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && current) {
      event.stopPropagation();
      closing(() => consentStore.close());
    }
  };

  const privacyLink = (
    <Link href={copy.privacyLink.href} className={linkClasses}>
      {copy.privacyLink.label}
    </Link>
  );

  return (
    <>
      <section
        ref={sectionRef}
        aria-labelledby={titleId}
        tabIndex={-1}
        data-consent-banner=""
        onKeyDown={onKeyDown}
        className={cn(
          // Below 768px: the surface margin on both sides, 10px (or the safe area) above the bottom.
          // z-45: below the header (z-50), whose menus must cover the banner; above the book bar (z-40).
          "fixed inset-x-surface bottom-[max(10px,env(safe-area-inset-bottom))] z-[45] max-h-[calc(100dvh-162px)] overflow-y-auto overscroll-contain",
          "rounded-[20px] border border-line bg-white p-5 text-body text-ink shadow-float motion-safe:animate-fade-in",
          // Above the treatment pages' book bar (64px + 8px gap) while it is shown (not inert).
          "max-md:[html:has([data-mobile-book-bar]:not([inert]))_&]:bottom-[calc(max(10px,env(safe-area-inset-bottom))+72px)]",
          // From 768px: a card on the canvas's left surface margin, 30em wide (480 → 540px with the type scale).
          "md:right-auto md:bottom-6 md:left-[max(var(--gutter-surface),calc((100vw-var(--canvas-max))/2+var(--gutter-surface)))] md:max-h-[calc(100dvh-140px)] md:w-[30em] md:max-w-[calc(100vw-2*var(--gutter-surface))] md:p-6 xl:p-fluid-24/28",
        )}
      >
        <h2
          id={titleId}
          className={cn(
            "font-heading text-[20px] leading-[1.2] tracking-display text-balance text-heading md:text-h4",
            current && "pr-12",
          )}
        >
          {copy.title}
        </h2>

        {current ? (
          <button
            type="button"
            aria-label={copy.close}
            onClick={() => closing(() => consentStore.close())}
            className="absolute top-3 right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-sand text-[18px] text-ink hover:bg-secondary focus-visible:bg-secondary md:top-4 md:right-4"
          >
            <span aria-hidden="true">✕</span>
          </button>
        ) : null}

        {view === "main" ? (
          <p className="mt-3 leading-[1.6] text-pretty text-muted">
            {copy.text} {privacyLink}
          </p>
        ) : (
          <fieldset className="mt-3">
            <legend className="leading-[1.6] text-muted">{copy.settings.legend}</legend>
            <ul className="mt-2">
              <li className="py-3">
                <div className="flex min-h-11 items-center justify-between gap-4">
                  <span className="font-semibold text-heading">{copy.categories.necessary.name}</span>
                  <span className="text-small font-semibold text-accent">{copy.settings.alwaysOn}</span>
                </div>
                <p className="text-small leading-[1.55] text-muted">{copy.categories.necessary.purpose}</p>
              </li>
              {consentCategories.map((category) => (
                <SwitchRow
                  key={category}
                  id={`${ids}-${category}`}
                  category={category}
                  checked={draft[category]}
                  inputRef={category === consentCategories[0] ? firstSwitchRef : undefined}
                />
              ))}
            </ul>
            <p className="mt-1 text-small">{privacyLink}</p>
          </fieldset>
        )}

        {/* Accept and reject: same component, variant, size and row (equal prominence); "Tilpas" /
            "Gem valg" (outline) below them below 768px, third in the row from 768px. One button per
            row below 360px. The 16px side padding (fluid from 1280) lets three fit the 30em card. */}
        <div className="mt-4 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 md:mt-5 md:grid-cols-3 md:gap-3">
          <Button size="mdTight" className={buttonPadding} onClick={() => closing(() => consentStore.choose(fullConsent))}>
            {copy.acceptAll}
          </Button>
          <Button size="mdTight" className={buttonPadding} onClick={() => closing(() => consentStore.choose(noConsent))}>
            {copy.rejectAll}
          </Button>
          {view === "main" ? (
            <Button
              variant="outline"
              size="mdTight"
              className={cn(buttonPadding, "col-span-full md:col-span-1")}
              onClick={() => consentStore.showSettings()}
            >
              {copy.customize}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="mdTight"
              className={cn(buttonPadding, "col-span-full md:col-span-1")}
              onClick={() => closing(() => consentStore.choose(draft))}
            >
              {copy.settings.save}
            </Button>
          )}
        </div>
      </section>
      {/* Space after the footer, so the end of the page can be scrolled above the banner. */}
      {createPortal(
        <div aria-hidden="true" data-consent-spacer="" className="h-(--consent-reserve) shrink-0" />,
        document.body,
      )}
    </>
  );
}

/**
 * One optional category: the name is the switch's label (the whole 44px row is its hit area),
 * the purpose its description. The visual track is decorative; state is the native checkbox.
 */
function SwitchRow({
  id,
  category,
  checked,
  inputRef,
}: {
  id: string;
  category: ConsentCategory;
  checked: boolean;
  inputRef?: Ref<HTMLInputElement>;
}) {
  const text = copy.categories[category];
  return (
    <li className="border-t border-line py-3">
      <div className="relative flex min-h-11 items-center justify-between gap-4">
        <label htmlFor={id} className="cursor-pointer font-semibold text-heading after:absolute after:inset-0">
          {text.name}
        </label>
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(event) => consentStore.toggle(category, event.target.checked)}
          aria-describedby={`${id}-purpose`}
          className="peer sr-only"
        />
        {/* Track 4.2:1 (off, `field`) / 9.2:1 (on, accent) against the white card; white knob. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none relative flex h-7 w-12 shrink-0 items-center rounded-full bg-field p-1 transition-colors",
            "peer-checked:bg-accent peer-checked:[&>span]:translate-x-5",
            "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-accent peer-focus-visible:outline-solid",
            "forced-colors:border forced-colors:border-[CanvasText] forced-colors:bg-[Canvas] forced-colors:forced-color-adjust-none forced-colors:peer-checked:bg-[Highlight]",
          )}
        >
          <span className="size-5 rounded-full bg-white transition-transform forced-colors:bg-[CanvasText]" />
        </span>
      </div>
      <p id={`${id}-purpose`} className="text-small leading-[1.55] text-muted">
        {text.purpose}
      </p>
    </li>
  );
}
