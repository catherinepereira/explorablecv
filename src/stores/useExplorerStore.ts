import { create } from "zustand";

import type { Method } from "../config";

type State = {
  selectedId: string | null;
  method: Method;
  setSelectedId: (id: string | null) => void;
  setMethod: (m: Method) => void;
};

export const useExplorerStore = create<State>((set) => ({
  selectedId: null,
  method: "gradcam",
  setSelectedId: (id) => set({ selectedId: id }),
  setMethod: (m) => set({ method: m }),
}));
