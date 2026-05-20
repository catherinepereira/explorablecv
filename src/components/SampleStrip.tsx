import type { Sample } from '../types'

type Props = {
  samples: Sample[]
  selected: number
  onSelect: (i: number) => void
  assetBase: string
}

export function SampleStrip({ samples, selected, onSelect, assetBase }: Props) {
  const indexed = samples.map((s, i) => ({ s, i }))
  const correct = indexed.filter(({ s }) => s.correct)
  const wrong = indexed.filter(({ s }) => !s.correct)

  return (
    <div className="space-y-4">
      <Row
        items={correct}
        selected={selected}
        onSelect={onSelect}
        assetBase={assetBase}
      />
      {wrong.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-wide text-red-500 dark:text-red-400 font-mono mb-1">
            Incorrect predictions
          </div>
          <Row
            items={wrong}
            selected={selected}
            onSelect={onSelect}
            assetBase={assetBase}
          />
        </div>
      )}
    </div>
  )
}

function Row({
  items, selected, onSelect, assetBase,
}: {
  items: { s: Sample; i: number }[]
  selected: number
  onSelect: (i: number) => void
  assetBase: string
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      {items.map(({ s, i }) => {
        const isSelected = i === selected
        const borderClass = !s.correct
          ? (isSelected
              ? 'border-red-300 dark:border-red-700 bg-red-50/40 dark:bg-red-950/30'
              : 'border-red-200 dark:border-red-900 hover:border-red-300 dark:hover:border-red-700')
          : (isSelected
              ? 'border-gray-400 dark:border-zinc-500 bg-gray-50 dark:bg-zinc-800/60'
              : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600')
        return (
          <button
            key={s.id}
            onClick={() => onSelect(i)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition ${borderClass}`}
          >
            <img
              src={`${assetBase}sample_${String(s.id).padStart(2, '0')}/input.png`}
              alt={s.true_class}
              className="w-24 h-24"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="text-[10px] font-mono text-gray-400 dark:text-zinc-500">#{s.dataset_id}</div>
            <div className="text-xs font-mono text-gray-700 dark:text-zinc-300 text-center leading-tight">
              <div>{s.true_class}</div>
              {!s.correct && <div className="text-red-600 dark:text-red-400">→ {s.pred_class}</div>}
            </div>
          </button>
        )
      })}
    </div>
  )
}
