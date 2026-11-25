"use client";

import { cn } from "@/lib/cn";
import { useHydrated } from "@/lib/useHydrated";
import { consentStore } from "./consentStore";

/**
 * "Cookieindstillinger" in the footer: a button (it opens the cookie banner on its settings view,
 * it goes nowhere), styled like the legal links beside it by `className`. Focus moves into the
 * banner and returns here when it closes. Without JavaScript nothing is ever loaded or set, so
 * there is nothing to change: the button keeps its place but stays invisible until hydration.
 */
export function ConsentSettingsButton({ label, className }: { label: string; className?: string }) {
  const hydrated = useHydrated();
  return (
    <button
      type="button"
      onClick={(event) => consentStore.openSettings(event.currentTarget)}
      className={cn("cursor-pointer text-left", !hydrated && "invisible", className)}
    >
      {label}
    </button>
  );
}
