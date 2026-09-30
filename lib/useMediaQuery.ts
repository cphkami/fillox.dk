import { useCallback, useSyncExternalStore } from "react";

/**
 * Whether a CSS media query matches, updated when it changes (client components only). The
 * server render and hydration see `false`, so markup must not depend on it before hydration.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
