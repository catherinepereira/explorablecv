import * as ort from "onnxruntime-web";
import { CIFAR10_INPUT_SIZE, CIFAR10_NUM_CLASSES } from "../config";

ort.env.wasm.numThreads = 1;
ort.env.wasm.proxy = false;

const sessions = new Map<string, Promise<ort.InferenceSession>>();
let runQueue: Promise<unknown> = Promise.resolve();

export function loadModel(url: string): Promise<ort.InferenceSession> {
  const cached = sessions.get(url);
  if (cached) return cached;
  const promise = ort.InferenceSession.create(url, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  });
  sessions.set(url, promise);
  return promise;
}

export interface InferenceResult {
  logits: Float32Array;
  featureMaps: Record<string, Float32Array>;
  featureShapes: Record<string, readonly number[]>;
}

export function runInference(
  modelUrl: string,
  input: Float32Array,
): Promise<InferenceResult> {
  const next = runQueue
    .catch(() => undefined)
    .then(() => runOnce(modelUrl, input));
  runQueue = next;
  return next;
}

async function runOnce(
  modelUrl: string,
  input: Float32Array,
): Promise<InferenceResult> {
  const session = await loadModel(modelUrl);
  const tensor = new ort.Tensor("float32", input, [
    1,
    3,
    CIFAR10_INPUT_SIZE,
    CIFAR10_INPUT_SIZE,
  ]);
  const inputName = session.inputNames[0];
  const output = await session.run({ [inputName]: tensor });

  const featureMaps: Record<string, Float32Array> = {};
  const featureShapes: Record<string, readonly number[]> = {};
  let logits: Float32Array | null = null;

  for (const name of session.outputNames) {
    const t = output[name];
    const data = t.data as Float32Array;
    if (
      name === "logits" ||
      (t.dims.length === 2 && t.dims[1] === CIFAR10_NUM_CLASSES)
    ) {
      logits = data;
    } else {
      featureMaps[name] = data;
      featureShapes[name] = t.dims;
    }
  }

  if (!logits) {
    throw new Error(`No logits output found for ${modelUrl}`);
  }

  return { logits, featureMaps, featureShapes };
}
