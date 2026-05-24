import { MODEL_KEYS, MODEL_LABELS, type ModelKey } from "../config";
import type { ModelStat } from "../types";

const MODEL_PARAMS: Record<ModelKey, string> = {
  custom_cnn: "4.5M",
  resnet18: "11.2M",
  vit_s: "22.0M",
};

type Props = { stats: ModelStat[] };

export function StatsBar({ stats }: Props) {
  const byModel = new Map(stats.map((s) => [s.model, s]));
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {MODEL_KEYS.map((m) => {
        const s = byModel.get(m);
        const acc = s?.val_accuracy ?? s?.best_val_acc;
        return (
          <div
            key={m}
            className="bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-md px-4 py-3"
          >
            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-mono">
              {MODEL_LABELS[m]}
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-gray-500 dark:text-zinc-500">accuracy</div>
                <div className="text-lg text-gray-900 dark:text-zinc-100 font-medium">
                  {acc != null ? `${(acc * 100).toFixed(1)}%` : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-zinc-500">params</div>
                <div className="text-lg text-gray-900 dark:text-zinc-100 font-medium">
                  {MODEL_PARAMS[m]}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
