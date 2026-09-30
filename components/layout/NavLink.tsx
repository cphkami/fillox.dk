"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";

/**
 * `aria-current` for menu and footer links: "page" when the link points at the current route
 * (an exact path; links to a section, `/klinikker#city2`, or with a query are not the page).
 * The top-level nav marks its section itself (DesktopNav, `isNavItemActive`).
 */
export function useAriaCurrent(): (href: string) => "page" | undefined {
  const pathname = usePathname();
  return (href) => (href === pathname ? "page" : undefined);
}

/** next/link with `aria-current="page"` on the current route, for server components (Footer). */
export function NavLink(props: ComponentPropsWithoutRef<typeof Link>) {
  const ariaCurrent = useAriaCurrent();
  return <Link aria-current={typeof props.href === "string" ? ariaCurrent(props.href) : undefined} {...props} />;
}
