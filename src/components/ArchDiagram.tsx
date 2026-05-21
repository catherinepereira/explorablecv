import type { Architecture, LayerBlock } from '../architectures/data'

const KIND_COLORS: Record<LayerBlock['kind'], string> = {
  conv:          'bg-blue-50  dark:bg-blue-500/20  border-blue-300  dark:border-blue-400  text-gray-900 dark:text-zinc-100',
  pool:          'bg-gray-50  dark:bg-zinc-800     border-gray-200  dark:border-zinc-800  text-gray-600 dark:text-zinc-400',
  fc:            'bg-red-50   dark:bg-red-500/20   border-red-300   dark:border-red-400   text-gray-900 dark:text-zinc-100',
  relu:          'bg-green-50 dark:bg-green-500/20 border-green-300 dark:border-green-400 text-gray-900 dark:text-zinc-100',
  norm:          'bg-gray-50  dark:bg-zinc-800     border-gray-200  dark:border-zinc-800  text-gray-600 dark:text-zinc-400',
  concat:        'bg-blue-50  dark:bg-blue-500/20  border-blue-300  dark:border-blue-400  text-gray-900 dark:text-zinc-100',
  add:           'bg-blue-50  dark:bg-blue-500/20  border-blue-300  dark:border-blue-400  text-gray-900 dark:text-zinc-100',
  'dense-block': 'bg-blue-50  dark:bg-blue-500/20  border-blue-300  dark:border-blue-400  text-gray-900 dark:text-zinc-100',
}

export function ArchDiagram({ arch }: { arch: Architecture }) {
  return (
    <div className="p-4 bg-gray-50/40 dark:bg-zinc-800/40 rounded-lg border border-gray-200 dark:border-zinc-800">
      <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-3">
        Architecture · {arch.params} params
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        {arch.diagram.map((block, i) => (
          <div key={block.id} className="flex items-center gap-2">
            <div
              className={`px-3 py-2 rounded-sm border ${KIND_COLORS[block.kind]} text-xs`}
              title={block.detail ?? block.kind}
            >
              <div className="font-medium">{block.label}</div>
              {block.out && <div className="text-gray-500 dark:text-zinc-500 text-[10px] mt-0.5">{block.out}</div>}
            </div>
            {i < arch.diagram.length - 1 && <span className="text-gray-500 dark:text-zinc-500">→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
