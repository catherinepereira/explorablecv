import type { Method, ModelKey } from "./config";

export type Sample = {
  id: string;
  file: string;
  class: string;
};

export type ModelStat = {
  model: ModelKey;
  best_val_acc?: number;
  val_accuracy?: number;
  training_examples?: number;
};

export type CamEntry = {
  id: string;
  model: ModelKey;
  true_class: string;
  pred_class: string;
  confidence: number;
  probs: number[];
  maps: Partial<Record<Exclude<Method, "lime" | "rollout">, number[][]>>;
};

export type LimeEntry = {
  id: string;
  model: ModelKey;
  pred_class: string;
  heatmap: number[][];
};

export type RolloutEntry = {
  id: string;
  model: ModelKey;
  true_class: string;
  pred_class: string;
  rollout: number[][];
};

export type UmapPoint = {
  x: number;
  y: number;
  label: string;
  thumb: string;
};

export type UmapData = {
  model: ModelKey;
  points: UmapPoint[];
};
