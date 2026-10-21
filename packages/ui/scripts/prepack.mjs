/**
 * Point the manifest at the build, for publishing.
 *
 * The workspace resolves the package from source — the docs app imports
 * it with no build step — while npm needs the built files. npm's
 * `publishConfig` only sets npm's own options (registry, access, tag);
 * it cannot rewrite a manifest field, so the exports are repointed
 * here. `postpack` puts the workspace manifest back.
 *
 * The rewrite is mechanical: `./src/x` becomes `./dist/x`, with the
 * extension following the output (`.ts` → `.js`, `.ts` → `.d.ts` for
 * the types condition).
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifestPath = join(root, "package.json");

/** where the workspace manifest is kept while the published one is in place */
const backup = join(root, "..", "..", "node_modules", ".retro-ui-manifest.workspace");

if (!existsSync(join(root, "dist", "index.js"))) {
  console.error("no build found — run \"npm run build\" before packing");
  process.exit(1);
}

/** rewrite a path under ./src to its built twin */
function toDist(value, types) {
  if (typeof value !== "string") return value;
  if (!value.startsWith("./src/")) return value;

  const rest = value.slice("./src/".length);
  if (types) return `./dist/${rest.replace(/\.tsx?$/, ".d.ts")}`;
  return `./dist/${rest.replace(/\.tsx?$/, ".js")}`;
}

function rewrite(value, types = false) {
  if (Array.isArray(value)) return value.map((entry) => rewrite(entry, types));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        rewrite(entry, key === "types"),
      ]),
    );
  }
  return toDist(value, types);
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

// keep the workspace manifest — the postpack puts it back. If a backup
// is already there, a previous pack was interrupted: keep the original
// rather than overwriting it with a manifest that was already rewritten.
if (!existsSync(backup)) {
  mkdirSync(dirname(backup), { recursive: true });
  copyFileSync(manifestPath, backup);
}

manifest.exports = rewrite(manifest.exports);

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log("manifest repointed at the build");
