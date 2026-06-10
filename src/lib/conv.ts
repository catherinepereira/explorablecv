export type Matrix = number[][];

export interface ConvOptions {
  stride: number;
  padding: "valid" | "same";
}

export const KERNELS: Record<string, Matrix> = {
  identity: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  edge: [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ],
  "sobel-x": [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
  ],
  "sobel-y": [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
  ],
  sharpen: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
  blur: [
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
    [1 / 9, 1 / 9, 1 / 9],
  ],
  emboss: [
    [-2, -1, 0],
    [-1, 1, 1],
    [0, 1, 2],
  ],
};

export function padInput(input: Matrix, pad: number): Matrix {
  if (pad <= 0) return input;
  const h = input.length;
  const w = input[0].length;
  const out: Matrix = [];
  for (let y = 0; y < h + 2 * pad; y++) {
    const row: number[] = [];
    for (let x = 0; x < w + 2 * pad; x++) {
      const sy = y - pad;
      const sx = x - pad;
      if (sy < 0 || sx < 0 || sy >= h || sx >= w) row.push(0);
      else row.push(input[sy][sx]);
    }
    out.push(row);
  }
  return out;
}

export function convolve(
  input: Matrix,
  kernel: Matrix,
  opts: ConvOptions,
): Matrix {
  const kh = kernel.length;
  const kw = kernel[0].length;
  const pad = opts.padding === "same" ? Math.floor(kh / 2) : 0;
  const padded = padInput(input, pad);
  const ph = padded.length;
  const pw = padded[0].length;
  const outH = Math.floor((ph - kh) / opts.stride) + 1;
  const outW = Math.floor((pw - kw) / opts.stride) + 1;
  const out: Matrix = [];
  for (let oy = 0; oy < outH; oy++) {
    const row: number[] = [];
    for (let ox = 0; ox < outW; ox++) {
      let sum = 0;
      for (let ky = 0; ky < kh; ky++) {
        for (let kx = 0; kx < kw; kx++) {
          sum +=
            padded[oy * opts.stride + ky][ox * opts.stride + kx] *
            kernel[ky][kx];
        }
      }
      row.push(sum);
    }
    out.push(row);
  }
  return out;
}

export function relu(m: Matrix): Matrix {
  return m.map((row) => row.map((v) => (v > 0 ? v : 0)));
}

export function maxPool2(m: Matrix): Matrix {
  const h = Math.floor(m.length / 2);
  const w = Math.floor(m[0].length / 2);
  const out: Matrix = [];
  for (let y = 0; y < h; y++) {
    const row: number[] = [];
    for (let x = 0; x < w; x++) {
      const a = m[y * 2][x * 2];
      const b = m[y * 2][x * 2 + 1];
      const c = m[y * 2 + 1][x * 2];
      const d = m[y * 2 + 1][x * 2 + 1];
      row.push(Math.max(a, b, c, d));
    }
    out.push(row);
  }
  return out;
}

export function normalize(m: Matrix): {
  data: Matrix;
  min: number;
  max: number;
} {
  let min = Infinity;
  let max = -Infinity;
  for (const row of m)
    for (const v of row) {
      if (v < min) min = v;
      if (v > max) max = v;
    }
  const range = max - min || 1;
  const data = m.map((row) => row.map((v) => (v - min) / range));
  return { data, min, max };
}
