import { useEffect, useState } from "react";

import {
  loadCams,
  loadClasses,
  loadLime,
  loadModelStats,
  loadRollout,
  loadSamples,
  loadUmap,
} from "../data";
import type { ModelKey } from "../config";
import type {
  CamEntry,
  LimeEntry,
  ModelStat,
  RolloutEntry,
  Sample,
  UmapData,
} from "../types";

type Dataset = {
  classes: string[];
  samples: Sample[];
  modelStats: ModelStat[];
  cams: Record<ModelKey, CamEntry[]>;
  lime: Record<ModelKey, LimeEntry[]>;
  rollout: Partial<Record<ModelKey, RolloutEntry[]>>;
  umap: Record<ModelKey, UmapData>;
};

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: Dataset }
  | { status: "error"; error: string };

export function useDataset() {
  const [state, setState] = useState<LoadState>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    Promise.all([
      loadClasses(),
      loadSamples(),
      loadModelStats(),
      loadCams(),
      loadLime(),
      loadRollout(),
      loadUmap(),
    ])
      .then(([classes, samples, modelStats, cams, lime, rollout, umap]) => {
        if (cancelled) return;
        setState({
          status: "ready",
          data: { classes, samples, modelStats, cams, lime, rollout, umap },
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setState({ status: "error", error: msg });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
