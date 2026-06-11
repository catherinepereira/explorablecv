// Single source of truth for the demo series. SeriesNav, the home landing page,
// and the generated sitemap all read this. Adding a demo means adding one entry
// here, not editing every app

// The monorepo all the demos live in
export const SERIES_URL = "https://github.com/catherinepereira/explorables";

export type Demo = {
  // Folder name under apps/, and the URL path segment: /<slug>
  slug: string;
  // Short title for nav and cards
  title: string;
  // Shown before the title on the home cards
  emoji: string;
  // One-line description for cards and meta tags
  blurb: string;
};

export const DEMOS: Demo[] = [
  {
    slug: "cnn-playground",
    title: "CNN Playground",
    emoji: "🖍️",
    blurb: "Interactive convolutional neural network playground.",
  },
  {
    slug: "cnn-visualizer",
    title: "CNN Visualizer",
    emoji: "🖼️",
    blurb: "A per-CNN-layer view of CIFAR-10.",
  },
  {
    slug: "cnn-architecture-comparison",
    title: "CNN Architectures",
    emoji: "🕰️",
    blurb: "Compare convolutional architectures side by side.",
  },
  {
    slug: "cv-interpretability",
    title: "CV Interpretability",
    emoji: "🔬",
    blurb: "See where image classifiers look when they decide.",
  },
  {
    slug: "vit-playground",
    title: "ViT Playground",
    emoji: "👀",
    blurb: "Patchify an image and watch a Vision Transformer attend.",
  },
  {
    slug: "backbone-benchmark",
    title: "Backbone Benchmark",
    emoji: "🦴",
    blurb: "Compare image-classification backbones on accuracy vs latency.",
  },
  {
    slug: "cv-segmentation-playground",
    title: "Segmentation",
    emoji: "🍎",
    blurb: "Grow regions by hand, then run a real segmentation model.",
  },
  {
    slug: "cv-detection-playground",
    title: "Object Detection",
    emoji: "🔍",
    blurb: "Run a real detector, then unpack IoU, NMS, and precision/recall.",
  },
];

export function pathFor(slug: string): string {
  return `/${slug}`;
}

// URL-path-safe: lowercase alphanumerics and single hyphens, no leading or
// trailing hyphen. Rejects slugs that could escape the path (/, .., //host, :)
// or inject a scheme
const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

// Guards the catalog against entries that would break routing or inject a
// hostile link, the way an untrusted contributor PR could. Throws on the first
// bad entry. Safe to call at startup, and exercised by the catalog test
export function validateCatalog(demos: Demo[] = DEMOS): void {
  const seen = new Set<string>();
  for (const demo of demos) {
    if (!SLUG_PATTERN.test(demo.slug)) {
      throw new Error(`Invalid demo slug: ${JSON.stringify(demo.slug)}`);
    }
    if (seen.has(demo.slug)) {
      throw new Error(`Duplicate demo slug: ${demo.slug}`);
    }
    seen.add(demo.slug);
  }
}
