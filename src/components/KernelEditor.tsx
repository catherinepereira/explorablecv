import type { Matrix } from "../lib/conv";

interface Props {
  kernel: Matrix;
  onChange: (k: Matrix) => void;
  editable?: boolean;
  highlight?: { x: number; y: number } | null;
}

export function KernelEditor({
  kernel,
  onChange,
  editable = true,
  highlight = null,
}: Props) {
  function setCell(y: number, x: number, value: number) {
    const next = kernel.map((row) => row.slice());
    next[y][x] = value;
    onChange(next);
  }
  return (
    <div
      className="inline-grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${kernel[0].length}, max-content)`,
      }}
    >
      {kernel.map((row, y) =>
        row.map((v, x) => {
          const isHi = highlight && highlight.x === x && highlight.y === y;
          return (
            <input
              key={`${y}-${x}`}
              type="number"
              step="0.1"
              value={Number.isFinite(v) ? +v.toFixed(3) : 0}
              disabled={!editable}
              onChange={(e) => setCell(y, x, parseFloat(e.target.value) || 0)}
              className={`h-12 w-16 [appearance:textfield] rounded border px-1 text-center font-mono text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                isHi
                  ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                  : "border-gray-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
              } ${editable ? "" : "text-gray-600 dark:text-zinc-400"}`}
            />
          );
        }),
      )}
    </div>
  );
}
