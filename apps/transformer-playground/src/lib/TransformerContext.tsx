// Shared transformer state for the playground sections. Runs one inference per
// sentence and exposes the result plus the current layer/head/query selection,
// so every section reads the same forward pass and the same sentence instead of
// each running its own

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { computeAttention, loadModel, type AttentionResult } from "./model";

const DEFAULT_TEXT = "Fate rarely calls upon us at a moment of our choosing.";

type LoadState = "loading" | "ready" | "error";

type TransformerState = {
  text: string;
  setText: (t: string) => void;
  layer: number;
  setLayer: (l: number) => void;
  head: number;
  setHead: (h: number) => void;
  selectedQuery: number | null;
  setSelectedQuery: (q: number | null) => void;
  loadState: LoadState;
  result: AttentionResult | null;
  running: boolean;
  // Tokens for the current result, or empty
  tokens: string[];
  // The selected query clamped to the current token count, or null
  activeQuery: number | null;
};

const Ctx = createContext<TransformerState | null>(null);

export function TransformerProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [layer, setLayer] = useState(0);
  const [head, setHead] = useState(0);
  const [selectedQuery, setSelectedQuery] = useState<number | null>(null);

  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [result, setResult] = useState<AttentionResult | null>(null);
  const [running, setRunning] = useState(false);

  // Warm the model once on mount
  useEffect(() => {
    let cancelled = false;
    loadModel()
      .then(() => !cancelled && setLoadState("ready"))
      .catch((e) => {
        console.error(e);
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Recompute whenever the text changes and the model is ready. Debounced so
  // inference doesn't fire on every keystroke
  useEffect(() => {
    if (loadState !== "ready") return;
    const trimmed = text.trim();
    if (!trimmed) {
      setResult(null);
      return;
    }
    let cancelled = false;
    const id = setTimeout(() => {
      setRunning(true);
      computeAttention(trimmed)
        .then((r) => {
          if (cancelled) return;
          setResult(r);
          // Default to the first content token after [CLS] so the panels show
          // something as soon as a sentence is tokenized
          setSelectedQuery(r.tokens.length > 1 ? 1 : null);
        })
        .catch((e) => console.error(e))
        .finally(() => !cancelled && setRunning(false));
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [text, loadState]);

  const tokens = result?.tokens ?? [];
  const activeQuery =
    selectedQuery !== null && selectedQuery < tokens.length
      ? selectedQuery
      : null;

  const value = useMemo(
    () => ({
      text,
      setText,
      layer,
      setLayer,
      head,
      setHead,
      selectedQuery,
      setSelectedQuery,
      loadState,
      result,
      running,
      tokens,
      activeQuery,
    }),
    [
      text,
      layer,
      head,
      selectedQuery,
      loadState,
      result,
      running,
      tokens,
      activeQuery,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTransformer(): TransformerState {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useTransformer must be used within TransformerProvider");
  return ctx;
}
