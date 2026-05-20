import type { Sample } from '../types'

type Props = {
  sample: Sample
  classes: string[]
}

export function Predictions({ sample, classes }: Props) {
  const sorted = [...classes].sort((a, b) => sample.probs[b] - sample.probs[a])

  return (
    <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
      <div className="text-sm mb-3">
        True: <span className="font-mono">{sample.true_class}</span><br />
        Predicted: <span className={`font-mono ${sample.correct ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {sample.pred_class}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {sorted.map((cls) => {
          const p = sample.probs[cls]
          const isTrue = cls === sample.true_class
          const isPred = cls === sample.pred_class
          return (
            <div key={cls} className="flex items-center gap-2 text-xs font-mono">
              <div className={`w-20 truncate ${isTrue ? 'font-semibold' : ''}`}>{cls}</div>
              <div className="flex-1 h-3 bg-gray-100 dark:bg-zinc-800 rounded overflow-hidden">
                <div
                  className={isPred && !sample.correct
                    ? 'bg-red-500 dark:bg-red-500 h-full'
                    : 'bg-gray-800 dark:bg-zinc-300 h-full'}
                  style={{ width: `${(p * 100).toFixed(1)}%` }}
                />
              </div>
              <div className="w-10 text-right text-gray-600 dark:text-zinc-400">{(p * 100).toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
