// Runs a pretrained BERT-tiny in the browser and reads its internals.
//
// BERT-tiny (prajjwal1/bert-tiny) is a 2-layer, 2-head, 128-dim model. The ONNX
// export in transformer-playground-model taps several tensors the default
// export drops, so the graph exposes, per forward pass:
//   logits               [batch, seq, vocab]        masked-LM scores
//   attentions.{i}        [batch, heads, seq, seq]   attention weights
//   value.{i}             [batch, seq, hidden]       value vectors (V)
//   ffn_intermediate.{i}  [batch, seq, intermediate] feed-forward expansion
// Attention rows are already softmax-normalized.
//
// The tokenizer comes from transformers.js (WordPiece, including the
// [CLS]/[SEP] specials). Inference runs through onnxruntime-web directly so the
// outputs are readable by name

import {
  AutoTokenizer,
  env,
  type PreTrainedTokenizer,
} from "@huggingface/transformers";
import * as ort from "onnxruntime-web";

const MODEL_ID = "bert-tiny";
export const NUM_LAYERS = 2;
export const NUM_HEADS = 2;
export const HIDDEN_SIZE = 128;
export const HEAD_DIM = HIDDEN_SIZE / NUM_HEADS; // 64
export const FFN_SIZE = 512;
// Cap the sequence length so the matrices and per-token panels stay legible.
// Counts [CLS] and [SEP], so up to 18 content tokens
export const MAX_TOKENS = 20;

// Serve the model from /public/models and never hit the network
env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = "/models/";

const MODEL_ONNX_URL = `/models/${MODEL_ID}/onnx/model.onnx`;

type Mat = number[][];

export type HeadResult = {
  // Attention weights weights[q][k], each query row sums to 1
  weights: Mat;
};

export type AttentionResult = {
  // One entry per token, in model order (includes [CLS] first and [SEP] last)
  tokens: string[];
  // attentions[layer][head].weights[q][k]
  attentions: HeadResult[][];
  // query/key/value[layer][token] are the full [HIDDEN_SIZE] projections. Head
  // h reads dims [h*HEAD_DIM, (h+1)*HEAD_DIM)
  query: Mat[];
  key: Mat[];
  value: Mat[];
  // ffn[layer][token] is the [FFN_SIZE] feed-forward intermediate (post-GELU)
  ffn: Mat[];
};

export const MASK_TOKEN = "[MASK]";
const VOCAB_SIZE = 30522;

export type MaskPrediction = {
  // Index of the [MASK] token in the sequence (identifies which blank)
  position: number;
  // Top candidate fills, highest probability first
  candidates: { token: string; prob: number }[];
};

let tokenizerPromise: Promise<PreTrainedTokenizer> | null = null;
let sessionPromise: Promise<ort.InferenceSession> | null = null;

function getTokenizer(): Promise<PreTrainedTokenizer> {
  if (!tokenizerPromise) {
    tokenizerPromise = AutoTokenizer.from_pretrained(MODEL_ID);
  }
  return tokenizerPromise;
}

function getSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = ort.InferenceSession.create(MODEL_ONNX_URL, {
      executionProviders: ["wasm"],
    });
  }
  return sessionPromise;
}

// Warm both the tokenizer and the ONNX session. Lets the UI show one loading
// state up front instead of stalling on the first sentence
export async function loadModel(): Promise<void> {
  await Promise.all([getTokenizer(), getSession()]);
}

function toBigInt64(arr: number[] | BigInt64Array): BigInt64Array {
  if (arr instanceof BigInt64Array) return arr;
  return BigInt64Array.from(arr.map((v) => BigInt(v)));
}

// Truncate parallel id/token arrays to MAX_TOKENS while keeping the trailing
// special token (BERT expects [CLS] ... [SEP]). No-op when already short
function capTokens(
  ids: number[],
  tokens: string[],
): { ids: number[]; tokens: string[] } {
  if (ids.length <= MAX_TOKENS) return { ids, tokens };
  const last = ids.length - 1; // [SEP]
  return {
    ids: [...ids.slice(0, MAX_TOKENS - 1), ids[last]],
    tokens: [...tokens.slice(0, MAX_TOKENS - 1), tokens[last]],
  };
}

// Reshape a flat [heads*seq*seq] attention tensor for one layer into
// per-head [seq][seq] matrices
function reshapeLayer(data: Float32Array, seq: number): HeadResult[] {
  const heads: HeadResult[] = [];
  for (let h = 0; h < NUM_HEADS; h++) {
    const weights: Mat = [];
    for (let q = 0; q < seq; q++) {
      const row: number[] = new Array(seq);
      const base = h * seq * seq + q * seq;
      for (let k = 0; k < seq; k++) row[k] = data[base + k];
      weights.push(row);
    }
    heads.push({ weights });
  }
  return heads;
}

export async function computeAttention(text: string): Promise<AttentionResult> {
  const tokenizer = await getTokenizer();
  const session = await getSession();

  const enc = tokenizer(text, { add_special_tokens: true });
  // enc.input_ids is a Tensor. Pull the flat id list
  const rawIds: number[] = Array.from(
    enc.input_ids.data as BigInt64Array,
    (v) => Number(v),
  );
  // tokenize() returns the WordPiece strings for the same pipeline, including
  // the [CLS]/[SEP] specials, so they line up with the ids one-for-one
  const rawTokens = tokenizer.tokenize(text, { add_special_tokens: true });
  const { ids, tokens } = capTokens(rawIds, rawTokens);
  const seq = ids.length;

  // Capped sequence is contiguous and unpadded, so the mask is all ones
  const mask: number[] = new Array(seq).fill(1);
  const typeIds = new Array(seq).fill(0);

  const dims = [1, seq];
  const feeds: Record<string, ort.Tensor> = {
    input_ids: new ort.Tensor("int64", toBigInt64(ids), dims),
    attention_mask: new ort.Tensor("int64", toBigInt64(mask), dims),
    token_type_ids: new ort.Tensor("int64", toBigInt64(typeIds), dims),
  };

  const out = await session.run(feeds);

  const attentions: HeadResult[][] = [];
  const query: Mat[] = [];
  const key: Mat[] = [];
  const value: Mat[] = [];
  const ffn: Mat[] = [];
  for (let layer = 0; layer < NUM_LAYERS; layer++) {
    const tensor = out[`attentions.${layer}`];
    attentions.push(reshapeLayer(tensor.data as Float32Array, seq));
    query.push(
      reshapeSeq(out[`query.${layer}`].data as Float32Array, seq, HIDDEN_SIZE),
    );
    key.push(
      reshapeSeq(out[`key.${layer}`].data as Float32Array, seq, HIDDEN_SIZE),
    );
    value.push(
      reshapeSeq(out[`value.${layer}`].data as Float32Array, seq, HIDDEN_SIZE),
    );
    ffn.push(
      reshapeSeq(
        out[`ffn_intermediate.${layer}`].data as Float32Array,
        seq,
        FFN_SIZE,
      ),
    );
  }

  return { tokens, attentions, query, key, value, ffn };
}

// Reshape a flat [seq*dim] tensor into [seq][dim] rows
function reshapeSeq(data: Float32Array, seq: number, dim: number): Mat {
  const rows: Mat = [];
  for (let i = 0; i < seq; i++) {
    rows.push(Array.from(data.subarray(i * dim, (i + 1) * dim)));
  }
  return rows;
}

// Softmax + top-k over one [vocab] logits row. Returns the indices and their
// probabilities, highest first
function topK(
  logits: Float32Array,
  offset: number,
  vocab: number,
  k: number,
): { id: number; prob: number }[] {
  let max = -Infinity;
  for (let v = 0; v < vocab; v++) {
    const x = logits[offset + v];
    if (x > max) max = x;
  }
  let sum = 0;
  const exps = new Float32Array(vocab);
  for (let v = 0; v < vocab; v++) {
    const e = Math.exp(logits[offset + v] - max);
    exps[v] = e;
    sum += e;
  }
  // Partial selection: scan once, keep the k best
  const best: { id: number; prob: number }[] = [];
  for (let v = 0; v < vocab; v++) {
    const prob = exps[v] / sum;
    if (best.length < k) {
      best.push({ id: v, prob });
      best.sort((a, b) => a.prob - b.prob);
    } else if (prob > best[0].prob) {
      best[0] = { id: v, prob };
      best.sort((a, b) => a.prob - b.prob);
    }
  }
  return best.reverse();
}

// Fill every [MASK] in the text with the model's top candidate tokens. Returns
// one entry per mask, empty if the text has none
export async function predictMasks(
  text: string,
  k = 5,
): Promise<MaskPrediction[]> {
  const tokenizer = await getTokenizer();
  const session = await getSession();

  const enc = tokenizer(text, { add_special_tokens: true });
  const rawIds: number[] = Array.from(
    enc.input_ids.data as BigInt64Array,
    (v) => Number(v),
  );
  const rawTokens = tokenizer.tokenize(text, { add_special_tokens: true });
  const { ids, tokens } = capTokens(rawIds, rawTokens);
  const seq = ids.length;

  const maskPositions = tokens
    .map((t, i) => (t === MASK_TOKEN ? i : -1))
    .filter((i) => i >= 0);
  if (maskPositions.length === 0) return [];

  const mask: number[] = new Array(seq).fill(1);
  const dims = [1, seq];
  const feeds: Record<string, ort.Tensor> = {
    input_ids: new ort.Tensor("int64", toBigInt64(ids), dims),
    attention_mask: new ort.Tensor("int64", toBigInt64(mask), dims),
    token_type_ids: new ort.Tensor(
      "int64",
      toBigInt64(new Array(seq).fill(0)),
      dims,
    ),
  };

  const out = await session.run(feeds);
  const logits = out["logits"].data as Float32Array; // [seq, vocab] flattened

  return maskPositions.map((position) => {
    const row = topK(logits, position * VOCAB_SIZE, VOCAB_SIZE, k);
    const candidates = row.map(({ id, prob }) => ({
      token: tokenizer.decode([id]).trim(),
      prob,
    }));
    return { position, candidates };
  });
}
