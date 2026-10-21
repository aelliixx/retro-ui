/**
 * Put the workspace manifest back.
 *
 * `prepack` repoints the exports at the build; the workspace needs them
 * pointing at the source, so the original goes back here.
 */
import { copyFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const manifestPath = join(root, "package.json");
const backup = join(root, "..", "..", "node_modules", ".retro-ui-manifest.workspace");

if (!existsSync(backup)) {
  console.error("no workspace manifest to restore");
  process.exit(1);
}

copyFileSync(backup, manifestPath);
rmSync(backup);

// the changelog was only here for the tarball
const changelog = join(root, "CHANGELOG.md");
if (existsSync(changelog)) {
  rmSync(changelog);
}

console.log("workspace manifest restored");
