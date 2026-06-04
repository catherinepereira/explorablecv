import { useEffect, useRef, useSyncExternalStore } from "react";
import type { Matrix } from "../lib/conv";
import { normalize } from "../lib/conv";

function subscribeToTheme(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function isDarkSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

function useIsDark(): boolean {
  return useSyncExternalStore(subscribeToTheme, isDarkSnapshot, () => false);
}

interface Props {
  matrix: Matrix;
  cellSize?: number;
  highlight?: { x: number; y: number; w: number; h: number } | null;
  onCellHover?: (x: number, y: number) => void;
  onCellLeave?: () => void;
  showGrid?: boolean;
  colormap?: "gray" | "diverging";
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}

// Blue (negative) → white (zero) → red (positive), t in [-1, 1]
function diverging(t: number): [number, number, number] {
  const blue: [number, number, number] = [37, 99, 235]; // tailwind blue-600
  const white: [number, number, number] = [255, 255, 255];
  const red: [number, number, number] = [220, 38, 38]; // tailwind red-600
  if (t >= 0) {
    return [
      lerp(white[0], red[0], t),
      lerp(white[1], red[1], t),
      lerp(white[2], red[2], t),
    ];
  }
  const k = -t;
  return [
    lerp(white[0], blue[0], k),
    lerp(white[1], blue[1], k),
    lerp(white[2], blue[2], k),
  ];
}

export function MatrixCanvas({
  matrix,
  cellSize = 6,
  highlight = null,
  onCellHover,
  onCellLeave,
  showGrid = false,
  colormap = "gray",
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const isDark = useIsDark();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const h = matrix.length;
    const w = matrix[0]?.length ?? 0;
    if (!w || !h) return;
    canvas.width = w * cellSize;
    canvas.height = h * cellSize;
    const ctx = canvas.getContext("2d")!;
    if (colormap === "diverging") {
      let absMax = 0;
      for (const row of matrix)
        for (const v of row) {
          const a = Math.abs(v);
          if (a > absMax) absMax = a;
        }
      const scale = absMax || 1;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const t = Math.max(-1, Math.min(1, matrix[y][x] / scale));
          const [r, g, b] = diverging(t);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    } else {
      const { data } = normalize(matrix);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const c = Math.round(data[y][x] * 255);
          ctx.fillStyle = `rgb(${c},${c},${c})`;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    if (showGrid && cellSize >= 8) {
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      for (let y = 0; y <= h; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellSize);
        ctx.lineTo(w * cellSize, y * cellSize);
        ctx.stroke();
      }
      for (let x = 0; x <= w; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellSize, 0);
        ctx.lineTo(x * cellSize, h * cellSize);
        ctx.stroke();
      }
    }
    if (highlight) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        highlight.x * cellSize,
        highlight.y * cellSize,
        highlight.w * cellSize,
        highlight.h * cellSize,
      );
    }
  }, [matrix, cellSize, highlight, showGrid, colormap, isDark]);

  function handleMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!onCellHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(
      ((e.clientX - rect.left) / rect.width) * (matrix[0]?.length ?? 0),
    );
    const y = Math.floor(
      ((e.clientY - rect.top) / rect.height) * matrix.length,
    );
    onCellHover(x, y);
  }

  return (
    <canvas
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={onCellLeave}
      style={{ imageRendering: "pixelated" }}
      className="rounded border border-gray-300 dark:border-zinc-700"
    />
  );
}
