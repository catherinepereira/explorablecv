import type { Stats } from '../types'

type Props = { stats: Stats }

export function StatsPanel({ stats }: Props) {
  const pct = (x: number) => `${(x * 100).toFixed(1)}%`
  const params = stats.params >= 1e6
    ? `${(stats.params / 1e6).toFixed(2)}M`
    : `${(stats.params / 1e3).toFixed(0)}K`

  const sortedClasses = Object.entries(stats.per_class_accuracy)
    .sort((a, b) => b[1] - a[1])

  return (
    <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4 bg-gray-50/40 dark:bg-zinc-800/40">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Stat label="Test accuracy" value={pct(stats.test_accuracy)} />
        <Stat label="Parameters" value={params} />
        {stats.epochs_trained !== undefined && (
          <Stat label="Epochs trained" value={String(stats.epochs_trained)} />
        )}
        {stats.best_val_acc !== undefined && (
          <Stat label="Best val acc" value={pct(stats.best_val_acc)} />
        )}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-zinc-500 font-mono mb-2">
          Per-class accuracy
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-1.5">
          {sortedClasses.map(([cls, acc]) => (
            <div key={cls} className="flex items-center gap-2 text-xs font-mono">
              <div className="w-20 truncate text-gray-700 dark:text-zinc-300">{cls}</div>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-zinc-700 rounded overflow-hidden">
                <div className="bg-gray-800 dark:bg-zinc-300 h-full" style={{ width: `${(acc * 100).toFixed(1)}%` }} />
              </div>
              <div className="w-10 text-right text-gray-600 dark:text-zinc-400">{pct(acc)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-zinc-500 font-mono">{label}</div>
      <div className="text-xl font-semibold font-mono">{value}</div>
    </div>
  )
}
