// End-of-page references block. Pass a list of {authors, year, title, href}.
// Use inline links at the point of mention inside sections; this block is the
// catch-all at the bottom of the page

export type Reference = {
  authors: string;
  year: number | string;
  title: string;
  href: string;
};

type Props = {
  items: Reference[];
};

export function References({ items }: Props) {
  return (
    <section
      id="references"
      aria-label="References"
      className="scroll-mt-20 mt-2"
    >
      <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-3">
        References
      </div>
      <ol className="flex flex-col gap-1.5 text-xs text-gray-600 dark:text-zinc-400 list-decimal pl-5 marker:text-gray-400 marker:dark:text-zinc-500">
        {items.map((r) => (
          <li key={r.href} className="leading-relaxed">
            <a
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 underline-offset-2 hover:underline"
            >
              {r.title}. {r.authors} ({r.year})
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
