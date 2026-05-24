import type { ModelKey } from "./config";
import type {
  CamEntry,
  LimeEntry,
  ModelStat,
  RolloutEntry,
  Sample,
  UmapData,
} from "./types";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`failed to load ${path}: ${res.status}`);
  return (await res.json()) as T;
}

async function fetchJsonOptional<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(path);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const loadClasses = () => fetchJson<string[]>("/data/classes.json");
export const loadSamples = () => fetchJson<Sample[]>("/data/samples.json");
export const loadModelStats = () => fetchJson<ModelStat[]>("/data/models.json");
export const loadCams = () =>
  fetchJson<Record<ModelKey, CamEntry[]>>("/data/cams.json");
export const loadLime = () =>
  fetchJson<Record<ModelKey, LimeEntry[]>>("/data/lime.json");
export const loadRollout = () =>
  fetchJsonOptional<Partial<Record<ModelKey, RolloutEntry[]>>>(
    "/data/rollout.json",
    {},
  );
export const loadUmap = () =>
  fetchJson<Record<ModelKey, UmapData>>("/data/umap.json");
