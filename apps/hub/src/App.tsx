import { DEMOS, SERIES_URL, pathFor } from "@explorables/catalog";
import { ThemeToggle } from "@explorables/ui/ThemeToggle";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-3 flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Explorables
          </h1>
          <ThemeToggle />
        </header>
        <p className="mb-12 max-w-2xl text-sm text-gray-600 dark:text-zinc-400">
          Interactive explainers for machine learning ideas. Each one runs in
          your browser. Open the{" "}
          <a
            href={SERIES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            full list on GitHub
          </a>
          .
        </p>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DEMOS.map((demo) => (
            <li key={demo.slug}>
              <a
                href={pathFor(demo.slug)}
                className="block h-full rounded-lg border border-gray-200 p-5 transition-colors hover:border-blue-300 hover:bg-blue-50/40 dark:border-zinc-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
              >
                <div className="mb-1 font-medium text-gray-900 dark:text-zinc-100">
                  {demo.title}
                </div>
                <div className="text-sm text-gray-600 dark:text-zinc-400">
                  {demo.blurb}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
