/**
 * Post-build step for the published output.
 *
 * Two jobs:
 *
 * 1. copy the stylesheets — tsc only emits JavaScript, and the library
 *    ships two CSS files (the theming contract and the component skin)
 *    that the consumer's Tailwind processes.
 *
 * 2. make the emitted imports explicit. The source is written with
 *    extensionless relative imports, which every bundler resolves and
 *    which keeps the source copyable as-is; Node's ESM resolver does
 *    not, so the built output gets real file extensions before it is
 *    published.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const styles = join(dist, "styles");

/* ---------------------------------------------------------------- */
/* styles                                                           */
/* ---------------------------------------------------------------- */

mkdirSync(styles, { recursive: true });

const from = join(root, "src", "styles");
for (const file of readdirSync(from)) {
  if (!file.endsWith(".css")) continue;
  copyFileSync(join(from, file), join(styles, file));
}

/* ---------------------------------------------------------------- */
/* explicit extensions in the emitted JavaScript                      */
/* ---------------------------------------------------------------- */

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) yield* walk(path);
    else if (path.endsWith(".js")) yield path;
  }
}

function resolveSpecifier(file, specifier) {
  if (!specifier.startsWith(".")) return null;
  const target = resolve(dirname(file), specifier);
  if (existsSync(`${target}.js`)) return `${specifier}.js`;
  if (existsSync(join(target, "index.js"))) return `${specifier}/index.js`;
  return null;
}

let rewritten = 0;

for (const file of walk(dist)) {
  const source = readFileSync(file, "utf8");
  const next = source.replace(
    /(\bfrom\s+|\bimport\s+)(["'])(\.[^"']*)\2/g,
    (match, keyword, quote, specifier) => {
      const resolved = resolveSpecifier(file, specifier);
      if (!resolved) return match;
      return `${keyword}${quote}${resolved}${quote}`;
    },
  );
  if (next !== source) {
    writeFileSync(file, next);
    rewritten += 1;
  }
}

console.log(`copied styles → ${styles}`);
console.log(`added file extensions in ${rewritten} module(s)`);
