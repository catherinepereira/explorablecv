import { MODEL_KEYS, MODEL_LABELS, type ModelKey } from "../config";
import type { ModelStat } from "../types";
import { Section } from "@explorables/ui/Section";

const MODEL_PARAMS: Record<ModelKey, string> = {
  custom_cnn: "4.5M",
  resnet18: "11.2M",
  vit_s: "22.0M",
};

type Props = { stats: ModelStat[] };

export function StatsBar({ stats }: Props) {
  const byModel = new Map(stats.map((s) => [s.model, s]));
  return (
    <Section
      number="01"
      title="Models"
      blurb="Three ImageNette classifiers of increasing capacity. Validation accuracy and parameter count set the context for the interpretability methods below."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {MODEL_KEYS.map((m) => {
          const s = byModel.get(m);
          const acc = s?.val_accuracy ?? s?.best_val_acc;
          return (
            <div
              key={m}
              className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/40"
            >
              <div className="font-mono text-xs tracking-wider text-gray-500 uppercase dark:text-zinc-500">
                {MODEL_LABELS[m]}
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-gray-500 dark:text-zinc-500">
                    accuracy
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-zinc-100">
                    {acc != null ? `${(acc * 100).toFixed(1)}%` : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-zinc-500">
                    params
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-zinc-100">
                    {MODEL_PARAMS[m]}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
