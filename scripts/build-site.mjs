// Assemble every app's build into one static tree for single-project hosting.
// The hub goes at the root, each demo under /<slug>/. Run after the workspace
// build (see the root "build" script). Each app was built separately, so its
// dist references only its own assets, and a visitor to one demo never loads
// another's bundle

import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const APPS_DIR = join(ROOT, "apps");
const OUT = join(ROOT, "dist-site");

// The hub serves at /, every other app at /<dir>/. Only git-tracked apps are
// published. The allowlist .gitignore keeps work-in-progress demos out, so the
// local build matches what Vercel deploys from its checkout
const HUB = "hub";

const tracked = new Set(
  execFileSync("git", ["ls-files", "apps"], { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .map((line) => line.split("/")[1])
    .filter(Boolean),
);

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const apps = [...tracked].filter((name) =>
  existsSync(join(APPS_DIR, name, "dist", "index.html")),
);

if (!apps.includes(HUB)) {
  throw new Error("hub has no build; run the workspace build first");
}

for (const app of apps) {
  const dist = join(APPS_DIR, app, "dist");
  const dest = app === HUB ? OUT : join(OUT, app);
  cpSync(dist, dest, { recursive: true });
  console.log(`${app} -> ${app === HUB ? "/" : `/${app}/`}`);
}
