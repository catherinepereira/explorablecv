// Single source of truth for the demo series. SeriesNav, the hub landing page,
// and the generated sitemap all read this. Adding a demo means adding one entry
// here, not editing every app

// The GitHub list that SeriesNav links to as the series root
export const SERIES_URL =
  "https://github.com/stars/catherinepereira/lists/explorables";

export type Demo = {
  // Folder name under apps/, and the URL path segment: /<slug>
  slug: string;
  // Short title for nav and cards
  title: string;
  // One-line description for cards and meta tags
  blurb: string;
  // The current standalone deployment, kept for redirects from the old origin
  // to the new /<slug> path during cutover
  legacyUrl: string;
};

export const DEMOS: Demo[] = [
  {
    slug: "bpe-playground",
    title: "BPE Playground",
    blurb: "Interactive Byte Pair Encoding playground.",
    legacyUrl: "https://bpe-playground.vercel.app/",
  },
  {
    slug: "cnn-playground",
    title: "CNN Playground",
    blurb: "Interactive convolutional neural network playground.",
    legacyUrl: "https://cnn-playground.vercel.app/",
  },
  {
    slug: "cnn-visualizer",
    title: "CNN Visualizer",
    blurb: "A per-CNN-layer view of CIFAR-10.",
    legacyUrl: "https://cnn-visualizer-cat.vercel.app/",
  },
  {
    slug: "cnn-architecture-comparison",
    title: "CNN Architectures",
    blurb: "Compare convolutional architectures side by side.",
    legacyUrl: "https://cnn-architecture-comparison.vercel.app/",
  },
  {
    slug: "cv-interpretability",
    title: "CV Interpretability",
    blurb: "See where image classifiers look when they decide.",
    legacyUrl: "https://cv-interpretability.vercel.app/",
  },
  {
    slug: "embeddings-playground",
    title: "Embeddings Playground",
    blurb:
      "What an embedding is, from one audio clip to 25,000 tracks you can explore and play.",
    legacyUrl: "https://embeddings-playground-cat.vercel.app/",
  },
  {
    slug: "transformer-playground",
    title: "Transformer Playground",
    blurb: "An interactive walkthrough of transformer architecture.",
    legacyUrl: "https://transformer-playground.vercel.app/",
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
    if (!demo.legacyUrl.startsWith("https://")) {
      throw new Error(
        `legacyUrl for ${demo.slug} must be https://, got ${demo.legacyUrl}`,
      );
    }
  }
}
