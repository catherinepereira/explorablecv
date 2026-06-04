import { useMemo, useState } from "react";
import { KERNELS, convolve, maxPool2, relu, type Matrix } from "../lib/conv";
import { generatedPattern } from "../lib/image";
import { MatrixCanvas } from "../components/MatrixCanvas";
import { ImagePicker } from "../components/ImagePicker";
import { ColorLegend } from "../components/ColorLegend";

const IMG_SIZE = 64;

interface LayerCfg {
  kernels: (keyof typeof KERNELS)[];
  relu: boolean;
  pool: boolean;
}

const KERNEL_OPTIONS = Object.keys(KERNELS) as (keyof typeof KERNELS)[];

export function MultiLayerMode() {
  const [input, setInput] = useState<Matrix>(() =>
    generatedPattern("circle", IMG_SIZE),
  );
  const [imageId, setImageId] = useState("circle");
  const [layers, setLayers] = useState<LayerCfg[]>([
    { kernels: ["sobel-x", "sobel-y", "edge"], relu: true, pool: true },
    { kernels: ["edge", "sharpen"], relu: true, pool: true },
    { kernels: ["blur"], relu: false, pool: false },
  ]);

  const stages = useMemo(() => {
    const result: { label: string; maps: Matrix[] }[] = [
      { label: "Input", maps: [input] },
    ];
    let prev: Matrix[] = [input];
    layers.forEach((layer, idx) => {
      const next: Matrix[] = [];
      for (const k of layer.kernels) {
        // Hand-picked kernels, so average across previous feature maps
        // rather than learn a per-channel mix the way a trained network would.
        const acc = prev.map((m) =>
          convolve(m, KERNELS[k], { stride: 1, padding: "same" }),
        );
        let combined = acc[0];
        for (let i = 1; i < acc.length; i++) {
          combined = combined.map((row, y) =>
            row.map((v, x) => v + acc[i][y][x]),
          );
        }
        if (acc.length > 1) {
          combined = combined.map((row) => row.map((v) => v / acc.length));
        }
        let out = combined;
        if (layer.relu) out = relu(out);
        if (layer.pool) out = maxPool2(out);
        next.push(out);
      }
      result.push({ label: `Layer ${idx + 1}`, maps: next });
      prev = next;
    });
    return result;
  }, [input, layers]);

  function setLayerKernel(li: number, ki: number, name: keyof typeof KERNELS) {
    setLayers((ls) =>
      ls.map((l, i) =>
        i === li
          ? { ...l, kernels: l.kernels.map((k, j) => (j === ki ? name : k)) }
          : l,
      ),
    );
  }
  function addKernel(li: number) {
    setLayers((ls) =>
      ls.map((l, i) =>
        i === li && l.kernels.length < 4
          ? { ...l, kernels: [...l.kernels, "edge"] }
          : l,
      ),
    );
  }
  function removeKernel(li: number) {
    setLayers((ls) =>
      ls.map((l, i) =>
        i === li && l.kernels.length > 1
          ? { ...l, kernels: l.kernels.slice(0, -1) }
          : l,
      ),
    );
  }
  function toggle(li: number, field: "relu" | "pool") {
    setLayers((ls) =>
      ls.map((l, i) => (i === li ? { ...l, [field]: !l[field] } : l)),
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase dark:text-zinc-500">
            ReLU
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            The Rectified Linear Unit clamps negative values to zero and leaves
            positives unchanged:{" "}
            <span className="font-mono text-[0.85em] text-blue-600 dark:text-blue-400">
              f(x) = max(0, x)
            </span>
            . It adds the nonlinearity that lets a stack of layers model more
            than a single linear filter.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase dark:text-zinc-500">
            Max pooling
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            A{" "}
            <span className="font-mono text-[0.85em] text-blue-600 dark:text-blue-400">
              2×2
            </span>{" "}
            window slides across the feature map and keeps only the largest
            value in each window. It halves the spatial size and adds slight
            translation invariance, so small shifts in the input barely change
            the output.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-zinc-400">Image:</span>
        <ImagePicker
          size={IMG_SIZE}
          value={imageId}
          onChange={(m, id) => {
            setInput(m);
            setImageId(id);
          }}
        />
      </div>

      <div className="space-y-4">
        {layers.map((layer, li) => (
          <div
            key={li}
            className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="shrink-0 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
              Layer {li + 1}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {layer.kernels.map((k, ki) => (
                <select
                  key={ki}
                  value={k}
                  onChange={(e) =>
                    setLayerKernel(
                      li,
                      ki,
                      e.target.value as keyof typeof KERNELS,
                    )
                  }
                  className="rounded border border-gray-300 px-2 py-1 text-sm dark:border-zinc-700"
                >
                  {KERNEL_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ))}
              <button
                onClick={() => addKernel(li)}
                aria-label="Add filter"
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-blue-200 bg-blue-50 text-xs text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/50"
              >
                +
              </button>
              <button
                onClick={() => removeKernel(li)}
                aria-label="Remove filter"
                className="flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-blue-200 bg-blue-50 text-xs text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/50"
              >
                −
              </button>
            </div>
            <div className="w-px self-stretch bg-gray-200 dark:bg-zinc-800" />
            <label className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={layer.relu}
                onChange={() => toggle(li, "relu")}
                className="accent-blue-600 dark:accent-blue-400"
              />
              ReLU
            </label>
            <label className="flex items-center gap-1.5 text-sm">
              <input
                type="checkbox"
                checked={layer.pool}
                onChange={() => toggle(li, "pool")}
                className="accent-blue-600 dark:accent-blue-400"
              />
              MaxPool 2×2
            </label>
          </div>
        ))}
      </div>

      <ColorLegend />

      <div className="overflow-x-auto">
        <div className="flex min-w-fit items-start gap-6 pb-4">
          {stages.map((stage, si) => (
            <div key={si} className="flex flex-col items-center gap-2">
              <h4 className="text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
                {stage.label}
              </h4>
              <div className="flex flex-col gap-2">
                {stage.maps.map((m, mi) => (
                  <div key={mi} className="flex flex-col items-center">
                    <MatrixCanvas
                      matrix={m}
                      cellSize={Math.max(2, Math.floor(96 / m.length))}
                      colormap={si === 0 ? "gray" : "diverging"}
                    />
                    <span className="font-mono text-[10px] text-gray-500 dark:text-zinc-500">
                      {m[0]?.length ?? 0}×{m.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
