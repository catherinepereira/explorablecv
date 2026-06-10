import { ARCHITECTURES } from "../architectures/data";
import { useAppStore } from "../stores/appStore";

export function Timeline() {
  const selectedId = useAppStore((s) => s.selectedArchId);
  const select = useAppStore((s) => s.selectArch);

  return (
    <div className="py-6">
      <div className="relative">
        {/* Connecting line, sitting on the horizontal center of the dots
            (dots are w-4 h-4 = 16px, so center is at top-2 from the row's top). */}
        <div className="absolute top-2 right-2 left-2 h-px bg-gray-200 dark:bg-zinc-800" />
        <div className="relative flex items-start justify-between">
          {ARCHITECTURES.map((a) => {
            const active = selectedId === a.id;
            return (
              <button
                key={a.id}
                onClick={() => select(active ? null : a.id)}
                className="group flex cursor-pointer flex-col items-center gap-2"
              >
                <div
                  className={`h-4 w-4 rounded-full border-2 transition-colors ${
                    active
                      ? "border-blue-600 bg-blue-600 dark:border-blue-400 dark:bg-blue-500"
                      : "border-gray-300 bg-white group-hover:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:group-hover:border-blue-400"
                  }`}
                />
                <div className="text-center">
                  <div
                    className={`text-sm font-medium ${
                      active
                        ? "text-blue-600 dark:text-blue-300"
                        : "text-gray-900 dark:text-zinc-100"
                    }`}
                  >
                    {a.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-zinc-500">
                    {a.year}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
