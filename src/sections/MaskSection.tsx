import { useEffect, useMemo, useState } from "react";
import { Card, Label, Prose, Section, Term } from "../components/Section";
import { SelectButton } from "../components/SelectButton";
import { MASK_TOKEN, predictMasks, type MaskPrediction } from "../lib/model";
import { useTransformer } from "../lib/TransformerContext";

// Wait for typing to settle before running the masked forward pass
const PREDICT_DEBOUNCE_MS = 250;

// Split into words while keeping each word's trailing punctuation attached, so
// rebuilding the sentence keeps the original spacing and commas
function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

// The alphabetic core of a word, ignoring surrounding punctuation
function core(word: string): string {
  return word.replace(/[^A-Za-z]/g, "");
}

// Pick a content word to blank out: the longest alphabetic word, biased toward
// later positions on ties. Skips short stopword-ish tokens. Returns the word
// index, or -1 if there's nothing maskable
function pickWord(words: string[]): number {
  let best = -1;
  let bestLen = 0;
  words.forEach((w, i) => {
    const len = core(w).length;
    if (len >= 3 && len >= bestLen) {
      bestLen = len;
      best = i;
    }
  });
  return best;
}

// Replace one word with [MASK], preserving its trailing punctuation
function maskAt(words: string[], idx: number): string {
  return words
    .map((w, i) => {
      if (i !== idx) return w;
      const trailing = w.match(/[^A-Za-z]+$/)?.[0] ?? "";
      return MASK_TOKEN + trailing;
    })
    .join(" ");
}

// Rebuild the sentence with `fill` in the masked slot, keeping that word's
// trailing punctuation
function fillAt(words: string[], idx: number, fill: string): string {
  return words
    .map((w, i) => {
      if (i !== idx) return w;
      const trailing = w.match(/[^A-Za-z]+$/)?.[0] ?? "";
      return fill + trailing;
    })
    .join(" ");
}

export function MaskSection() {
  const { text } = useTransformer();
  const words = useMemo(() => splitWords(text), [text]);

  // Which word to blank out. null follows the heuristic, clamp if the sentence
  // shrank under the current pick
  const [picked, setPicked] = useState<number | null>(null);
  const suggested = useMemo(() => pickWord(words), [words]);
  const maskIdx = picked !== null && picked < words.length ? picked : suggested;

  const masked = maskIdx >= 0 ? maskAt(words, maskIdx) : "";

  const [preds, setPreds] = useState<MaskPrediction[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!masked.includes(MASK_TOKEN)) {
      setPreds([]);
      return;
    }
    let cancelled = false;
    const id = setTimeout(() => {
      setRunning(true);
      predictMasks(masked)
        .then((p) => !cancelled && setPreds(p))
        .catch((e) => console.error(e))
        .finally(() => !cancelled && setRunning(false));
    }, PREDICT_DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [masked]);

  const actual = maskIdx >= 0 ? core(words[maskIdx]) : "";

  // Sentence preview: the hovered candidate fills the blank, or the top guess
  // when nothing is hovered
  const [hovered, setHovered] = useState<string | null>(null);
  const topGuess = preds[0]?.candidates[0]?.token ?? null;
  const fillWord = hovered ?? topGuess;
  const filled =
    maskIdx >= 0 && fillWord ? fillAt(words, maskIdx, fillWord) : "";

  return (
    <Section
      number="07"
      title="Masked predictions"
      blurb="BERT was pretrained to predict masked words. Hide a word from your sentence and the forward pass will rank what should fill the gap."
    >
      <Prose>
        <p>
          The earlier sections traced one attention head. The full network does
          this across both heads and both layers, then projects the final
          vectors to a <Term>logit</Term>, which is a raw score for every word
          in BERT's 30,522-token vocabulary at each position. A softmax over
          those logits turns them into the probabilities below.
        </p>
        <p>
          Pick a word to hide and the model will predict what belongs in the
          blank.
        </p>
      </Prose>

      {words.length === 0 && (
        <Card>
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            Type a sentence in the tokenize section above to try this.
          </p>
        </Card>
      )}

      {words.length > 0 && (
        <Card>
          <Label>Word to hide</Label>
          <div className="flex flex-wrap gap-1.5">
            {words.map((w, i) => {
              const isMaskable = core(w).length > 0;
              return (
                <SelectButton
                  key={i}
                  selected={i === maskIdx}
                  disabled={!isMaskable}
                  onClick={() => setPicked(i)}
                >
                  {w}
                </SelectButton>
              );
            })}
          </div>
          {maskIdx >= 0 && (
            <p className="mt-3 font-mono text-sm text-gray-700 dark:text-zinc-300">
              {masked}
            </p>
          )}
        </Card>
      )}

      {preds.map((pred, mi) => {
        const top = pred.candidates[0]?.prob ?? 1;
        return (
          <Card key={mi}>
            <Label>Predictions for the blank</Label>
            <div className="flex flex-col gap-1.5">
              {pred.candidates.map((c, i) => {
                const isActual =
                  actual && c.token.toLowerCase() === actual.toLowerCase();
                return (
                  <div
                    key={i}
                    onMouseEnter={() => setHovered(c.token)}
                    onMouseLeave={() => setHovered(null)}
                    className="flex cursor-default items-center gap-2 rounded px-1 hover:bg-gray-50 dark:hover:bg-zinc-800/40"
                  >
                    <span
                      className={`w-24 shrink-0 truncate text-right font-mono text-sm ${
                        isActual
                          ? "font-semibold text-blue-700 dark:text-blue-300"
                          : "text-gray-700 dark:text-zinc-300"
                      }`}
                    >
                      {c.token}
                      {isActual ? " ✓" : ""}
                    </span>
                    <div className="h-4 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded bg-blue-500 dark:bg-blue-400"
                        style={{ width: `${(c.prob / top) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 shrink-0 text-right font-mono text-xs text-gray-500 dark:text-zinc-500">
                      {(c.prob * 100).toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}

      {filled && fillWord && (
        <Card>
          <Label>Filled sentence</Label>
          <p className="font-mono text-sm text-gray-700 dark:text-zinc-300">
            {words.map((w, i) => {
              if (i !== maskIdx) return <span key={i}>{w} </span>;
              const trailing = w.match(/[^A-Za-z]+$/)?.[0] ?? "";
              return (
                <span key={i}>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {fillWord}
                  </span>
                  {trailing}{" "}
                </span>
              );
            })}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-zinc-600">
            {hovered
              ? "Hovering a prediction."
              : "Showing the top guess. Hover a prediction to try it."}
          </p>
        </Card>
      )}

      {maskIdx >= 0 && preds.length === 0 && (
        <Card>
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            {running ? "Running…" : "No predictions yet."}
          </p>
        </Card>
      )}
    </Section>
  );
}
