function viridis(t: number): [number, number, number] {
  const stops: [number, [number, number, number]][] = [
    [0.0, [68, 1, 84]],
    [0.25, [59, 82, 139]],
    [0.5, [33, 145, 140]],
    [0.75, [94, 201, 98]],
    [1.0, [253, 231, 37]],
  ];
  const x = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i];
    const [b, cb] = stops[i + 1];
    if (x >= a && x <= b) {
      const f = (x - a) / (b - a);
      return [
        Math.round(ca[0] + f * (cb[0] - ca[0])),
        Math.round(ca[1] + f * (cb[1] - ca[1])),
        Math.round(ca[2] + f * (cb[2] - ca[2])),
      ];
    }
  }
  return stops[stops.length - 1][1];
}

export function drawHeatmap(
  canvas: HTMLCanvasElement,
  grid: number[][],
  opts: { signed?: boolean; alpha?: number } = {},
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const h = grid.length;
  const w = h === 0 ? 0 : grid[0].length;
  if (h === 0 || w === 0) return;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const raw = grid[y][x] / 255;
      const t = opts.signed ? Math.abs(raw * 2 - 1) : raw;
      const [r, g, b] = viridis(t);
      const idx = (y * w + x) * 4;
      img.data[idx] = r;
      img.data[idx + 1] = g;
      img.data[idx + 2] = b;
      img.data[idx + 3] = Math.round((opts.alpha ?? 1) * 255 * Math.sqrt(t));
    }
  }
  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(img, 0, 0);
}
