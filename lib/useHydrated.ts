import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

/**
 * False on the server and during hydration, true once React runs in the browser (client
 * components only). Forms use it for `noValidate={hydrated}`: before hydration (and without
 * JavaScript) the browser's own `required` / `type="email"` checks guard the plain POST; once
 * React runs, the form's inline validation takes over.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}
