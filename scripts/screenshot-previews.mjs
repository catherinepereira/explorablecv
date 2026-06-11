// Capture a preview thumbnail of each demo for the home page cards. Start the
// dev servers first (`pnpm dev`), then run this. Each demo is screenshotted at
// its dev port and written to apps/home/public/previews/<slug>.png.
//
//   pnpm dlx playwright install chromium   # first time
//   node scripts/screenshot-previews.mjs

import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "apps/home/public/previews");

// slug -> dev port, in the catalog order
const SITES = [
  ["cnn-playground", 5501],
  ["cnn-visualizer", 5502],
  ["cnn-architecture-comparison", 5503],
  ["cv-interpretability", 5504],
  ["vit-playground", 5505],
  ["backbone-benchmark", 5506],
  ["cv-detection-playground", 5507],
  ["cv-segmentation-playground", 5508],
];

const WIDTH = 1200;
const HEIGHT = 800;

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 2,
});

for (const [slug, port] of SITES) {
  const url = `http://localhost:${port}/${slug}/`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
  } catch {
    // networkidle can time out on the model-loading demos, the page is still
    // painted by then, so fall back to a fixed settle
    await page.waitForTimeout(2000);
  }
  await page.waitForTimeout(800);
  const file = join(OUT, `${slug}.png`);
  // Capture just the top of the page (the title + first interactive panel)
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });
  console.log(`${slug} -> ${file}`);
}

await browser.close();
