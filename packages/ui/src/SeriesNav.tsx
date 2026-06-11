import { DEMOS, pathFor } from "@explorables/catalog";

type Props = {
  currentSlug: string;
};

export function SeriesNav({ currentSlug }: Props) {
  return (
    <nav className="mb-5 flex flex-wrap items-baseline gap-2 text-xs text-gray-500 dark:text-zinc-500">
      <a
        href="/"
        className="tracking-wider text-gray-500 uppercase hover:text-blue-600 dark:text-zinc-500 dark:hover:text-blue-400"
      >
        Explorables Series
      </a>
      <span className="text-gray-300 dark:text-zinc-700">/</span>
      {DEMOS.map((item, i) => (
        <span key={item.slug} className="flex items-baseline gap-2">
          {item.slug === currentSlug ? (
            <span className="font-medium text-gray-900 dark:text-zinc-100">
              {item.title}
            </span>
          ) : (
            <a
              href={pathFor(item.slug)}
              className="text-gray-500 underline-offset-2 hover:text-blue-600 hover:underline dark:text-zinc-400 dark:hover:text-blue-400"
            >
              {item.title}
            </a>
          )}
          {i < DEMOS.length - 1 && (
            <span className="text-gray-300 dark:text-zinc-700">·</span>
          )}
        </span>
      ))}
    </nav>
  );
}
