import type { Architecture } from "../architectures/data";

export function NarrativePanel({ arch }: { arch: Architecture }) {
  const p = arch.problemSolved;
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
        <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase dark:text-zinc-500">
          Before
        </div>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
          {p.before}
        </p>
      </div>
      <div className="rounded-lg border border-blue-600 bg-gray-50/40 p-4 dark:border-blue-400 dark:bg-zinc-800/40">
        <div className="mb-2 text-xs tracking-wider text-blue-500 uppercase dark:text-blue-300">
          What it fixed
        </div>
        <p className="mb-2 text-sm leading-relaxed font-medium text-gray-900 dark:text-zinc-100">
          {p.headline}
        </p>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
          {p.fixed}
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
        <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase dark:text-zinc-500">
          Mechanism
        </div>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-zinc-400">
          {p.mechanism}
        </p>
      </div>
    </div>
  );
}
