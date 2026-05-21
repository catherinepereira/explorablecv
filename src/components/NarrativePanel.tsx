import type { Architecture } from '../architectures/data'

export function NarrativePanel({ arch }: { arch: Architecture }) {
  const p = arch.problemSolved
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-gray-50/40 dark:bg-zinc-800/40 rounded-lg border border-gray-200 dark:border-zinc-800">
        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-2">Before</div>
        <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">{p.before}</p>
      </div>
      <div className="p-4 bg-gray-50/40 dark:bg-zinc-800/40 rounded-lg border border-blue-600 dark:border-blue-400">
        <div className="text-xs uppercase tracking-wider text-blue-500 dark:text-blue-300 mb-2">What it fixed</div>
        <p className="text-gray-900 dark:text-zinc-100 text-sm leading-relaxed font-medium mb-2">{p.headline}</p>
        <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">{p.fixed}</p>
      </div>
      <div className="p-4 bg-gray-50/40 dark:bg-zinc-800/40 rounded-lg border border-gray-200 dark:border-zinc-800">
        <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-2">Mechanism</div>
        <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed">{p.mechanism}</p>
      </div>
    </div>
  )
}
