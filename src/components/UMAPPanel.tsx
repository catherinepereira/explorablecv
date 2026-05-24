import { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";

import { MODEL_KEYS, MODEL_LABELS, type ModelKey } from "../config";
import type { UmapData } from "../types";

const PALETTE_LIGHT = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#ca8a04",
  "#0891b2",
  "#9333ea",
  "#db2777",
  "#0284c7",
  "#a16207",
  "#15803d",
];

const PALETTE_DARK = [
  "#60a5fa",
  "#f87171",
  "#4ade80",
  "#facc15",
  "#22d3ee",
  "#c084fc",
  "#f472b6",
  "#38bdf8",
  "#fbbf24",
  "#86efac",
];

function buildColorMap(classes: string[], dark: boolean) {
  const palette = dark ? PALETTE_DARK : PALETTE_LIGHT;
  const out: Record<string, string> = {};
  for (let i = 0; i < classes.length; i++) {
    out[classes[i]] = palette[i % palette.length];
  }
  return out;
}

function useIsDark() {
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document === "undefined"
      ? false
      : document.documentElement.classList.contains("dark"),
  );
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains("dark"));
    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

function PlotPanel({
  data,
  colorMap,
  isDark,
}: {
  data: UmapData;
  colorMap: Record<string, string>;
  isDark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const byClass = new Map<string, { x: number[]; y: number[]; text: string[] }>();
    for (const p of data.points) {
      const entry = byClass.get(p.label) ?? { x: [], y: [], text: [] };
      entry.x.push(p.x);
      entry.y.push(p.y);
      entry.text.push(p.thumb);
      byClass.set(p.label, entry);
    }
    const traces: Plotly.Data[] = Array.from(byClass.entries()).map(
      ([label, pts]) => ({
        type: "scattergl",
        mode: "markers",
        name: label,
        x: pts.x,
        y: pts.y,
        text: pts.text,
        hovertemplate: "%{text}<extra>" + label + "</extra>",
        marker: { size: 4, color: colorMap[label] ?? (isDark ? "#a1a1aa" : "#52525b") },
      }),
    );

    Plotly.newPlot(
      ref.current,
      traces,
      {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: isDark ? "rgba(24,24,27,0.4)" : "#ffffff",
        margin: { t: 8, l: 8, r: 8, b: 8 },
        showlegend: false,
        xaxis: { visible: false },
        yaxis: { visible: false },
        font: {
          color: isDark ? "#a1a1aa" : "#525252",
          family: "Geist, system-ui, sans-serif",
        },
      },
      { displayModeBar: false, responsive: true },
    );

    return () => {
      if (ref.current) Plotly.purge(ref.current);
    };
  }, [data, colorMap, isDark]);

  return <div ref={ref} className="w-full aspect-square" />;
}

type Props = {
  classes: string[];
  umap: Record<ModelKey, UmapData>;
};

export function UMAPPanel({ classes, umap }: Props) {
  const isDark = useIsDark();
  const colorMap = buildColorMap(classes, isDark);

  return (
    <div className="bg-gray-50 dark:bg-zinc-800/40 border border-gray-200 dark:border-zinc-800 rounded-md p-4">
      <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
        <h2 className="text-sm font-medium text-gray-900 dark:text-zinc-100">
          Penultimate-layer UMAP
        </h2>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
          {classes.map((label) => (
            <span
              key={label}
              className="flex items-center gap-1 text-gray-500 dark:text-zinc-500"
            >
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: colorMap[label] }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODEL_KEYS.map((m) =>
          umap[m] ? (
            <div key={m}>
              <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-zinc-500 font-mono mb-2">
                {MODEL_LABELS[m]}
              </div>
              <PlotPanel data={umap[m]} colorMap={colorMap} isDark={isDark} />
            </div>
          ) : null,
        )}
      </div>
      <p className="mt-4 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
        Each point is one validation image. The 2D position comes from running
        UMAP on the model's penultimate-layer features (the vector right before
        the classifier head). Images the model considers similar land near each
        other, so tight class-colored clusters mean the model has learned a
        feature space that separates the classes well; overlapping or smeared
        clusters mean it's still confusing them. Compare across models: the
        custom CNN's clusters bleed together, ResNet-18 separates most classes,
        and ViT-S produces the tightest clumps. UMAP is non-linear, so distances
        inside a cluster aren't meaningful; only the overall topology is.
      </p>
    </div>
  );
}
