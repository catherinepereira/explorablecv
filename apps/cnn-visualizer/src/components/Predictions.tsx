import type { Sample } from "../types";

type Props = {
  sample: Sample;
  classes: string[];
};

export function Predictions({ sample, classes }: Props) {
  const sorted = [...classes].sort((a, b) => sample.probs[b] - sample.probs[a]);

  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-zinc-800">
      <div className="mb-3 text-sm">
        True: <span className="font-mono">{sample.true_class}</span>
        <br />
        Predicted:{" "}
        <span
          className={`font-mono ${sample.correct ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
        >
          {sample.pred_class}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {sorted.map((cls) => {
          const p = sample.probs[cls];
          const isTrue = cls === sample.true_class;
          const isPred = cls === sample.pred_class;
          return (
            <div
              key={cls}
              className="flex items-center gap-2 font-mono text-xs"
            >
              <div className={`w-20 truncate ${isTrue ? "font-semibold" : ""}`}>
                {cls}
              </div>
              <div className="h-3 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-zinc-800">
                <div
                  className={
                    isPred && !sample.correct
                      ? "h-full bg-red-500 dark:bg-red-500"
                      : "h-full bg-gray-800 dark:bg-zinc-300"
                  }
                  style={{ width: `${(p * 100).toFixed(1)}%` }}
                />
              </div>
              <div className="w-10 text-right text-gray-600 dark:text-zinc-400">
                {(p * 100).toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
