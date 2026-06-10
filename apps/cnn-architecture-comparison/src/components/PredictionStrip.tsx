import { ARCHITECTURES } from "../architectures/data";
import { CIFAR10_LABELS } from "../config";
import { useAppStore } from "../stores/appStore";
import { softmax, topK } from "../utils/preprocess";

export function PredictionStrip() {
  const archStates = useAppStore((s) => s.archStates);
  const select = useAppStore((s) => s.selectArch);
  const selectedId = useAppStore((s) => s.selectedArchId);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {ARCHITECTURES.map((a) => {
        const state = archStates[a.id];
        const active = selectedId === a.id;
        return (
          <button
            key={a.id}
            onClick={() => select(active ? null : a.id)}
            className={`cursor-pointer rounded-lg border p-3 text-left transition-colors ${
              active
                ? "border-blue-600 bg-gray-50/40 dark:border-blue-400 dark:bg-zinc-800/40"
                : "border-gray-200 bg-gray-50/40 hover:border-blue-600 dark:border-zinc-800 dark:bg-zinc-800/40 dark:hover:border-blue-400"
            }`}
          >
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-medium">{a.name}</span>
              <span className="text-xs text-gray-500 dark:text-zinc-500">
                {a.year}
              </span>
            </div>
            {!state || state.status === "loading" ? (
              <div className="text-xs text-gray-500 dark:text-zinc-500">
                Running…
              </div>
            ) : state.status === "error" ? (
              <div className="text-xs text-red-600 dark:text-red-400">
                {state.error ?? "error"}
              </div>
            ) : state.result ? (
              <Top3 logits={state.result.logits} />
            ) : (
              <div className="text-xs text-gray-500 dark:text-zinc-500">
                No result
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Top3({ logits }: { logits: Float32Array }) {
  const top = topK(softmax(logits), 3);
  return (
    <div className="flex flex-col gap-1">
      {top.map((t, i) => (
        <div key={t.idx} className="flex items-center gap-2">
          <span
            className={`text-xs ${i === 0 ? "font-medium text-blue-500 dark:text-blue-300" : "text-gray-600 dark:text-zinc-400"}`}
          >
            {CIFAR10_LABELS[t.idx]}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-800">
            <div
              className={
                i === 0
                  ? "h-full bg-blue-600 dark:bg-blue-500"
                  : "h-full bg-gray-400 dark:bg-zinc-500"
              }
              style={{ width: `${t.prob * 100}%` }}
            />
          </div>
          <span className="w-9 text-right text-xs text-gray-500 dark:text-zinc-500">
            {(t.prob * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  );
}
