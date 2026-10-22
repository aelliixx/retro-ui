#!/usr/bin/env node
/**
 * Verify the package the way a consumer will meet it.
 *
 * The tarball npm would serve is built here, installed into a scratch
 * Next app, and rendered. That exercises the parts a dry run cannot:
 * the exports resolve from node_modules, the types are found, the
 * "use client" directives survive, the stylesheet reaches the
 * consumer's Tailwind, and the components actually paint.
 *
 *   npm run verify:publish
 *
 * What it cannot check is the one thing that lives on npm's side:
 * whether the account may publish to the scope, and whether the name
 * is free. Those need a real publish (or a local registry).
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

/** run a command, and stop the whole script if it fails */
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: false });
  if (result.status !== 0) {
    console.error(`\n✗ ${command} ${args.join(" ")} failed`);
    process.exit(result.status ?? 1);
  }
}

/** the checks the built consumer's CSS has to pass */
const CSS_CHECKS = [
  ["the library's utilities", /\.bg-accent\{/],
  ["the bevel utility", /\.shadow-out\{/],
  ["the theme mapping", /\.bg-surface\{/],
  ["the token values", /--surface:#/],
  ["the scale", /--accent-8:#/],
  ["the cascade layer", /@layer retro-ui\{/],
];

console.log("1. building the package");
run("npm", ["run", "build", "--workspace", "@retro-ui/ui"], root);

console.log("\n2. packing it — this is the tarball npm would serve");
const scratch = mkdtempSync(join(tmpdir(), "retro-ui-verify-"));
run("npm", ["pack", "--workspace", "@retro-ui/ui", "--pack-destination", scratch], root);
// the tarball is named after the package and its version — find it
// rather than spelling it out, so a version bump does not break this
const tarball = readdirSync(scratch).find((file) => file.endsWith(".tgz"));
if (!tarball) {
  console.error("✗ the tarball was not produced");
  process.exit(1);
}
const tarballPath = join(scratch, tarball);

console.log("\n3. a consumer app, installing that tarball");
const app = join(scratch, "consumer");
mkdirSync(join(app, "app"), { recursive: true });
mkdirSync(join(app, "components"), { recursive: true });

writeFileSync(
  join(app, "package.json"),
  JSON.stringify(
    {
      name: "consumer",
      private: true,
      scripts: { build: "next build" },
      dependencies: {
        "@retro-ui/ui": `file:${tarballPath}`,
        next: "16.4.2",
        react: "19.3.0",
        "react-dom": "19.3.0",
      },
      devDependencies: {
        "@tailwindcss/postcss": "^4",
        "@types/node": "^22.19.0",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        postcss: "^8",
        tailwindcss: "^4",
        typescript: "^5",
      },
    },
    null,
    2,
  ),
);

writeFileSync(join(app, "next.config.mjs"), "export default {};\n");
writeFileSync(
  join(app, "postcss.config.mjs"),
  'export default { plugins: { "@tailwindcss/postcss": {} } };\n',
);
writeFileSync(
  join(app, "tsconfig.json"),
  JSON.stringify(
    {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  ),
);

// the library first — its stylesheet declares the cascade layer order
writeFileSync(
  join(app, "app", "globals.css"),
  '/* the library first: its stylesheet declares the cascade layer order */\n@import "@retro-ui/ui/styles.css";\n@import "tailwindcss";\n',
);

writeFileSync(
  join(app, "app", "layout.tsx"),
  `import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-ink">{children}</body>
    </html>
  );
}
`,
);

writeFileSync(
  join(app, "components", "demo.tsx"),
  `"use client";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  ToastProvider,
  useToast,
} from "@retro-ui/ui";

export function Demo() {
  return (
    <ToastProvider>
      <Panel />
    </ToastProvider>
  );
}

/* the hook lives in a child of the provider — calling it in the
   component that renders the provider is outside the context */
function Panel() {
  const toast = useToast();
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Retro</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge tone="success">ready</Badge>
        <Input defaultValue="ada" />
        <Button variant="primary" onClick={() => toast.info("Saved", "On disk.")}>
          Install
        </Button>
      </CardContent>
    </Card>
  );
}
`,
);

writeFileSync(
  join(app, "app", "page.tsx"),
  `import { Demo } from "@/components/demo";

export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-xl font-bold">Consumer</h1>
      <Demo />
    </main>
  );
}
`,
);

run("npm", ["install", "--no-audit", "--no-fund"], app);

console.log("\n4. building the consumer — does the package resolve?");
run("npx", ["next", "build"], app);

console.log("\n5. checking what the consumer's CSS actually carries");
const cssFiles = spawnSync("find", [join(app, ".next"), "-name", "*.css"], {
  encoding: "utf8",
})
  .stdout.split("\n")
  .filter(Boolean);

if (cssFiles.length === 0) {
  console.error("✗ the consumer build produced no CSS");
  process.exit(1);
}

const css = cssFiles.map((file) => readFileSync(file, "utf8")).join("\n");
let failed = false;
for (const [label, pattern] of CSS_CHECKS) {
  const ok = pattern.test(css);
  console.log(`   ${ok ? "✓" : "✗"} ${label}`);
  if (!ok) failed = true;
}

// the library's layer has to sit below Tailwind's
const retro = css.indexOf("@layer retro-ui{");
const utilities = css.indexOf("@layer utilities{");
const ordered = retro !== -1 && utilities !== -1 && retro < utilities;
console.log(`   ${ordered ? "✓" : "✗"} the library's layer sits below Tailwind's`);
if (!ordered) failed = true;

console.log(
  failed
    ? "\n✗ the package does not install as intended"
    : "\n✓ the package installs, resolves, styles and type-checks as intended",
);

// 6. and does it paint? the CSS can contain every string and still
// resolve to nothing, if a token chain is broken
const painted = await paintCheck(app);
if (painted === null) {
  console.log("\n(6. skipped the render check — no browser available)");
} else if (painted.ok) {
  console.log(`\n✓ it paints: ${painted.detail}`);
} else {
  console.error(`\n✗ it does not paint: ${painted.detail}`);
  failed = true;
}

console.log(`\n  the consumer app is at ${app} — poke at it with "npx next start"`);

process.exit(failed ? 1 : 0);

/** serve the consumer, look at a button, and report what it painted */
async function paintCheck(appDir) {
  let chromium;
  try {
    ({ chromium } = await import("@playwright/test"));
  } catch {
    return null;
  }

  const port = 4500 + Math.floor(Math.random() * 400);
  // spawn, not spawnSync: the server never exits, and spawnSync would
  // wait for it forever
  const server = spawn("npx", ["next", "start", "-p", String(port)], {
    cwd: appDir,
    stdio: "ignore",
    detached: true,
  });
  server.unref();

  try {
    // wait for the server to answer
    const deadline = Date.now() + 30_000;
    let up = false;
    while (Date.now() < deadline) {
      const ping = spawnSync("curl", [
        "-s",
        "-o",
        "/dev/null",
        `http://127.0.0.1:${port}/`,
      ]);
      if (ping.status === 0) {
        up = true;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    if (!up) return { ok: false, detail: "the consumer never came up" };

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });

    const button = await page.locator("button").first().evaluate((el) => {
      const s = getComputedStyle(el);
      return { background: s.backgroundColor, border: s.borderTopWidth };
    });
    await browser.close();

    // the primary button is the accent colour — a broken token chain
    // would leave it transparent
    const painted = button.background !== "rgba(0, 0, 0, 0)" && button.border !== "0px";
    return {
      ok: painted,
      detail: painted
        ? `the primary button painted ${button.background}`
        : `the primary button painted ${button.background} with a ${button.border} border`,
    };
  } catch (error) {
    return { ok: false, detail: String(error).split("\n")[0] };
  } finally {
    try {
      process.kill(-server.pid);
    } catch {
      /* the server may already be gone */
    }
  }
}
