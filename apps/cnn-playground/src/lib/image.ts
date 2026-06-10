import type { Matrix } from "./conv";

// ITU-R BT.601 luma weights for R, G, B
const LUMA_R = 0.299;
const LUMA_G = 0.587;
const LUMA_B = 0.114;

export function imageToGrayscale(img: HTMLImageElement, size: number): Matrix {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;
  const out: Matrix = [];
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const gray =
        LUMA_R * data[i] + LUMA_G * data[i + 1] + LUMA_B * data[i + 2];
      row.push(gray / 255);
    }
    out.push(row);
  }
  return out;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function generatedPattern(
  kind: "checker" | "circle" | "stripes",
  size: number,
): Matrix {
  const out: Matrix = [];
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      let v: number;
      if (kind === "checker") {
        const c = 8;
        v = (Math.floor(x / c) + Math.floor(y / c)) % 2 === 0 ? 1 : 0;
      } else if (kind === "circle") {
        const dx = x - size / 2;
        const dy = y - size / 2;
        const r = Math.sqrt(dx * dx + dy * dy);
        v = r < size / 3 ? 1 : 0;
      } else {
        v = Math.floor(x / 8) % 2 === 0 ? 1 : 0;
      }
      row.push(v);
    }
    out.push(row);
  }
  return out;
}
