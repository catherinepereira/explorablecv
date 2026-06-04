import { useEffect, useRef } from "react";

import { drawHeatmap } from "../utils/colormap";

type Props = {
  imageSrc: string;
  grid?: number[][];
  signed?: boolean;
  alpha?: number;
};

export function HeatmapOverlay({
  imageSrc,
  grid,
  signed,
  alpha = 0.75,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !grid) return;
    drawHeatmap(canvasRef.current, grid, { signed, alpha });
  }, [grid, signed, alpha]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-white dark:bg-zinc-900">
      <img
        src={imageSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      {grid && (
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ filter: "blur(6px)" }}
        />
      )}
    </div>
  );
}
