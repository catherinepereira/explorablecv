import type { Stats } from "../types";

type Props = { stats: Stats };

export function StatsPanel({ stats }: Props) {
  const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
  const params =
    stats.params >= 1e6
      ? `${(stats.params / 1e6).toFixed(2)}M`
      : `${(stats.params / 1e3).toFixed(0)}K`;

  const sortedClasses = Object.entries(stats.per_class_accuracy).sort(
    (a, b) => b[1] - a[1],
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
      <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
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
        <div className="mb-2 font-mono text-[10px] tracking-wide text-gray-500 uppercase dark:text-zinc-500">
          Per-class accuracy
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 md:grid-cols-5">
          {sortedClasses.map(([cls, acc]) => (
            <div
              key={cls}
              className="flex items-center gap-2 font-mono text-xs"
            >
              <div className="w-20 truncate text-gray-700 dark:text-zinc-300">
                {cls}
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded bg-gray-200 dark:bg-zinc-700">
                <div
                  className="h-full bg-gray-800 dark:bg-zinc-300"
                  style={{ width: `${(acc * 100).toFixed(1)}%` }}
                />
              </div>
              <div className="w-10 text-right text-gray-600 dark:text-zinc-400">
                {pct(acc)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-wide text-gray-500 uppercase dark:text-zinc-500">
        {label}
      </div>
      <div className="font-mono text-xl font-semibold">{value}</div>
    </div>
  );
}
