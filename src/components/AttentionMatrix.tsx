// Renders one head's attention weights as a matrix. Rows are query tokens,
// columns are key tokens. Cell (q, k) is how much query q attends to key k.
// Intensity is a blue overlay on a gray track

import { useState } from "react";
import type { HeadResult } from "../lib/model";

type Props = {
  tokens: string[];
  head: HeadResult;
  title?: string;
  // The locked query row (from a click), or null for none
  selectedQuery: number | null;
  onSelectQuery: (q: number | null) => void;
};

export function AttentionMatrix({
  tokens,
  head,
  title,
  selectedQuery,
  onSelectQuery,
}: Props) {
  const n = tokens.length;
  // Hover previews a row without disturbing the locked selection. Falling back
  // to selectedQuery on mouse-leave keeps a clicked row highlighted
  const [hovered, setHovered] = useState<number | null>(null);
  const focused = hovered ?? selectedQuery;

  return (
    <div className="overflow-x-auto">
      {title && (
        <div className="mb-2 font-mono text-xs text-gray-500 dark:text-zinc-500">
          {title}
        </div>
      )}
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-20" />
            {tokens.map((t, k) => (
              <th
                key={k}
                className="px-1 align-bottom font-mono text-[10px] font-normal text-gray-500 dark:text-zinc-400"
              >
                <span className="inline-block whitespace-nowrap">{t}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((qTok, q) => {
            const active = focused === null || focused === q;
            return (
              <tr
                key={q}
                onMouseEnter={() => setHovered(q)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectQuery(selectedQuery === q ? null : q)}
                className="cursor-pointer"
              >
                <th
                  className={`pr-2 text-right font-mono text-[11px] font-normal whitespace-nowrap ${
                    focused === q
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-zinc-400"
                  }`}
                >
                  {qTok}
                </th>
                {Array.from({ length: n }, (_, k) => {
                  const w = head.weights[q][k];
                  return (
                    <td
                      key={k}
                      title={`${qTok} → ${tokens[k]}: ${(w * 100).toFixed(1)}%`}
                      className={`relative h-7 w-7 rounded-sm bg-gray-100 transition-opacity dark:bg-zinc-800 ${
                        active ? "" : "opacity-25"
                      }`}
                    >
                      <span
                        className="absolute inset-0 rounded-sm bg-blue-500 dark:bg-blue-400"
                        style={{ opacity: w }}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
