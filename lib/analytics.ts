import { site } from "@/config/site";

/**
 * Consent-gated measurement (config/site.ts → analytics; the banner is components/consent).
 * Browser only: every function is called from effects or event handlers, never on the server.
 *
 * Order on every page load (ConsentManager):
 * 1. `pushConsentDefault()`: Google Consent Mode v2 `default`, all four signals denied, plus
 *    `wait_for_update` and `ads_data_redaction`. Nothing is loaded; the dataLayer is a plain array.
 * 2. `deleteCookiesNotGranted(choice)`: first-party statistics / marketing cookies of every
 *    category that is not granted are deleted (also the old WordPress site's, set without asking).
 * 3. With a stored choice that grants Statistik or Marketing: `applyConsent()` pushes the Consent
 *    Mode `update` and only then injects the GTM container (`gtm.js` from www.googletagmanager.com).
 *    Without a choice, or with "Afvis alle", GTM is never requested.
 */

export type ConsentCategory = "statistics" | "marketing";

/** What the visitor allowed. Necessary storage needs no consent and is not part of it. */
export type ConsentChoice = Record<ConsentCategory, boolean>;

/** The choice as stored in localStorage (first party, never sent anywhere). */
export type StoredConsent = ConsentChoice & {
  /** config analytics.consentVersion at the time of the choice. */
  version: string;
  /** ISO time of the choice; the banner asks again after analytics.consentMaxAgeDays. */
  timestamp: string;
};

type ConsentState = "granted" | "denied";

type ConsentModeSignals = {
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
  analytics_storage: ConsentState;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const config = site.analytics;

export const consentCategories: ConsentCategory[] = ["statistics", "marketing"];

export const noConsent: ConsentChoice = { statistics: false, marketing: false };
export const fullConsent: ConsentChoice = { statistics: true, marketing: true };

/** True when the market has a GTM container (null switches the banner and every tag off). */
export const analyticsEnabled = Boolean(config.gtmId);

function dataLayer(): unknown[] {
  window.dataLayer = window.dataLayer ?? [];
  return window.dataLayer;
}

/**
 * Google's `gtag()` command queue. GTM only treats an entry as a command (consent, set) when it
 * is an `arguments` object, not an array, so this pushes `arguments` exactly like Google's snippet.
 */
function gtag(...args: unknown[]): void {
  void args;
  // eslint-disable-next-line prefer-rest-params -- GTM needs the Arguments object itself
  dataLayer().push(arguments);
}

/** Consent Mode v2 signals for a choice: Statistik → analytics_storage, Marketing → the three ad_* signals. */
export function consentModeSignals(choice: ConsentChoice): ConsentModeSignals {
  const ads: ConsentState = choice.marketing ? "granted" : "denied";
  return {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    analytics_storage: choice.statistics ? "granted" : "denied",
  };
}

let defaultPushed = false;

/** Consent Mode v2 default: everything denied. Pushed once per page load, before anything else. */
export function pushConsentDefault(): void {
  if (defaultPushed) return;
  defaultPushed = true;
  gtag("consent", "default", { ...consentModeSignals(noConsent), wait_for_update: 500 });
  // Ad clicks are not sent with identifiers while ad_storage is denied.
  gtag("set", "ads_data_redaction", true);
}

/* ------------------------------------------------------------------------------------------
 * Stored choice
 * ---------------------------------------------------------------------------------------- */

const dayMs = 24 * 60 * 60 * 1000;

/**
 * True for a `storage` event (another tab of this site) that may have changed the stored choice:
 * its key, or a cleared localStorage (key null).
 */
export function isConsentStorageEvent(event: StorageEvent): boolean {
  let local: Storage | null = null;
  try {
    local = window.localStorage;
  } catch {
    return false; // storage blocked: nothing is stored, nothing to follow
  }
  return event.storageArea === local && (event.key === null || event.key === config.consentStorageKey);
}

/**
 * The stored choice, or null when there is none, it is unreadable, it was made under another
 * consentVersion, or it is older than consentMaxAgeDays (the banner then asks again).
 */
export function readStoredConsent(now = Date.now()): StoredConsent | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(config.consentStorageKey);
  } catch {
    return null; // storage blocked (private mode, policy): ask on every page, load nothing
  }
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<StoredConsent>;
    if (value.version !== config.consentVersion) return null;
    if (typeof value.statistics !== "boolean" || typeof value.marketing !== "boolean") return null;
    const time = typeof value.timestamp === "string" ? Date.parse(value.timestamp) : NaN;
    if (Number.isNaN(time) || now - time > config.consentMaxAgeDays * dayMs || time - now > dayMs) return null;
    return {
      statistics: value.statistics,
      marketing: value.marketing,
      version: value.version,
      timestamp: value.timestamp as string,
    };
  } catch {
    return null;
  }
}

/** Stores the choice with the policy version and the time. Returns what was stored. */
export function storeConsent(choice: ConsentChoice): StoredConsent {
  const stored: StoredConsent = {
    statistics: choice.statistics,
    marketing: choice.marketing,
    version: config.consentVersion,
    timestamp: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(config.consentStorageKey, JSON.stringify(stored));
  } catch {
    // Not stored (storage blocked): the choice still applies to this page view.
  }
  return stored;
}

/* ------------------------------------------------------------------------------------------
 * Google Tag Manager
 * ---------------------------------------------------------------------------------------- */

let gtmLoaded = false;

/** True once the container script has been injected on this page view. */
export function isGtmLoaded(): boolean {
  return gtmLoaded;
}

function loadGtm(id: string, choice: ConsentChoice): void {
  if (gtmLoaded) return;
  gtmLoaded = true;
  if (config.blockCustomHtmlWithoutMarketing && !choice.marketing) {
    // Must be in the dataLayer before any tag fires (GTM "Restrict tag deployment"). If Marketing
    // is granted later on this page view, the Custom HTML tags run from the next full page load.
    dataLayer().push({ "gtm.blocklist": ["customScripts"] });
  }
  dataLayer().push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
}

/**
 * Applies a choice to this page view: the Consent Mode `update`, the deletion of the cookies of
 * every category not granted, then (once Statistik or Marketing is granted) the container.
 * `previous` is the choice in force on this page view (null: none). Returns true when the page
 * must reload: consent was withdrawn while the container runs, and tags that already ran (the
 * Meta Pixel's script, listeners) cannot be unloaded.
 */
export function applyConsent(choice: ConsentChoice, previous: ConsentChoice | null): boolean {
  const id = config.gtmId;
  if (!id) return false;
  pushConsentDefault();
  gtag("consent", "update", consentModeSignals(choice));
  deleteCookiesNotGranted(choice);

  if (gtmLoaded) return previous !== null && consentCategories.some((c) => previous[c] && !choice[c]);
  if (choice.statistics || choice.marketing) loadGtm(id, choice);
  return false;
}

/* ------------------------------------------------------------------------------------------
 * Cookies
 * ---------------------------------------------------------------------------------------- */

function matches(name: string, pattern: string): boolean {
  return pattern.endsWith("*") ? name.startsWith(pattern.slice(0, -1)) : name === pattern;
}

/**
 * Every domain a first-party cookie for this host can live on: no domain (host-only), the host,
 * and each parent ("www.fillox.dk" → "fillox.dk"); GA and the Meta Pixel set theirs on the
 * registrable domain (".fillox.dk"). Deleting on a public suffix ("dk") is a harmless no-op.
 */
function cookieDomains(): (string | null)[] {
  const parts = window.location.hostname.split(".");
  const domains: (string | null)[] = [null];
  for (let i = 0; i < parts.length - 1; i++) domains.push(parts.slice(i).join("."));
  return domains;
}

/** Deletes the first-party cookies whose names match one of the patterns. Returns their names. */
export function deleteCookies(patterns: string[]): string[] {
  if (patterns.length === 0) return [];
  const names = document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim() ?? "")
    .filter((name) => name && patterns.some((p) => matches(name, p)));
  const domains = cookieDomains();
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
  return names;
}

/** Deletes the cookies of every category the choice does not grant (null = none granted). */
export function deleteCookiesNotGranted(choice: ConsentChoice | null): string[] {
  const patterns = consentCategories.filter((c) => !choice?.[c]).flatMap((c) => config.cookies[c]);
  return deleteCookies(patterns);
}
