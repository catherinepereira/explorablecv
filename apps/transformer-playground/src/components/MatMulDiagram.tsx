// Schematic of one projection: a [1 x inDim] token vector times a learned
// [inDim x outDim] weight matrix gives a [1 x outDim] output. The input and
// weight blocks are drawn as labeled shapes (the weights themselves aren't
// shown). The output block renders the values passed in as a heatstrip

import { valueColor } from "./valueColor";

type Props = {
  inDim: number;
  outDim: number;
  inLabel: string;
  weightLabel: string;
  outLabel: string;
  // The output vector (length outDim) to render as a heatstrip
  output: number[];
  // Shared scale across sibling diagrams so their colors are comparable
  maxAbs: number;
};

function Block({
  label,
  shape,
  className,
}: {
  label: string;
  shape: string;
  className: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex items-center justify-center rounded border px-3 py-2 font-mono text-xs ${className}`}
      >
        {label}
      </div>
      <span className="font-mono text-[10px] text-gray-400 dark:text-zinc-600">
        {shape}
      </span>
    </div>
  );
}

export function MatMulDiagram({
  inDim,
  outDim,
  inLabel,
  weightLabel,
  outLabel,
  output,
  maxAbs,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Block
        label={inLabel}
        shape={`1 × ${inDim}`}
        className="border-gray-300 bg-gray-50 text-gray-700 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300"
      />
      <span className="font-mono text-sm text-gray-400 dark:text-zinc-600">
        ×
      </span>
      <Block
        label={weightLabel}
        shape={`${inDim} × ${outDim}`}
        className="border-gray-300 bg-gray-50 text-gray-700 dark:border-zinc-700 dark:bg-zinc-800/40 dark:text-zinc-300"
      />
      <span className="font-mono text-sm text-gray-400 dark:text-zinc-600">
        =
      </span>
      <div className="flex flex-col items-center gap-1">
        <div className="flex flex-col gap-1 rounded border border-blue-300 bg-blue-50 p-1.5 dark:border-blue-800 dark:bg-blue-950/40">
          <span className="text-center font-mono text-xs text-blue-700 dark:text-blue-300">
            {outLabel}
          </span>
          <div className="flex flex-wrap gap-[2px]">
            {output.map((v, i) => (
              <span
                key={i}
                title={`${v.toFixed(3)}`}
                className="h-2 w-2 rounded-[1px] bg-gray-100 dark:bg-zinc-800"
                style={{ backgroundColor: valueColor(v, maxAbs) }}
              />
            ))}
          </div>
        </div>
        <span className="font-mono text-[10px] text-gray-400 dark:text-zinc-600">
          1 × {outDim}
        </span>
      </div>
    </div>
  );
}
