/**
 * Node module hooks that let scripts/check-market.mjs import the site's TypeScript modules
 * (config/site.ts, content/**, components/seo/*) as they are: `.ts` / `.tsx` files are
 * transpiled with the project's TypeScript, the "@/…" alias (tsconfig paths) and extensionless
 * relative imports resolve like in the app. No build step: check-market registers these with
 * module.registerHooks() (Node ≥ 22.15), or module.register() on older Node — so the hooks are
 * synchronous, which both accept.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isTs = (file) => /\.tsx?$/.test(file);
const candidates = (base) => [base, `${base}.ts`, `${base}.tsx`, join(base, "index.ts"), join(base, "index.tsx")];

export function resolve(specifier, context, nextResolve) {
  let base;
  if (specifier.startsWith("@/")) base = join(root, specifier.slice(2));
  else if (/^\.\.?\//.test(specifier) && context.parentURL && isTs(context.parentURL)) {
    base = resolvePath(dirname(fileURLToPath(context.parentURL)), specifier);
  }
  if (base) {
    const file = candidates(base).find((f) => isTs(f) && existsSync(f) && statSync(f).isFile());
    if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export function load(url, context, nextLoad) {
  if (url.startsWith("file:") && isTs(url)) {
    const fileName = fileURLToPath(url);
    const { outputText } = ts.transpileModule(readFileSync(fileName, "utf8"), {
      fileName,
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    });
    return { format: "module", source: outputText, shortCircuit: true };
  }
  return nextLoad(url, context);
}
