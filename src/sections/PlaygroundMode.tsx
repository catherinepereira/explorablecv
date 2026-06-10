import { useMemo, useState } from "react";
import { KERNELS, convolve, type Matrix } from "../lib/conv";
import { generatedPattern } from "../lib/image";
import { MatrixCanvas } from "../components/MatrixCanvas";
import { KernelEditor } from "../components/KernelEditor";
import { ImagePicker } from "../components/ImagePicker";
import { ColorLegend } from "../components/ColorLegend";

const IMG_SIZE = 64;

export function PlaygroundMode() {
  const [input, setInput] = useState<Matrix>(() =>
    generatedPattern("circle", IMG_SIZE),
  );
  const [imageId, setImageId] = useState("circle");
  const [kernel, setKernel] = useState<Matrix>(KERNELS["sobel-x"]);
  const [stride, setStride] = useState(1);
  const [padding, setPadding] = useState<"same" | "valid">("same");

  const output = useMemo(
    () => convolve(input, kernel, { stride, padding }),
    [input, kernel, stride, padding],
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase dark:text-zinc-500">
            Stride
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            How many pixels the kernel moves between positions. Stride{" "}
            <span className="font-mono text-[0.85em] text-blue-600 dark:text-blue-400">
              1
            </span>{" "}
            visits every pixel; stride{" "}
            <span className="font-mono text-[0.85em] text-blue-600 dark:text-blue-400">
              2
            </span>{" "}
            skips every other one, shrinking the output by half.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase dark:text-zinc-500">
            Padding
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            A border of zeros around the input so the kernel can sit on edge
            pixels.{" "}
            <span className="font-mono text-[0.85em] text-blue-600 dark:text-blue-400">
              same
            </span>{" "}
            adds enough to keep the output the same size as the input;{" "}
            <span className="font-mono text-[0.85em] text-blue-600 dark:text-blue-400">
              valid
            </span>{" "}
            adds none, so the output shrinks by (kernel size − 1).
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
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-zinc-400">
          Preset:
        </span>
        {Object.keys(KERNELS).map((k) => (
          <button
            key={k}
            onClick={() => setKernel(KERNELS[k].map((r) => r.slice()))}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 font-mono text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/40"
          >
            {k}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[auto_auto_auto]">
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
            Input{" "}
            <span className="font-mono normal-case">
              {IMG_SIZE}×{IMG_SIZE}
            </span>
          </h3>
          <MatrixCanvas matrix={input} cellSize={6} />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
              Kernel <span className="font-mono normal-case">3×3</span>
            </h3>
            <KernelEditor kernel={kernel} onChange={setKernel} />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-zinc-300">
              <span>Stride:</span>
              <select
                value={stride}
                onChange={(e) => setStride(parseInt(e.target.value))}
                className="rounded border border-gray-300 px-2 py-1 text-sm dark:border-zinc-700"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-zinc-300">
              <span>Padding:</span>
              <select
                value={padding}
                onChange={(e) => setPadding(e.target.value as "same" | "valid")}
                className="rounded border border-gray-300 px-2 py-1 text-sm dark:border-zinc-700"
              >
                <option value="same">same</option>
                <option value="valid">valid</option>
              </select>
            </div>
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
            Output{" "}
            <span className="font-mono normal-case">
              {output[0]?.length ?? 0}×{output.length}
            </span>
          </h3>
          <MatrixCanvas matrix={output} cellSize={6} colormap="diverging" />
          <div className="mt-2">
            <ColorLegend />
          </div>
        </div>
      </div>
    </div>
  );
}
