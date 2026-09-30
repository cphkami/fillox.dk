"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import type { NavItem } from "@/content/types";
import { cn } from "@/lib/cn";
import { ClinicsDropdown, LinksDropdown, PricesDropdown } from "./DropdownMenu";
import { MegaMenu } from "./MegaMenu";
import type { HeaderData } from "./menuData";
import { isNavItemActive } from "./navActive";

type DesktopNavProps = Pick<HeaderData, "megaColumns" | "megaPromo" | "clinics" | "clinicsHref" | "prices"> & {
  items: NavItem[];
  label: string;
};

/**
 * Hover timing. A hover-opened menu closes HOVER_CLOSE_DELAY after the pointer leaves it; while it
 * is open, another trigger takes over only after HOVER_SWITCH_DELAY on it (hover intent). Both wait
 * longer while the pointer is still on its way down to the open panel ("menu aim"): the wide mega
 * panel is reached on long diagonals from its trigger, across the gap under the nav and past the
 * neighbouring triggers, and that path must neither close nor swap the menu.
 */
const HOVER_CLOSE_DELAY = 150;
const HOVER_SWITCH_DELAY = 120;

/** Top-level label style: 14px muted; active/open = ink with a 1px plum underline. */
function itemClasses(highlight: boolean) {
  return cn(
    "inline-block border-b pb-[3px] text-[14px] whitespace-nowrap transition-colors",
    highlight ? "border-plum text-ink" : "border-transparent text-muted hover:text-ink",
  );
}

/**
 * Centered desktop navigation (≥1024px). Dropdowns open on mouse hover and on
 * click / Enter / Space / ArrowDown; close on Escape, outside click, focus leaving
 * and route change.
 */
export function DesktopNav({ items, label, megaColumns, megaPromo, clinics, clinicsHref, prices }: DesktopNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const navRef = useRef<HTMLElement>(null);
  const hoverOpened = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const switchTimer = useRef<number | undefined>(undefined);
  /** Last mouse position while a menu is open (for the "menu aim" check). */
  const pointer = useRef({ x: 0, y: 0 });
  const baseId = useId();

  // Close on route change (adjusting state during render, per React docs).
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(null);
  }

  // Closed panels stay in the layout (invisible), so their contents would load on every page view:
  // panel links are prefetched only while their panel is open (the routes still load before the
  // click), and the mega menu's promo photo is mounted once that menu has been opened.
  const [megaOpened, setMegaOpened] = useState(false);
  if (open === "treatments" && !megaOpened) setMegaOpened(true);

  const clearTimers = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(switchTimer.current);
  }, []);

  const close = useCallback(() => {
    clearTimers();
    hoverOpened.current = false;
    setOpen(null);
  }, [clearTimers]);

  // Outside click + Escape while a menu is open; the pointer position is tracked for the menu aim.
  useEffect(() => {
    if (!open) return;
    const onPointerMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const item = navRef.current?.querySelector<HTMLElement>(`[data-menu-id="${open}"]`);
      const hadFocus = item?.contains(document.activeElement);
      close();
      if (hadFocus) item?.querySelector<HTMLButtonElement>("button[aria-expanded]")?.focus();
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  useEffect(() => clearTimers, [clearTimers]);

  const itemEl = (id: string) => navRef.current?.querySelector<HTMLElement>(`[data-menu-id="${id}"]`);

  /** Menu aim: the pointer is above menu `id`'s panel, within its width, and lower than at `sinceY`. */
  const headingToPanel = (id: string, sinceY: number) => {
    const { x, y } = pointer.current;
    const panel = itemEl(id)?.querySelector("[data-menu-panel]")?.firstElementChild?.getBoundingClientRect();
    return !!panel && x >= panel.left && x <= panel.right && y < panel.top && y > sinceY;
  };

  /** Runs `action` after `delay`, postponed again for as long as the pointer keeps heading to menu `id`'s panel. */
  const afterAim = (timer: typeof closeTimer, id: string, startY: number, delay: number, action: () => void) => {
    let lastY = startY;
    const wait = () => {
      timer.current = window.setTimeout(() => {
        if (headingToPanel(id, lastY)) {
          lastY = pointer.current.y;
          wait();
        } else action();
      }, delay);
    };
    window.clearTimeout(timer.current);
    wait();
  };

  const focusPanelLink = (id: string, which: "first" | "last") => {
    const links = itemEl(id)?.querySelectorAll<HTMLElement>("[data-menu-panel] a");
    if (!links?.length) return;
    (which === "first" ? links[0] : links[links.length - 1]).focus();
  };

  /** If keyboard focus is inside panel `id`, move it to that panel's trigger (the panel is about to hide). */
  const rescueFocus = (id: string) => {
    const item = itemEl(id);
    if (item?.querySelector("[data-menu-panel]")?.contains(document.activeElement)) {
      item.querySelector<HTMLButtonElement>("button[aria-expanded]")?.focus();
    }
  };

  // Focus requested by ArrowDown / ArrowUp on a closed trigger: runs after the panel is rendered
  // visible (visibility switches instantly on open, so the link is focusable in this commit).
  const pendingFocus = useRef<{ id: string; which: "first" | "last" } | null>(null);
  const prevOpen = useRef<string | null>(null);
  useEffect(() => {
    const prev = prevOpen.current;
    prevOpen.current = open;
    // A panel that closes (or is replaced by another) must not take keyboard focus with it.
    if (prev && prev !== open) rescueFocus(prev);
    const pending = pendingFocus.current;
    if (pending && pending.id === open) {
      pendingFocus.current = null;
      focusPanelLink(pending.id, pending.which);
    }
  });

  const handlers = (id: string) => ({
    onPointerEnter: (e: ReactPointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Entering the open item (its trigger, bridge or panel) keeps it open and cancels a pending switch.
      clearTimers();
      if (open === id) return;
      const replaced = open;
      const openThis = () => {
        // Keyboard focus inside the panel being replaced goes back to its trigger, not to <body>.
        if (replaced) rescueFocus(replaced);
        hoverOpened.current = true;
        setOpen(id);
      };
      pointer.current = { x: e.clientX, y: e.clientY };
      if (replaced && hoverOpened.current) afterAim(switchTimer, replaced, e.clientY, HOVER_SWITCH_DELAY, openThis);
      else openThis();
    },
    onPointerLeave: (e: ReactPointerEvent) => {
      if (e.pointerType !== "mouse") return;
      window.clearTimeout(switchTimer.current);
      if (!hoverOpened.current) return;
      // The hover-opened menu: this item's own, or the one kept open while the switch to this item was pending.
      const target = open;
      if (!target) {
        hoverOpened.current = false;
        return;
      }
      pointer.current = { x: e.clientX, y: e.clientY };
      afterAim(closeTimer, target, e.clientY, HOVER_CLOSE_DELAY, () => {
        hoverOpened.current = false;
        rescueFocus(target);
        setOpen((cur) => (cur === target ? null : cur));
      });
    },
    onBlur: (e: ReactFocusEvent<HTMLLIElement>) => {
      const next = e.relatedTarget as Node | null;
      // Only close when focus moves to another element outside this item (keyboard tabbing).
      if (next && !e.currentTarget.contains(next)) setOpen((cur) => (cur === id ? null : cur));
    },
  });

  const onTriggerClick = (id: string) => {
    clearTimers();
    if (open === id && hoverOpened.current) {
      // Opened by hover: a click "pins" it open instead of closing it.
      hoverOpened.current = false;
      return;
    }
    hoverOpened.current = false;
    setOpen(open === id ? null : id);
  };

  const onTriggerKeyDown = (id: string) => (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      clearTimers();
      hoverOpened.current = false;
      const which = e.key === "ArrowDown" ? "first" : "last";
      if (open === id) {
        focusPanelLink(id, which);
      } else {
        pendingFocus.current = { id, which };
        setOpen(id);
      }
    }
  };

  const onPanelKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("a"));
    const index = links.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;
    e.preventDefault();
    const next = e.key === "ArrowDown" ? (index + 1) % links.length : (index - 1 + links.length) % links.length;
    links[next].focus();
  };

  const renderDropdown = (item: NavItem, id: string, panel: ReactNode, placement: "mega" | "below") => {
    const isOpen = open === id;
    const panelId = `${baseId}-${id}`;
    const active = isNavItemActive(item, pathname);
    return (
      <li key={item.href} data-menu-id={id} className={placement === "mega" ? "static" : "relative"} {...handlers(id)}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          // The underline marks the current section; say so to screen readers too.
          aria-current={active ? "true" : undefined}
          onClick={() => onTriggerClick(id)}
          onKeyDown={onTriggerKeyDown(id)}
          className={cn(
            itemClasses(active || isOpen),
            "cursor-pointer",
            // Hover bridge from the trigger down to the mega panel (only under the trigger, only while open,
            // so it never covers the logo or "Book tid").
            placement === "mega" &&
              "relative aria-expanded:after:absolute aria-expanded:after:inset-x-0 aria-expanded:after:top-full aria-expanded:after:h-9",
          )}
        >
          {item.label}
          <span aria-hidden="true">&nbsp;▾</span>
        </button>
        <div
          id={panelId}
          data-menu-panel={id}
          onKeyDown={onPanelKeyDown}
          className={cn(
            "absolute z-40 duration-200 ease-out",
            placement === "mega"
              ? // Positioned against the header's canvas box (the <li> and <ul> are static): centred on the
                // canvas, not on the nav (the logo and "Book tid" differ in width, so the nav sits off-centre),
                // as wide as its content, level with the other dropdowns. The gap above is a margin, not
                // padding, so it never covers the logo or "Book tid": the trigger's hover bridge spans it.
                // The max width (the canvas minus the surface margins) is only a safety net.
                "top-full left-1/2 mt-0.5 w-max max-w-[calc(100%-2*var(--gutter-surface))] -translate-x-1/2"
              : "top-full left-1/2 -translate-x-1/2 pt-[33px]",
            // Visibility flips to visible at once on open (so focus can move in immediately) and
            // stays delayed on close (so the fade-out is visible).
            isOpen
              ? "visible translate-y-0 opacity-100 transition-[opacity,translate]"
              : "invisible -translate-y-1.5 opacity-0 transition-[opacity,translate,visibility]",
          )}
        >
          {panel}
        </div>
      </li>
    );
  };

  return (
    <nav ref={navRef} aria-label={label} className="flex justify-center">
      <ul className="flex items-center gap-8">
        {items.map((item) => {
          switch (item.kind) {
            case "treatments":
              return renderDropdown(
                item,
                "treatments",
                <MegaMenu
                  columns={megaColumns}
                  promo={megaPromo}
                  open={open === "treatments"}
                  showPromoPhoto={megaOpened}
                  onNavigate={close}
                />,
                "mega",
              );
            case "prices":
              return renderDropdown(
                item,
                "prices",
                <PricesDropdown prices={prices} open={open === "prices"} onNavigate={close} />,
                "below",
              );
            case "clinics":
              return renderDropdown(
                item,
                "clinics",
                <ClinicsDropdown clinics={clinics} allHref={clinicsHref} open={open === "clinics"} onNavigate={close} />,
                "below",
              );
            case "menu":
              return renderDropdown(
                item,
                `menu-${item.href}`,
                <LinksDropdown items={item.items} open={open === `menu-${item.href}`} onNavigate={close} />,
                "below",
              );
            default: {
              const active = isNavItemActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={itemClasses(active)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }
          }
        })}
      </ul>
    </nav>
  );
}
