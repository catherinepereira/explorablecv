import { useEffect, useRef } from 'react'
import { renderFeatureMap } from '../utils/featureMap'
import type { InferenceResult } from '../utils/inference'

const MAX_CHANNELS = 16

export function FeatureMaps({ result }: { result: InferenceResult }) {
  const names = Object.keys(result.featureMaps)
  if (names.length === 0) {
    return (
      <div className="p-4 bg-gray-50/40 dark:bg-zinc-800/40 rounded-lg border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-500 text-sm">
        This model's ONNX export does not include intermediate feature maps. Re-export with
        additional outputs to enable this view.
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4">
      {names.map((name) => (
        <FeatureMapRow
          key={name}
          name={name}
          data={result.featureMaps[name]}
          shape={result.featureShapes[name]}
        />
      ))}
    </div>
  )
}

function FeatureMapRow({
  name,
  data,
  shape,
}: {
  name: string
  data: Float32Array
  shape: readonly number[]
}) {
  const channels = Math.min(shape[1] ?? 1, MAX_CHANNELS)
  return (
    <div className="p-4 bg-gray-50/40 dark:bg-zinc-800/40 rounded-lg border border-gray-200 dark:border-zinc-800">
      <div className="flex items-baseline justify-between mb-3">
        <div className="text-sm text-gray-900 dark:text-zinc-100 font-medium">{name}</div>
        <div className="text-xs text-gray-500 dark:text-zinc-500">
          {shape.join(' × ')} · showing first {channels} channels
        </div>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: channels }, (_, c) => (
          <FeatureMapCanvas key={c} data={data} shape={shape} channel={c} />
        ))}
      </div>
    </div>
  )
}

function FeatureMapCanvas({
  data,
  shape,
  channel,
}: {
  data: Float32Array
  shape: readonly number[]
  channel: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) renderFeatureMap(ref.current, data, shape, channel)
  }, [data, shape, channel])
  return (
    <canvas
      ref={ref}
      className="w-full aspect-square bg-white dark:bg-zinc-900 rounded-sm"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
