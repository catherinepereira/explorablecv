import type { Architecture } from '../architectures/data'
import { useAppStore } from '../stores/appStore'
import { ArchDiagram } from './ArchDiagram'
import { FeatureMaps } from './FeatureMaps'
import { NarrativePanel } from './NarrativePanel'

export function ArchOverview({ arch }: { arch: Architecture }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-baseline gap-3 mb-1 flex-wrap">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-zinc-100">{arch.name}</h2>
          <span className="text-gray-500 dark:text-zinc-500 text-sm">
            {arch.year} · {arch.authors}
          </span>
          <a
            href={arch.paperUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
            title={arch.paperCite}
          >
            paper ↗
          </a>
        </div>
      </div>
      <NarrativePanel arch={arch} />
      <ArchDiagram arch={arch} />
    </div>
  )
}

export function ArchFeatureMaps({ arch }: { arch: Architecture }) {
  const state = useAppStore((s) => s.archStates[arch.id])
  if (!state?.result) return null
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-zinc-100">Feature maps</h3>
      <FeatureMaps result={state.result} />
    </div>
  )
}
