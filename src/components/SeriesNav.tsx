const SERIES_URL = "https://github.com/stars/catherinepereira/lists/cat-s-explorables";

type SeriesItem = {
  slug: string;
  title: string;
  href: string;
};

const SERIES: SeriesItem[] = [
  { slug: "bpe-playground", title: "BPE Playground", href: "https://bpe-playground.vercel.app/" },
  { slug: "cnn-playground", title: "CNN Playground", href: "https://cnn-playground.vercel.app/" },
  { slug: "cnn-visualizer", title: "CNN Visualizer", href: "https://cnn-visualizer-cat.vercel.app/" },
  { slug: "cnn-architecture-comparison", title: "CNN Architectures", href: "https://cnn-architecture-comparison.vercel.app/" },
  { slug: "cv-interpretability", title: "CV Interpretability", href: "https://cv-interpretability.vercel.app/" },
];

type Props = {
  currentSlug: string;
};

export function SeriesNav({ currentSlug }: Props) {
  return (
    <nav className="mb-5 flex items-baseline gap-2 text-xs text-gray-500 dark:text-zinc-500 flex-wrap">
      <a
        href={SERIES_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="uppercase tracking-wider text-gray-500 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400"
      >
        Explorables Series
      </a>
      <span className="text-gray-300 dark:text-zinc-700">/</span>
      {SERIES.map((item, i) => (
        <span key={item.slug} className="flex items-baseline gap-2">
          {item.slug === currentSlug ? (
            <span className="text-gray-900 dark:text-zinc-100 font-medium">
              {item.title}
            </span>
          ) : (
            <a
              href={item.href}
              className="text-gray-500 dark:text-zinc-400 underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
            >
              {item.title}
            </a>
          )}
          {i < SERIES.length - 1 && (
            <span className="text-gray-300 dark:text-zinc-700">·</span>
          )}
        </span>
      ))}
    </nav>
  );
}
