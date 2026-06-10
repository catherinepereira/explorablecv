import { useEffect, useMemo, useState } from "react";
import { KERNELS, convolve, type Matrix } from "../lib/conv";
import { generatedPattern } from "../lib/image";
import { MatrixCanvas } from "../components/MatrixCanvas";
import { KernelEditor } from "../components/KernelEditor";
import { ImagePicker } from "../components/ImagePicker";
import { ColorLegend } from "../components/ColorLegend";
import { StepControls } from "@explorables/ui/StepControls";

const IMG_SIZE = 64;
const CELL = 8;
const SPEEDS = [0.5, 1, 2, 4, 8, 16];
const BASE_INTERVAL_MS = 120;

export function SingleConvMode() {
  const [kernelName, setKernelName] = useState<keyof typeof KERNELS>("edge");
  const [imageId, setImageId] = useState("checker");
  const [input, setInput] = useState<Matrix>(() =>
    generatedPattern("checker", IMG_SIZE),
  );
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);

  const kernel = KERNELS[kernelName];
  const output = useMemo(
    () => convolve(input, kernel, { stride: 1, padding: "valid" }),
    [input, kernel],
  );
  const outW = output[0]?.length ?? 0;
  const outH = output.length;
  const total = outW * outH;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= total) {
          setPlaying(false);
          return total;
        }
        return s + 1;
      });
    }, BASE_INTERVAL_MS / speed);
    return () => clearInterval(id);
  }, [playing, total, speed]);

  useEffect(() => {
    setStep(total);
    setPlaying(false);
  }, [imageId, kernelName, total]);

  const isFinished = step >= total;
  const stepClamped = Math.min(Math.max(step, 0), total - 1);
  const activeIdx = hover ? hover.y * outW + hover.x : stepClamped;
  const activeX = activeIdx % outW;
  const activeY = Math.floor(activeIdx / outW);

  const displayed: Matrix = useMemo(() => {
    if (isFinished) return output;
    const limit = Math.min(step, total);
    const m: Matrix = Array.from({ length: outH }, () =>
      new Array(outW).fill(0),
    );
    for (let i = 0; i < limit; i++) {
      const x = i % outW;
      const y = Math.floor(i / outW);
      m[y][x] = output[y][x];
    }
    return m;
  }, [isFinished, output, step, outW, outH, total]);

  const patch: Matrix = useMemo(
    () =>
      Array.from({ length: 3 }, (_, ky) =>
        Array.from(
          { length: 3 },
          (_, kx) => input[activeY + ky]?.[activeX + kx] ?? 0,
        ),
      ),
    [input, activeX, activeY],
  );

  const sum = useMemo(() => {
    let s = 0;
    for (let y = 0; y < 3; y++)
      for (let x = 0; x < 3; x++) s += patch[y][x] * kernel[y][x];
    return s;
  }, [patch, kernel]);

  const showHighlight = !isFinished || hover !== null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase dark:text-zinc-500">
            Input patch
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            The{" "}
            <span className="font-mono text-[0.85em] text-blue-600 dark:text-blue-400">
              3×3
            </span>{" "}
            window of input pixels the kernel currently sits on. As the kernel
            slides, this patch is the slice of the image it looks at to produce
            one output value.
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="mb-2 text-xs tracking-wider text-gray-500 uppercase dark:text-zinc-500">
            Kernel
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            A small grid of weights. Each output value is the sum of the input
            patch multiplied elementwise by the kernel, so the kernel decides
            what pattern the convolution responds to (edges, blur, sharpen).
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
          Kernel:
        </span>
        {Object.keys(KERNELS).map((k) => (
          <button
            key={k}
            onClick={() => setKernelName(k as keyof typeof KERNELS)}
            className={`cursor-pointer rounded-md border px-3 py-1.5 font-mono text-sm transition-colors ${
              kernelName === k
                ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/40"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <StepControls
        currentStep={step}
        maxStep={total}
        isPlaying={playing}
        onSetStep={(s) => {
          setPlaying(false);
          setStep(s);
        }}
        onTogglePlay={() => {
          if (step >= total) setStep(0);
          setPlaying((p) => !p);
        }}
        scrubberClassName="w-[28rem]"
        disablePlay={false}
        rightSlot={
          <div className="flex shrink-0 items-center gap-1.5">
            <label className="text-xs whitespace-nowrap text-gray-400 dark:text-zinc-500">
              Speed
            </label>
            <select
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="rounded border border-gray-300 bg-white px-2 py-1 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            >
              {SPEEDS.map((s) => (
                <option key={s} value={s}>
                  {s}×
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="flex flex-wrap items-start gap-6">
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
            Input{" "}
            <span className="font-mono normal-case">
              {IMG_SIZE}×{IMG_SIZE}
            </span>
          </h3>
          <MatrixCanvas
            matrix={input}
            cellSize={CELL}
            highlight={
              showHighlight ? { x: activeX, y: activeY, w: 3, h: 3 } : null
            }
          />
        </div>
        <div>
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
            Output{" "}
            <span className="font-mono normal-case">
              {outW}×{outH}
            </span>
          </h3>
          <MatrixCanvas
            matrix={displayed}
            cellSize={CELL}
            highlight={
              showHighlight ? { x: activeX, y: activeY, w: 1, h: 1 } : null
            }
            colormap="diverging"
            onCellHover={(x, y) => {
              if (x >= 0 && y >= 0 && x < outW && y < outH) setHover({ x, y });
            }}
            onCellLeave={() => setHover(null)}
          />
          <div className="mt-2">
            <ColorLegend />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
          Position{" "}
          <span className="font-mono text-gray-700 normal-case dark:text-zinc-300">
            ({activeX}, {activeY})
          </span>
        </h3>
        <div className="flex flex-wrap items-start gap-4">
          <div>
            <p className="mb-1 text-[10px] font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
              Input patch
            </p>
            <KernelEditor kernel={patch} onChange={() => {}} editable={false} />
          </div>
          <div className="flex flex-col self-stretch">
            <p className="mb-1 text-[10px]" aria-hidden="true">
              &nbsp;
            </p>
            <div className="flex flex-1 items-center text-2xl text-gray-400 dark:text-zinc-500">
              ×
            </div>
          </div>
          <div>
            <p className="mb-1 text-[10px] font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
              Kernel
            </p>
            <KernelEditor
              kernel={kernel}
              onChange={() => {}}
              editable={false}
            />
          </div>
          <div className="flex flex-col self-stretch">
            <p className="mb-1 text-[10px]" aria-hidden="true">
              &nbsp;
            </p>
            <div className="flex flex-1 items-center text-2xl text-gray-400 dark:text-zinc-500">
              =
            </div>
          </div>
          <div className="flex flex-col self-stretch">
            <p className="mb-1 text-[10px] font-semibold tracking-wide text-gray-400 uppercase dark:text-zinc-500">
              Sum
            </p>
            <div className="my-auto flex h-12 w-16 items-center justify-center rounded border border-gray-300 bg-gray-50 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-800/40">
              {sum.toFixed(2)}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto rounded border border-gray-200 bg-gray-50 p-2 font-mono text-xs text-gray-600 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
          {patch.flatMap((row, y) =>
            row.map((v, x) => {
              const k = kernel[y][x];
              const term = `(${v.toFixed(2)}×${(+k.toFixed(2)).toString()})`;
              const isLast = y === 2 && x === 2;
              return (
                <span
                  key={`${y}-${x}`}
                  className={k === 0 ? "text-gray-400 dark:text-zinc-500" : ""}
                >
                  {term}
                  {!isLast && (
                    <span className="text-gray-400 dark:text-zinc-500">
                      {" "}
                      +{" "}
                    </span>
                  )}
                </span>
              );
            }),
          )}
          <span className="text-gray-400 dark:text-zinc-500"> = </span>
          <span className="font-semibold text-gray-900 dark:text-zinc-100">
            {sum.toFixed(2)}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-zinc-500">
          The output is fully computed by default. Press ▶ to watch it build up,
          scrub the bar to step through manually, or hover any output cell to
          inspect that position.
        </p>
      </div>
    </div>
  );
}
