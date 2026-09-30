import { layoutCopy } from "@/content/layout";
import type { NavItem } from "@/content/types";

function matches(pathname: string, prefix: string): boolean {
  const path = prefix.split("#")[0];
  if (!path) return false;
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

/** True when `pathname` belongs to this top-level nav item (its href, sub-items or configured prefixes). */
export function isNavItemActive(item: NavItem, pathname: string): boolean {
  const prefixes = [item.href, ...(layoutCopy.header.activePrefixes[item.href] ?? [])];
  if (item.kind === "menu") prefixes.push(...item.items.map((i) => i.href));
  return prefixes.some((p) => matches(pathname, p));
}
