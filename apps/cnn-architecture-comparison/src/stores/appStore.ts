import { create } from "zustand";
import type { InferenceResult } from "../utils/inference";

export type ArchStatus = "idle" | "loading" | "ready" | "error";

export interface ArchState {
  status: ArchStatus;
  result?: InferenceResult;
  error?: string;
}

interface AppState {
  imageUrl: string | null;
  imageTensor: Float32Array | null;
  archStates: Record<string, ArchState>;
  selectedArchId: string | null;
  setImage: (url: string, tensor: Float32Array) => void;
  setArchState: (id: string, state: ArchState) => void;
  selectArch: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  imageUrl: null,
  imageTensor: null,
  archStates: {},
  selectedArchId: null,
  setImage: (imageUrl, imageTensor) =>
    set({ imageUrl, imageTensor, archStates: {} }),
  setArchState: (id, state) =>
    set((s) => ({ archStates: { ...s.archStates, [id]: state } })),
  selectArch: (selectedArchId) => set({ selectedArchId }),
}));
