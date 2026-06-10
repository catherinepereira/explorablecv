import type { Sample } from "../types";

type Props = {
  sample: Sample;
  assetBase: string;
  repoUrl: string;
};

const LAYER_EXPLAIN: Record<string, string> = {
  conv1a:
    "First conv. Each channel is one 3x3 filter sweeping the RGB pixels. Most learn edge or color detectors.",
  conv1b:
    "Second conv on the same resolution. Combines the conv1a channels into slightly richer local features.",
  pool1:
    "Max-pool 2x2: halves H/W by keeping the strongest activation in each 2x2 patch. Cheap translation invariance.",
  conv2a:
    "Operates on pooled features, so each unit sees a larger patch of the original image. Mid-level features.",
  conv2b:
    "Second 64-channel conv at this resolution. Refines the conv2a features without changing the channel count.",
  pool2: "Another 2x2 max-pool. Spatial maps are now 8x8.",
  conv3:
    "128 channels of higher-level features. Patterns here start to be class-specific.",
  pool3:
    "Final pool. The 4x4 map covers the input as an 8x8 grid (downsampling factor 1/8 per side); each output cell pools features over an 8x8 region. The actual receptive field is much larger because earlier convs already mixed neighbors.",
};

const LAYER_SOURCE_LINE: Record<string, number> = {
  conv1a: 38,
  conv1b: 39,
  pool1: 62,
  conv2a: 46,
  conv2b: 47,
  pool2: 62,
  conv3: 50,
  pool3: 62,
};

const MODEL_PATH = "cnn_scratch/model.py";

export function LayerStack({ sample, assetBase, repoUrl }: Props) {
  const sampleDir = `${assetBase}sample_${String(sample.id).padStart(2, "0")}/`;
  return (
    <div className="flex flex-col gap-6">
      {sample.layers.map((layer) => {
        const line = LAYER_SOURCE_LINE[layer.name];
        const sourceUrl = line
          ? `${repoUrl}/blob/main/${MODEL_PATH}#L${line}`
          : `${repoUrl}/blob/main/${MODEL_PATH}`;
        return (
          <div
            key={layer.name}
            className="rounded-lg border border-gray-200 p-4 dark:border-zinc-800"
          >
            <div className="mb-1 flex items-baseline justify-between gap-4">
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                title={`${MODEL_PATH}:${line ?? "?"}`}
              >
                {layer.label}
              </a>
              <div className="font-mono text-xs whitespace-nowrap text-gray-500 dark:text-zinc-500">
                {layer.channels_total} ch × {layer.h}×{layer.w}
                {layer.channels_exported < layer.channels_total && (
                  <span> (showing {layer.channels_exported})</span>
                )}
              </div>
            </div>
            <p className="mb-3 text-xs text-gray-600 dark:text-zinc-400">
              {LAYER_EXPLAIN[layer.name]}
            </p>
            <div
              className="grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${Math.min(layer.channels_exported, 16)}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: layer.channels_exported }).map((_, c) => (
                <img
                  key={c}
                  src={`${sampleDir}${layer.name}/ch_${String(c).padStart(2, "0")}.png`}
                  alt={`${layer.name} channel ${c}`}
                  className="aspect-square w-full bg-gray-100 dark:bg-zinc-800"
                  style={{ imageRendering: "pixelated" }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
