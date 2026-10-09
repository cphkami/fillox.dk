"use client";

/*
 * Dev-only live colour tuner ("Farver"). The owner tunes the palette while browsing the real site
 * on localhost, then copies the result ("Kopiér farver") into the chat.
 *
 * - Mounted by components/dev/ColorTunerMount (from app/layout.tsx in `next dev` only): no code
 *   from this folder is in a production build.
 * - The UI strings are Danish and live here on purpose: this is a dev tool, not site copy
 *   (scripts/check-market.mjs skips components/dev/). Its own styles are plain CSS below, not
 *   Tailwind (app/globals.css excludes this folder from Tailwind's scan, so none of it reaches the
 *   site's stylesheet), in fixed neutral colours that the tuning never changes.
 * - A change writes `html:root { --color-<token>: … }` into one <style> in <head>: every Tailwind
 *   utility reads its colour from that variable, so the page updates live. Overrides persist in
 *   localStorage (every read / write in try / catch) and are applied before paint on a reload by
 *   the init script (color-tuner-config.ts → initScript).
 */

import { useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import {
  OPEN_KEY,
  STORAGE_KEY,
  STYLE_ID,
  WINDOW_FLAG,
  groups,
  presets,
  tokenIds,
  tokens,
  type Backdrop,
  type ContrastPair,
  type Preset,
  type TokenDef,
  type TokenId,
} from "./color-tuner-config";

type Colors = Partial<Record<TokenId, string>>;
type State = { enabled: boolean; open: boolean; defaults: Colors; overrides: Colors };

// ------------------------------------------------------------------------------ colour maths

type Rgba = { r: number; g: number; b: number; a: number };

const clampByte = (n: number) => Math.min(255, Math.max(0, Math.round(n)));

function parseChannel(part: string, max: number): number {
  return part.endsWith("%") ? (parseFloat(part) / 100) * max : parseFloat(part);
}

function parseHex(hex: string): Rgba | null {
  const m = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length <= 4) h = [...h].map((c) => c + c).join("");
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}

let canvasContext: CanvasRenderingContext2D | null | undefined;

/** Any CSS colour → RGBA (hex and rgb() directly, anything else through a canvas). */
function parseColor(raw: string): Rgba | null {
  const value = raw.trim();
  if (!value) return null;
  const hex = parseHex(value);
  if (hex) return hex;
  const rgb = /^rgba?\(\s*([\d.]+%?)[\s,]+([\d.]+%?)[\s,]+([\d.]+%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(value);
  if (rgb) {
    return {
      r: clampByte(parseChannel(rgb[1], 255)),
      g: clampByte(parseChannel(rgb[2], 255)),
      b: clampByte(parseChannel(rgb[3], 255)),
      a: rgb[4] === undefined ? 1 : Math.min(1, Math.max(0, parseChannel(rgb[4], 1))),
    };
  }
  if (canvasContext === undefined) canvasContext = document.createElement("canvas").getContext("2d");
  if (!canvasContext) return null;
  canvasContext.fillStyle = "#000000";
  canvasContext.fillStyle = value;
  const normalized = String(canvasContext.fillStyle);
  return normalized === value ? null : parseColor(normalized);
}

const byteHex = (n: number) => clampByte(n).toString(16).padStart(2, "0");

/** RGBA → "#rrggbb", or "#rrggbbaa" for a translucent token. */
function toHex({ r, g, b, a }: Rgba, alpha: boolean): string {
  return `#${byteHex(r)}${byteHex(g)}${byteHex(b)}${alpha ? byteHex(a * 255) : ""}`;
}

/** A stored or preset value → a normalised hex value, or null when it is not one. */
function normalizeHexInput(text: string, alpha: boolean): string | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{8})$/i.exec(text.trim());
  if (!m || (!alpha && (m[1].length === 4 || m[1].length === 8))) return null;
  const color = parseHex(m[1]);
  return color ? toHex(color, alpha) : null;
}

/**
 * What the owner typed in a hex field → a normalised value, or null. Accepts #rgb and #rrggbb (and
 * #rgba / #rrggbbaa on a translucent token); a code without alpha digits keeps the token's current
 * opacity (the slider), so pasting a plain colour into a translucent token never makes it solid.
 */
function typedHex(text: string, alpha: boolean, current: string): string | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(text.trim());
  if (!m) return null;
  const withAlpha = m[1].length === 4 || m[1].length === 8;
  if (withAlpha && !alpha) return null;
  const color = parseHex(m[1]);
  if (!color) return null;
  return toHex(withAlpha ? color : { ...color, a: parseHex(current)?.a ?? 1 }, alpha);
}

/** Applied while typing: only a complete code (#rrggbb, or #rrggbbaa on a translucent token). */
const isCompleteHex = (text: string, alpha: boolean) =>
  (alpha ? /^#?[0-9a-f]{8}$/i : /^#?[0-9a-f]{6}$/i).test(text.trim());

/** Could still become a code (the owner is typing): no error yet. */
const isPartialHex = (text: string, alpha: boolean) =>
  (alpha ? /^#?[0-9a-f]{0,8}$/i : /^#?[0-9a-f]{0,6}$/i).test(text.trim());

/** WCAG relative luminance. */
function luminance({ r, g, b }: Rgba): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: Rgba, b: Rgba): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** A translucent colour laid over an opaque one. */
function over(top: Rgba, base: Rgba): Rgba {
  const mix = (t: number, b: number) => t * top.a + b * (1 - top.a);
  return { r: mix(top.r, base.r), g: mix(top.g, base.g), b: mix(top.b, base.b), a: 1 };
}

const WHITE: Rgba = { r: 255, g: 255, b: 255, a: 1 };

/** "12,1" (Danish decimal comma), rounded down so a shown "4,5" always passes. */
const formatRatio = (ratio: number) => (Math.floor(ratio * 10) / 10).toFixed(1).replace(".", ",");

const valueOf = (state: State, id: TokenId) => state.overrides[id] ?? state.defaults[id];

function resolve(state: State, id: TokenId): Rgba | null {
  const value = valueOf(state, id);
  return value ? parseColor(value) : null;
}

function resolveBackdrop(state: State, backdrop: Backdrop): Rgba | null {
  if (typeof backdrop === "string") {
    // `white` is Tailwind's token: tunable, and white if Tailwind did not emit it.
    const color = resolve(state, backdrop) ?? (backdrop === "white" ? WHITE : null);
    return color && (color.a < 1 ? over(color, WHITE) : color);
  }
  const top = resolve(state, backdrop.over);
  const base = resolveBackdrop(state, backdrop.base);
  return top && base ? over(top, base) : null;
}

function pairRatio(state: State, pair: ContrastPair): number | null {
  const bg = resolveBackdrop(state, pair.bg);
  const color = resolve(state, pair.fg);
  if (!bg || !color) return null;
  // `text-cream/75`: the text colour at that opacity, laid over the background.
  const fg = pair.alpha === undefined ? color : { ...color, a: color.a * pair.alpha };
  return contrast(fg.a < 1 ? over(fg, bg) : fg, bg);
}

const backdropTokens = (backdrop: Backdrop): string[] =>
  typeof backdrop === "string" ? [backdrop] : [backdrop.over, ...backdropTokens(backdrop.base)];

/** The same text on the same background (several rows show it) counts once. */
const pairKey = (pair: ContrastPair) => `${pair.fg}|${JSON.stringify(pair.bg)}|${pair.alpha ?? 1}`;

/** Every text pair in the panel, once. */
const allPairs: ContrastPair[] = [
  ...new Map(tokens.flatMap((token) => token.pairs).map((pair) => [pairKey(pair), pair])).values(),
];

/** The pairs below AA with the current colours (tokens Tailwind did not emit are skipped). */
function failingPairs(current: State): { pair: ContrastPair; ratio: number }[] {
  return allPairs.flatMap((pair) => {
    const ratio = pairRatio(current, pair);
    return ratio !== null && ratio < pair.min ? [{ pair, ratio }] : [];
  });
}

const checkedPairCount = (current: State) => allPairs.filter((pair) => pairRatio(current, pair) !== null).length;

// ------------------------------------------------------------------------------ store

const listeners = new Set<() => void>();
let state: State | null = null;

function readStorage(storage: "localStorage" | "sessionStorage", key: string): string | null {
  try {
    return window[storage].getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Private window / blocked storage: the change still applies, it just won't survive a reload.
  }
}

/** Only known tokens, valid colours and values that differ from the site's. */
function sanitize(raw: unknown, defaults: Colors): Colors {
  const result: Colors = {};
  if (!raw || typeof raw !== "object") return result;
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!tokenIds.has(id) || typeof value !== "string") continue;
    const def = tokens.find((token) => token.id === id);
    const hex = normalizeHexInput(value, Boolean(def?.alpha));
    const tokenId = id as TokenId;
    if (hex && defaults[tokenId] && hex !== defaults[tokenId]) result[tokenId] = hex;
  }
  return result;
}

function loadOverrides(defaults: Colors): Colors {
  try {
    const data = JSON.parse(readStorage("localStorage", STORAGE_KEY) ?? "null") as { overrides?: unknown } | null;
    return sanitize(data?.overrides, defaults);
  } catch {
    return {};
  }
}

/** The site's own values (the stylesheet without the override <style>). */
function readDefaults(): Colors {
  const style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (style) style.disabled = true;
  const computed = getComputedStyle(document.documentElement);
  const defaults: Colors = {};
  for (const token of tokens) {
    const color = parseColor(computed.getPropertyValue(`--color-${token.id}`));
    if (color) defaults[token.id] = toHex(color, Boolean(token.alpha));
  }
  if (style) style.disabled = false;
  return defaults;
}

function applyOverrides(overrides: Colors) {
  const css = Object.entries(overrides)
    .map(([id, value]) => `--color-${id}:${value};`)
    .join("");
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!css) {
    style?.remove();
    return;
  }
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = `html:root{${css}}`;
}

function createState(): State {
  const flag = (window as unknown as Record<string, unknown>)[WINDOW_FLAG];
  const enabled = flag === undefined ? !navigator.webdriver : flag === "on";
  if (!enabled) return { enabled, open: false, defaults: {}, overrides: {} };
  const defaults = readDefaults();
  const overrides = loadOverrides(defaults);
  // Normally a no-op (the init script applied them); also drops overrides that equal a new default.
  applyOverrides(overrides);
  return { enabled, open: readStorage("localStorage", OPEN_KEY) === "1", defaults, overrides };
}

function getSnapshot(): State {
  state ??= createState();
  return state;
}

const getServerSnapshot = () => null;

function update(next: State) {
  state = next;
  for (const listener of listeners) listener();
}

function setOverrides(overrides: Colors) {
  const current = getSnapshot();
  writeStorage(STORAGE_KEY, Object.keys(overrides).length ? JSON.stringify({ v: 1, overrides }) : null);
  applyOverrides(overrides);
  update({ ...current, overrides });
}

function setToken(id: TokenId, value: string | null) {
  const current = getSnapshot();
  const overrides = { ...current.overrides };
  if (value === null || value === current.defaults[id]) delete overrides[id];
  else overrides[id] = value;
  setOverrides(overrides);
}

function setOpen(open: boolean) {
  const current = getSnapshot();
  writeStorage(OPEN_KEY, open ? "1" : null);
  // Re-read the site's values on open: app/globals.css may have changed since the page loaded.
  const defaults = open ? readDefaults() : current.defaults;
  const overrides = open ? sanitize(current.overrides, defaults) : current.overrides;
  if (open) applyOverrides(overrides);
  update({ ...current, open, defaults, overrides });
}

/** Another tab changed the colours: follow it. */
function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY || !state?.enabled) return;
  const overrides = loadOverrides(state.defaults);
  applyOverrides(overrides);
  update({ ...state, overrides });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener("storage", onStorage);
  };
}

// ------------------------------------------------------------------------------ copy text

function displayValue(value: string, alpha: boolean): string {
  if (!alpha) return value.toUpperCase();
  const color = parseHex(value);
  return `${value.toUpperCase()} (opacitet ${color ? Math.round(color.a * 100) : 100} %)`;
}

/** The value as app/globals.css writes it: hex, or rgb(r g b / a) for a translucent token. */
function cssValue(value: string, alpha: boolean): string {
  const color = parseHex(value);
  if (!alpha || !color || color.a >= 1) return value.slice(0, 7).toLowerCase();
  return `rgb(${color.r} ${color.g} ${color.b} / ${Number(color.a.toFixed(2))})`;
}

const minLabel = (pair: ContrastPair) => `${String(pair.min).replace(".", ",")}:1`;

function pairLine(current: State, pair: ContrastPair): string | null {
  const ratio = pairRatio(current, pair);
  if (ratio === null) return null;
  return `• ${pair.what}: ${formatRatio(ratio)}:1 – AA ${ratio >= pair.min ? "✓" : `✗ (kræver ${minLabel(pair)})`}`;
}

function buildReport(current: State): string {
  const changed = tokens.filter((token) => current.overrides[token.id]);
  const failing = failingPairs(current);
  const lines: string[] = [`Fillox-farver fra farve-tuneren (localhost), ${new Date().toLocaleDateString("da-DK")}`, ""];
  if (failing.length) {
    lines.push(`Kontrast (WCAG AA): ${failing.length} af ${checkedPairCount(current)} par klarer det ikke:`);
    for (const { pair } of failing) lines.push(pairLine(current, pair) ?? "");
  } else {
    lines.push(`Kontrast (WCAG AA): alle ${checkedPairCount(current)} par klarer det.`);
  }
  lines.push("");

  if (changed.length) {
    lines.push("Ændrede farver (før → nu):");
    for (const token of changed) {
      const before = current.defaults[token.id] ?? "";
      lines.push(
        `• ${token.name} (${token.id}): ${displayValue(before, Boolean(token.alpha))} → ${displayValue(current.overrides[token.id] ?? "", Boolean(token.alpha))}`,
      );
    }
    const changedIds = new Set<string>(changed.map((token) => token.id));
    const contrastLines: string[] = [];
    for (const pair of allPairs) {
      if (![pair.fg, ...backdropTokens(pair.bg)].some((id) => changedIds.has(id))) continue;
      const line = pairLine(current, pair);
      if (line) contrastLines.push(line);
    }
    if (contrastLines.length) lines.push("", "Kontrast med de nye farver:", ...contrastLines);
    lines.push("", "CSS (app/globals.css → @theme):");
    for (const token of changed) {
      lines.push(`  --color-${token.id}: ${cssValue(current.overrides[token.id] ?? "", Boolean(token.alpha))};`);
    }
  } else {
    lines.push("Ingen ændringer – farverne er som på sitet.");
  }

  lines.push("", "Alle farver lige nu:");
  for (const group of groups) {
    const rows = group.tokens.filter((token) => valueOf(current, token.id));
    if (!rows.length) continue;
    lines.push(group.title);
    for (const token of rows) {
      const mark = current.overrides[token.id] ? " (ændret)" : "";
      lines.push(`• ${token.name} (${token.id}): ${displayValue(valueOf(current, token.id) ?? "", Boolean(token.alpha))}${mark}`);
    }
  }
  return lines.join("\n");
}

// ------------------------------------------------------------------------------ UI

const cssVar = (id: TokenId) => `var(--color-${id})`;

function swatchStyle(def: TokenDef): CSSProperties {
  const { preview } = def;
  switch (preview.kind) {
    case "surface":
      return { background: cssVar(def.id), color: cssVar(preview.text) };
    case "text":
      return { background: cssVar(preview.on), color: cssVar(def.id) };
    case "line":
      return { background: `linear-gradient(${cssVar(def.id)}, ${cssVar(def.id)}) center / 70% 3px no-repeat, ${cssVar(preview.on)}` };
    case "overlay":
      return { background: `linear-gradient(${cssVar(def.id)}, ${cssVar(def.id)}), ${cssVar(preview.on)}`, color: cssVar(preview.text) };
  }
}

function TokenRow({ def, current }: { def: TokenDef; current: State }) {
  // What the owner is typing (null: the field shows the value), and whether Enter found it invalid.
  const [draft, setDraft] = useState<string | null>(null);
  const [rejected, setRejected] = useState(false);
  const value = valueOf(current, def.id) ?? "#000000";
  const initial = current.defaults[def.id] ?? value;
  const alpha = Boolean(def.alpha);
  const changed = Boolean(current.overrides[def.id]);
  const color = parseHex(value);
  const opacity = color ? Math.round(color.a * 100) : 100;
  // A code still being typed is no error; a wrong character, too many digits or Enter on an
  // incomplete code is.
  const invalid = draft !== null && (rejected || !isPartialHex(draft, alpha));
  const errorId = `ct-error-${def.id}`;

  const editDraft = (text: string | null) => {
    setDraft(text);
    setRejected(false);
  };
  /** Enter / leaving the field: apply a short code (#rgb …) too; false when it is not a code. */
  const commitDraft = (): boolean => {
    if (draft === null) return true;
    const hex = typedHex(draft, alpha, value);
    if (hex) setToken(def.id, hex);
    return hex !== null;
  };

  return (
    <li className="ct-row" data-changed={changed || undefined}>
      <span className="ct-swatch" style={swatchStyle(def)} aria-hidden="true">
        {def.preview.kind === "line" ? null : "Aa"}
      </span>
      <div className="ct-main">
        <p className="ct-name">
          {def.name} <code>{def.id}</code>
        </p>
        <p className="ct-hint">{def.hint}</p>
        <div className="ct-controls">
          <input
            type="color"
            className="ct-picker"
            aria-label={`${def.name}: vælg farve`}
            value={value.slice(0, 7)}
            onChange={(event) => {
              editDraft(null);
              setToken(def.id, alpha ? `${event.target.value}${value.slice(7, 9) || "ff"}` : event.target.value);
            }}
          />
          <input
            type="text"
            className="ct-hex"
            aria-label={`${def.name}: hex-kode`}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? errorId : undefined}
            value={draft ?? value.toUpperCase()}
            maxLength={alpha ? 9 : 7}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            onChange={(event) => {
              const text = event.target.value;
              editDraft(text);
              // Live only once the code is complete: "#D9A" on the way to "#D9A192" is not #DD99AA.
              if (isCompleteHex(text, alpha)) {
                const hex = typedHex(text, alpha, value);
                if (hex) setToken(def.id, hex);
              }
            }}
            onBlur={() => {
              // A short or unfinished code is applied if it is one, otherwise the field shows the value again.
              commitDraft();
              editDraft(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                if (commitDraft()) editDraft(null);
                else setRejected(true);
              } else if (event.key === "Escape" && draft !== null) {
                // First Escape drops the typing; the next one closes the panel.
                event.stopPropagation();
                editDraft(null);
              }
            }}
          />
          <button
            type="button"
            className="ct-reset"
            disabled={!changed}
            aria-label={`Nulstil ${def.name} til ${initial.toUpperCase()}`}
            title={changed ? `Tilbage til ${initial.toUpperCase()}` : "Ikke ændret"}
            onClick={() => {
              editDraft(null);
              setToken(def.id, null);
            }}
          >
            Nulstil
          </button>
        </div>
        {alpha ? (
          <div className="ct-alpha">
            <span aria-hidden="true">Opacitet</span>
            <input
              type="range"
              min={0}
              max={100}
              value={opacity}
              aria-label={`${def.name}: opacitet`}
              onChange={(event) => {
                const next = parseHex(value);
                if (next) setToken(def.id, toHex({ ...next, a: Number(event.target.value) / 100 }, true));
              }}
            />
            <span className="ct-alpha-value" aria-hidden="true">
              {opacity} %
            </span>
          </div>
        ) : null}
        {invalid ? (
          <p id={errorId} className="ct-error">
            {alpha
              ? "Skriv en hex-kode, fx #33211D33 (de sidste to cifre er opaciteten) eller #33211D"
              : "Skriv en hex-kode, fx #D9A192 eller #DA9"}
          </p>
        ) : null}
        {changed ? <p className="ct-before">Før: {displayValue(initial, alpha)}</p> : null}
        {def.pairs.length ? (
          <ul className="ct-badges" aria-label="Kontrast (WCAG AA)">
            {def.pairs.map((pair) => {
              const ratio = pairRatio(current, pair);
              if (ratio === null) return null;
              const ok = ratio >= pair.min;
              return (
                <li
                  key={pairKey(pair)}
                  className={ok ? "ct-ok" : "ct-bad"}
                  title={`${pair.what}: ${formatRatio(ratio)}:1. AA kræver ${minLabel(pair)}${pair.min === 3 ? " (stor tekst / grafik)" : ""}.`}
                >
                  {pair.label} {formatRatio(ratio)} AA {ok ? "✓" : "✗"}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </li>
  );
}

function Tuner({ current }: { current: State }) {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const statusTimer = useRef<number | undefined>(undefined);
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState<string | null>(null);
  const changedCount = Object.keys(current.overrides).length;

  const say = (message: string) => {
    setStatus(message);
    window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatus(""), 5000);
  };

  const open = () => {
    setOpen(true);
    requestAnimationFrame(() => titleRef.current?.focus());
  };
  const close = () => {
    setOpen(false);
    setFallback(null);
    toggleRef.current?.focus();
  };

  const copy = async () => {
    const text = buildReport(current);
    try {
      await navigator.clipboard.writeText(text);
      setFallback(null);
      say("Kopieret – indsæt teksten i chatten til os.");
    } catch {
      setFallback(text);
      say("Kunne ikke kopiere automatisk – markér teksten herunder og kopiér den.");
    }
  };

  const resetAll = (): boolean => {
    if (!changedCount) return true;
    if (!window.confirm("Nulstil alle farver til sitets nuværende?")) return false;
    setOverrides({});
    say("Alle farver er nulstillet.");
    return true;
  };

  /** A suggestion sets only its own tokens; it asks before it replaces a value the owner set. */
  const applyPreset = (preset: Preset) => {
    if (preset.resetAll) {
      if (resetAll() && !changedCount) say(`Forslag „${preset.label}“: farverne er allerede som på sitet.`);
      return;
    }
    const next = sanitize(preset.overrides, current.defaults);
    const replaced = tokens.filter((token) => {
      const mine = current.overrides[token.id];
      return token.id in next && mine !== undefined && mine !== next[token.id];
    });
    if (replaced.length) {
      const list = replaced.map((token) => `${token.name} (${current.overrides[token.id]?.toUpperCase()})`).join(", ");
      if (!window.confirm(`„${preset.label}“ erstatter din ændring af ${list}. Fortsæt?`)) return;
    }
    setOverrides({ ...current.overrides, ...next });
    say(`Forslag „${preset.label}“ er sat på; dine andre ændringer er beholdt.`);
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      close();
    }
  };

  /** Nuværende: nothing changed; a suggestion: all its tokens have its values. */
  const presetActive = (preset: Preset) => {
    if (preset.resetAll) return changedCount === 0;
    const next = sanitize(preset.overrides, current.defaults);
    const keys = Object.keys(next) as TokenId[];
    return keys.length > 0 && keys.every((id) => current.overrides[id] === next[id]);
  };

  const failing = failingPairs(current);

  return (
    <div data-color-tuner="">
      <style>{STYLES}</style>
      <button
        ref={toggleRef}
        type="button"
        className="ct-toggle"
        aria-expanded={current.open}
        aria-controls="ct-panel"
        onClick={() => (current.open ? close() : open())}
      >
        <span className="ct-toggle-label">Farver</span>
        {changedCount ? (
          <span className="ct-toggle-count">
            {changedCount}
            <span className="ct-sr"> ændret</span>
          </span>
        ) : null}
      </button>
      <section
        id="ct-panel"
        className="ct-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="ct-title"
        hidden={!current.open}
        onKeyDown={onPanelKeyDown}
      >
        <header className="ct-head">
          <div>
            <h2 id="ct-title" ref={titleRef} tabIndex={-1}>
              Farver
            </h2>
            <p>Kun på localhost. Ændringer gemmes i denne browser.</p>
          </div>
          <button type="button" className="ct-close" onClick={close} aria-label="Luk farver">
            ✕
          </button>
        </header>
        <div className="ct-actions">
          <button type="button" className="ct-primary" onClick={copy}>
            Kopiér farver
          </button>
          <button type="button" onClick={resetAll} disabled={!changedCount}>
            Nulstil alle{changedCount ? ` (${changedCount})` : ""}
          </button>
        </div>
        <div className="ct-presets" role="group" aria-label="Forslag">
          <span aria-hidden="true">Forslag:</span>
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              aria-pressed={presetActive(preset)}
              aria-describedby="ct-presets-note"
              title={preset.hint}
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
          <p id="ct-presets-note" className="ct-note">
            Et forslag ændrer kun sin egen farve. „Nuværende“ nulstiller alle.
          </p>
        </div>
        {failing.length ? (
          <div className="ct-summary ct-summary-bad">
            <p id="ct-summary-title">
              <strong>{failing.length} par under AA</strong> af {checkedPairCount(current)} tjekkede:
            </p>
            {/* Scrolls when long; focusable so the keyboard can scroll it too. */}
            <ul tabIndex={0} aria-labelledby="ct-summary-title">
              {failing.map(({ pair, ratio }) => (
                <li key={pairKey(pair)}>
                  {pair.what}: {formatRatio(ratio)}:1 (kræver {minLabel(pair)})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="ct-summary ct-summary-ok">Kontrast: alle {checkedPairCount(current)} par klarer AA ✓</p>
        )}
        <p className="ct-status" role="status">
          {status}
        </p>
        {fallback !== null ? (
          <textarea
            className="ct-fallback"
            readOnly
            rows={6}
            value={fallback}
            aria-label="Farverne som tekst"
            onFocus={(event) => event.currentTarget.select()}
          />
        ) : null}
        <div className="ct-scroll">
          {groups.map((group) => {
            const rows = group.tokens.filter((token) => current.defaults[token.id]);
            if (!rows.length) return null;
            const count = rows.filter((token) => current.overrides[token.id]).length;
            return (
              <details key={group.id} className="ct-group" open>
                <summary>
                  {group.title}
                  {count ? <span className="ct-count">{count} ændret</span> : null}
                </summary>
                <ul>
                  {rows.map((token) => (
                    <TokenRow key={token.id} def={token} current={current} />
                  ))}
                </ul>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/** Renders nothing on the server, in automated browsers and with `?farver=0` (see initScript). */
export default function ColorTuner() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  if (!current?.enabled) return null;
  return createPortal(<Tuner current={current} />, document.body);
}

// Fixed neutral colours: the tuner never takes the site's (tunable) tokens.
const STYLES = `
[data-color-tuner]{display:contents;--ct-lift:0px;--ct-top:16px;--ct-ink:#1d1d1f;--ct-muted:#5c5c63;--ct-line:#d6d6dc;--ct-focus:#0b57d0}
@media (width < 48rem){html:has([data-mobile-book-bar]:not([inert])) [data-color-tuner]{--ct-lift:74px}}
@media (width >= 64rem){[data-color-tuner]{--ct-top:112px}}
@media print{[data-color-tuner]{display:none!important}}
[data-color-tuner] :focus-visible{outline:2px solid var(--ct-focus);outline-offset:2px}
[data-color-tuner] button{cursor:pointer}
[data-color-tuner] button:disabled{cursor:default;opacity:.45}
.ct-toggle,.ct-panel{position:fixed;z-index:60;right:max(16px,env(safe-area-inset-right));font:13px/1.4 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--ct-ink);letter-spacing:0;text-align:left}
.ct-toggle{bottom:calc(max(16px,env(safe-area-inset-bottom)) + var(--ct-lift));width:56px;height:56px;border-radius:50%;padding:5px;background:conic-gradient(var(--color-band) 0 25%,var(--color-footer) 0 50%,var(--color-accent) 0 75%,var(--color-sand) 0);box-shadow:0 4px 16px rgb(0 0 0/.22),0 0 0 1px rgb(0 0 0/.12)}
.ct-toggle-label{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:#fff;font-size:11px;font-weight:600}
.ct-toggle-count{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;background:var(--ct-ink);color:#fff;font-size:11px;font-weight:700;line-height:20px;text-align:center}
.ct-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.ct-panel{bottom:calc(max(16px,env(safe-area-inset-bottom)) + 68px + var(--ct-lift));width:min(360px,calc(100vw - 32px));max-height:calc(100dvh - 84px - var(--ct-top) - var(--ct-lift));display:flex;flex-direction:column;background:#fff;border:1px solid var(--ct-line);border-radius:16px;box-shadow:0 18px 50px rgb(0 0 0/.25);overflow:hidden}
.ct-panel[hidden]{display:none}
.ct-panel>:not(.ct-scroll){flex:none}
.ct-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:14px 14px 8px}
.ct-head h2{margin:0;font-size:16px;font-weight:700;line-height:1.3}
.ct-head h2:focus{outline:none}
.ct-head p{margin:2px 0 0;color:var(--ct-muted);font-size:12px}
.ct-close{flex:none;width:32px;height:32px;border-radius:8px;font-size:14px;color:var(--ct-muted)}
.ct-close:hover{background:#f0f0f3}
.ct-actions,.ct-presets{display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding:0 14px 8px}
.ct-actions button,.ct-presets button,.ct-reset{min-height:32px;padding:0 12px;border:1px solid var(--ct-line);border-radius:999px;background:#fff;font-size:12.5px;font-weight:600}
.ct-actions button:not(.ct-primary):not(:disabled):hover,.ct-presets button:hover,.ct-reset:not(:disabled):hover{background:#f0f0f3}
.ct-actions .ct-primary{background:var(--ct-ink);border-color:var(--ct-ink);color:#fff}
.ct-actions .ct-primary:hover{background:#000}
.ct-presets span{color:var(--ct-muted);font-size:12px;margin-right:2px}
.ct-presets button[aria-pressed=true]{border-color:var(--ct-ink);box-shadow:inset 0 0 0 1px var(--ct-ink)}
.ct-note{flex-basis:100%;margin:0;color:var(--ct-muted);font-size:11.5px;line-height:1.35}
.ct-summary{margin:0 14px 8px;padding:6px 10px;border-radius:8px;font-size:12px;line-height:1.4}
.ct-summary p{margin:0}
.ct-summary ul{max-height:96px;overflow:auto;margin:4px 0 0;padding:0 0 0 16px}
.ct-summary-ok{background:#e3f4e8;color:#14532d}
.ct-summary-bad{background:#fde2e1;color:#8c1d18}
.ct-status{min-height:0;margin:0;padding:0 14px;color:#1b6b34;font-size:12px}
.ct-status:not(:empty){padding-bottom:8px}
.ct-fallback{margin:0 14px 8px;padding:8px;border:1px solid var(--ct-line);border-radius:8px;font:11px/1.4 ui-monospace,Menlo,monospace;resize:vertical}
.ct-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;border-top:1px solid var(--ct-line)}
.ct-group{border-bottom:1px solid var(--ct-line)}
.ct-group summary{position:sticky;top:0;z-index:1;display:flex;align-items:center;gap:8px;min-height:40px;padding:0 14px;font-size:13px;font-weight:700;cursor:pointer;background:#fafafb}
.ct-group summary:hover{background:#f0f0f3}
.ct-group summary::-webkit-details-marker{display:none}
.ct-group summary::before{content:"";width:6px;height:6px;margin:0 2px 0 1px;border:solid var(--ct-muted);border-width:0 1.5px 1.5px 0;transform:rotate(-45deg)}
.ct-group[open] summary::before{transform:rotate(45deg) translate(-2px,-1px)}
.ct-count{margin-left:auto;padding:1px 8px;border-radius:999px;background:#fff3cd;color:#6b4e00;font-size:11px;font-weight:600}
.ct-group ul{margin:0;padding:0;list-style:none}
.ct-row{display:grid;grid-template-columns:44px 1fr;gap:10px;padding:10px 14px;border-top:1px solid #eeeef1}
.ct-row[data-changed]{background:#fffbea}
.ct-swatch{display:grid;place-items:center;width:44px;height:44px;border-radius:10px;box-shadow:inset 0 0 0 1px rgb(0 0 0/.14);font:500 16px/1 var(--font-heading,sans-serif)}
.ct-main{min-width:0}
.ct-name{margin:0;font-weight:600;font-size:13px}
.ct-name code{margin-left:2px;color:var(--ct-muted);font:11px ui-monospace,Menlo,monospace}
.ct-hint{margin:1px 0 6px;color:var(--ct-muted);font-size:11.5px;line-height:1.35}
.ct-controls{display:flex;align-items:center;gap:6px}
.ct-picker{flex:none;width:40px;height:32px;padding:2px;border:1px solid var(--ct-line);border-radius:8px;background:#fff;cursor:pointer}
.ct-picker::-webkit-color-swatch-wrapper{padding:0}
.ct-picker::-webkit-color-swatch{border:0;border-radius:5px}
.ct-picker::-moz-color-swatch{border:0;border-radius:5px}
.ct-hex{width:100px;min-width:0;height:32px;padding:0 8px;border:1px solid var(--ct-line);border-radius:8px;background:#fff;font:12.5px ui-monospace,Menlo,monospace;text-transform:uppercase}
.ct-hex[aria-invalid=true]{border-color:#b3261e;box-shadow:inset 0 0 0 1px #b3261e}
.ct-reset{margin-left:auto}
.ct-alpha{display:flex;align-items:center;gap:8px;margin-top:6px;color:var(--ct-muted);font-size:12px}
.ct-alpha input{flex:1;min-width:0;accent-color:var(--ct-ink)}
.ct-alpha-value{width:40px;text-align:right;font-variant-numeric:tabular-nums}
.ct-error{margin:4px 0 0;color:#b3261e;font-size:12px}
.ct-before{margin:4px 0 0;color:var(--ct-muted);font-size:11.5px}
.ct-badges{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 0;padding:0;list-style:none}
.ct-badges li{padding:1px 7px;border-radius:999px;font-size:11px;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
.ct-ok{background:#e3f4e8;color:#14532d}
.ct-bad{background:#fde2e1;color:#8c1d18}
`;
