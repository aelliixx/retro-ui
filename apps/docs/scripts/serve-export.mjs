/**
 * A plain static host for the exported site.
 *
 * The visual tests screenshot the *exported* site, not the dev server:
 * a production build is what a visitor gets, and its CSS is what the
 * baselines are made of.
 *
 *   node scripts/serve-export.mjs [port]
 */
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(
  dirname(dirname(fileURLToPath(import.meta.url))),
  "out",
);
const port = Number(process.argv[2] ?? process.env.PORT ?? 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

if (!existsSync(root)) {
  console.error(`no export at ${root} — run "npm run build" first`);
  process.exit(1);
}

const isFile = (path) => existsSync(path) && statSync(path).isFile();

/** /path serves /path.html, /path/ serves /path/index.html */
function resolveFile(url) {
  const base = join(root, normalize(url).replace(/^(\.\.[/\\])+/, ""));

  for (const candidate of [
    base,
    `${base}.html`,
    join(base, "index.html"),
    join(base, "index.txt"),
  ]) {
    if (isFile(candidate)) return candidate;
  }

  return null;
}

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const file = resolveFile(url);

  if (!file) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }

  res.writeHead(200, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  res.end(readFileSync(file));
}).listen(port, "127.0.0.1", () => {
  console.log(`serving ${root} on http://127.0.0.1:${port}`);
});
