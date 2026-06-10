import { CIFAR10_INPUT_SIZE, CIFAR10_MEAN, CIFAR10_STD } from "../config";

export async function imageToTensor(file: File): Promise<Float32Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(CIFAR10_INPUT_SIZE, CIFAR10_INPUT_SIZE);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, CIFAR10_INPUT_SIZE, CIFAR10_INPUT_SIZE);
  const { data } = ctx.getImageData(
    0,
    0,
    CIFAR10_INPUT_SIZE,
    CIFAR10_INPUT_SIZE,
  );

  const size = CIFAR10_INPUT_SIZE * CIFAR10_INPUT_SIZE;
  const out = new Float32Array(3 * size);
  for (let i = 0; i < size; i++) {
    const r = data[i * 4] / 255;
    const g = data[i * 4 + 1] / 255;
    const b = data[i * 4 + 2] / 255;
    out[i] = (r - CIFAR10_MEAN[0]) / CIFAR10_STD[0];
    out[size + i] = (g - CIFAR10_MEAN[1]) / CIFAR10_STD[1];
    out[2 * size + i] = (b - CIFAR10_MEAN[2]) / CIFAR10_STD[2];
  }
  return out;
}

export function softmax(logits: Float32Array | number[]): number[] {
  const max = Math.max(...logits);
  const exps = Array.from(logits, (v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function topK(
  probs: number[],
  k: number,
): { idx: number; prob: number }[] {
  return probs
    .map((prob, idx) => ({ idx, prob }))
    .sort((a, b) => b.prob - a.prob)
    .slice(0, k);
}
