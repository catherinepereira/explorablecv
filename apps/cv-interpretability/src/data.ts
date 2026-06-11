import type { ModelKey } from "./config";
import type {
  CamEntry,
  LimeEntry,
  ModelStat,
  RolloutEntry,
  Sample,
  UmapData,
} from "./types";

const DATA_BASE = `${import.meta.env.BASE_URL}data/`;

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

export const loadClasses = () => fetchJson<string[]>(`${DATA_BASE}classes.json`);
export const loadSamples = () => fetchJson<Sample[]>(`${DATA_BASE}samples.json`);
export const loadModelStats = () =>
  fetchJson<ModelStat[]>(`${DATA_BASE}models.json`);
export const loadCams = () =>
  fetchJson<Record<ModelKey, CamEntry[]>>(`${DATA_BASE}cams.json`);
export const loadLime = () =>
  fetchJson<Record<ModelKey, LimeEntry[]>>(`${DATA_BASE}lime.json`);
export const loadRollout = () =>
  fetchJsonOptional<Partial<Record<ModelKey, RolloutEntry[]>>>(
    `${DATA_BASE}rollout.json`,
    {},
  );
export const loadUmap = () =>
  fetchJson<Record<ModelKey, UmapData>>(`${DATA_BASE}umap.json`);
