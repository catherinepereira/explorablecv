export function renderFeatureMap(
  canvas: HTMLCanvasElement,
  data: Float32Array,
  shape: readonly number[],
  channel: number,
): void {
  const [, , h, w] = shape;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const offset = channel * h * w;
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < h * w; i++) {
    const v = data[offset + i];
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  for (let i = 0; i < h * w; i++) {
    const v = (data[offset + i] - min) / range;
    const c = Math.round(v * 255);
    img.data[i * 4] = c;
    img.data[i * 4 + 1] = c;
    img.data[i * 4 + 2] = c;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}
