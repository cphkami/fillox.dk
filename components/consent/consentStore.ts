import {
  analyticsEnabled,
  applyConsent,
  deleteCookiesNotGranted,
  isConsentStorageEvent,
  noConsent,
  pushConsentDefault,
  readStoredConsent,
  storeConsent,
  type ConsentCategory,
  type ConsentChoice,
  type StoredConsent,
} from "@/lib/analytics";

/**
 * State of the cookie banner, shared by the banner (ConsentManager) and the footer's settings
 * button (ConsentSettingsButton) through useSyncExternalStore. Browser only; the server snapshot
 * is "not ready", so the server HTML never contains the banner (it is fixed, so showing it after
 * hydration shifts no layout).
 */
export type ConsentView = "main" | "settings";

export type ConsentUiState = {
  /** init() has run (the stored choice has been read). */
  ready: boolean;
  open: boolean;
  view: ConsentView;
  /** The choice in force on this page view (null: none yet, or expired / old version). */
  current: StoredConsent | null;
  /** The switches in the settings view. None is on until the visitor turns it on. */
  draft: ConsentChoice;
  /** Opened from the footer button (focus goes into the banner and back to the button). */
  reopened: boolean;
};

const serverState: ConsentUiState = {
  ready: false,
  open: false,
  view: "main",
  current: null,
  draft: noConsent,
  reopened: false,
};

let state = serverState;
let opener: HTMLElement | null = null;
const listeners = new Set<() => void>();

function update(patch: Partial<ConsentUiState>) {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

/**
 * Another tab stored (or cleared) the choice: apply it on this page view, as if made here. The
 * banner closes when there is a choice and opens when there is none; withdrawing a category while
 * GTM runs reloads this tab too (tags that ran cannot be unloaded).
 */
function followOtherTab() {
  const next = readStoredConsent();
  const previous = state.current;
  const same =
    next && previous ? next.statistics === previous.statistics && next.marketing === previous.marketing : next === previous;
  if (same) {
    update({ current: next });
    return;
  }
  const mustReload = applyConsent(next ?? noConsent, previous);
  update({ current: next, draft: next ?? noConsent, open: !next, view: "main", reopened: false });
  if (mustReload) window.location.reload();
}

export const consentStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => state,
  getServerSnapshot: () => serverState,

  /**
   * Once per page load: Consent Mode default, then the stored choice. With a valid choice it is
   * applied (GTM loads only if it grants something) and the banner stays closed; without one the
   * banner opens and every statistics / marketing cookie on the domain is deleted.
   */
  init() {
    if (state.ready || !analyticsEnabled) return;
    pushConsentDefault();
    const stored = readStoredConsent();
    if (stored) applyConsent(stored, null);
    else deleteCookiesNotGranted(null);
    update({ ready: true, current: stored, open: !stored, draft: stored ?? noConsent });
    // A choice made in another tab applies here too (a withdrawal included).
    window.addEventListener("storage", (event) => {
      if (isConsentStorageEvent(event)) followOtherTab();
    });
  },

  /** Footer button: reopen on the settings view, the switches showing the choice in force. */
  openSettings(from: HTMLElement | null) {
    opener = from;
    update({ open: true, view: "settings", reopened: true, draft: state.current ?? noConsent });
  },

  showSettings() {
    update({ view: "settings", draft: state.current ?? noConsent });
  },

  toggle(category: ConsentCategory, on: boolean) {
    update({ draft: { ...state.draft, [category]: on } });
  },

  /** Stores and applies a choice; reloads when consent was withdrawn while GTM runs. */
  choose(choice: ConsentChoice) {
    const previous = state.current;
    const stored = storeConsent(choice);
    const mustReload = applyConsent(choice, previous);
    update({ current: stored, open: false, view: "main", draft: stored });
    if (mustReload) window.location.reload();
  },

  /** Close without a change (only offered while a choice is in force). */
  close() {
    if (!state.current) return;
    update({ open: false, view: "main" });
  },

  /** The element that reopened the banner, to give focus back to once it closes (then forgotten). */
  takeOpener(): HTMLElement | null {
    const element = opener;
    opener = null;
    return element;
  },
};
