import { DEMOS, SERIES_URL, pathFor } from "@explorables/catalog";
import { ThemeToggle } from "@explorables/ui/ThemeToggle";
import { CreditLine } from "@explorables/ui/CreditLine";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-3 flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            <span aria-hidden="true">🧭</span> CV Explorables
          </h1>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-zinc-500">
            <ThemeToggle />
            <CreditLine repo="explorablecv" />
          </div>
        </header>
        <p className="mb-12 max-w-2xl text-sm text-gray-600 dark:text-zinc-400">
          Interactive explainers for computer vision ideas. Each one runs in
          your browser. The source is one monorepo on{" "}
          <a
            href={SERIES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            GitHub
          </a>
          .
        </p>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {DEMOS.map((demo) => (
            <li key={demo.slug}>
              <a
                href={pathFor(demo.slug)}
                className="group block h-full overflow-hidden rounded-lg border border-gray-200 transition-colors hover:border-blue-300 dark:border-zinc-800 dark:hover:border-blue-800"
              >
                <div className="aspect-[3/2] overflow-hidden border-b border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <img
                    src={`${import.meta.env.BASE_URL}previews/${demo.slug}.png`}
                    alt={`${demo.title} preview`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-1 font-medium text-gray-900 dark:text-zinc-100">
                    <span aria-hidden="true">{demo.emoji}</span> {demo.title}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-zinc-400">
                    {demo.blurb}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
