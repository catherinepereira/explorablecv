// Assemble every published app's build into one static tree for single-project
// hosting. The hub goes at the root, each demo under /<slug>/. Run after the
// workspace build (see the root "build" script). Each app was built separately,
// so its dist references only its own assets, and a visitor to one demo never
// loads another's bundle

import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { DEMOS } from "../packages/catalog/src/catalog.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const APPS_DIR = join(ROOT, "apps");
const OUT = join(ROOT, "dist-site");

// The catalog is the source of truth for what ships: the hub at /, plus each
// demo it lists at /<slug>/. Deferred demos stay out until added there, so the
// local build matches the deploy
const HUB = "hub";
const slugs = [HUB, ...DEMOS.map((demo) => demo.slug)];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const slug of slugs) {
  const dist = join(APPS_DIR, slug, "dist");
  if (!existsSync(join(dist, "index.html"))) {
    throw new Error(`${slug} has no build, run the workspace build first`);
  }
  const dest = slug === HUB ? OUT : join(OUT, slug);
  cpSync(dist, dest, { recursive: true });
  console.log(`${slug} -> ${slug === HUB ? "/" : `/${slug}/`}`);
}
