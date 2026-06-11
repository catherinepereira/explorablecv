// Assemble every published app's build into one static tree for single-project
// hosting. The hub goes at the root, each demo under /<slug>/. Run after the
// workspace build (see the root "build" script). Each app was built separately,
// so its dist references only its own assets, and a visitor to one demo never
// loads another's bundle

import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const APPS_DIR = join(ROOT, "apps");
const OUT = join(ROOT, "dist-site");

// The published sites. The hub serves at /, each demo at /<slug>/. Add a demo
// here when it's ready to ship (and to packages/catalog so the nav lists it)
const HUB = "hub";
const DEMOS = [
  "cnn-playground",
  "cnn-visualizer",
  "cnn-architecture-comparison",
  "cv-interpretability",
];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const slug of [HUB, ...DEMOS]) {
  const dist = join(APPS_DIR, slug, "dist");
  if (!existsSync(join(dist, "index.html"))) {
    throw new Error(`${slug} has no build, run the workspace build first`);
  }
  const dest = slug === HUB ? OUT : join(OUT, slug);
  cpSync(dist, dest, { recursive: true });
  console.log(`${slug} -> ${slug === HUB ? "/" : `/${slug}/`}`);
}
