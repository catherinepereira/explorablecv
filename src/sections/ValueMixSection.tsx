import { Card, Label, Prose, Section, Term } from "../components/Section";
import { SelectButton } from "../components/SelectButton";
import { HEAD_DIM } from "../lib/model";
import { useTransformer } from "../lib/TransformerContext";

// L2 norm of a vector, used as a one-number stand-in for a value vector's
// magnitude so the table stays readable instead of showing 64 raw dims
function norm(v: number[]): number {
  let s = 0;
  for (const x of v) s += x * x;
  return Math.sqrt(s);
}

export function ValueMixSection() {
  const { result, layer, head, activeQuery, setSelectedQuery, tokens } =
    useTransformer();

  // Query is shared across sections, so picking here also moves the attention
  // matrix and the other panels
  const query = activeQuery;

  const headResult = result?.attentions[layer]?.[head] ?? null;
  const layerValues = result?.value[layer] ?? null;

  const ready =
    headResult != null &&
    layerValues != null &&
    query != null &&
    query < tokens.length;

  // Each token's value vector sliced to this head's dimension range, computed
  // once so the context sum and the table don't re-slice per cell
  const start = head * HEAD_DIM;
  const headValues: number[][] = ready
    ? layerValues!.map((v) => v.slice(start, start + HEAD_DIM))
    : [];

  // weights for the selected query, and the resulting context vector
  const weights = ready ? headResult!.weights[query!] : [];
  const context = ready
    ? Array.from({ length: HEAD_DIM }, (_, d) =>
        weights.reduce((acc, w, k) => acc + w * headValues[k][d], 0),
      )
    : [];
  const maxNorm = ready
    ? Math.max(...headValues.map((hv) => norm(hv)), 1e-6)
    : 1;

  return (
    <Section
      id="valuemix"
      number="05"
      title="Aggregate values"
      blurb="Attention weights decide how much, the value vectors decide what. Their weighted sum is the context vector that leaves the attention block."
    >
      <Prose>
        <p>
          The matrix shows only the weights. Each token also carries a{" "}
          <Term>value</Term> vector <Term>v = x·Wv</Term>, and the output for a
          query is the attention-weighted sum of those values:{" "}
          <Term>Σₖ softmax(q·k) · vₖ</Term>. A key the query barely attends to
          contributes almost nothing. A key it attends to strongly will dominate
          the summation.
        </p>
        <p>
          Pick the query token below to aggregate the values for it, at the
          current layer and head from the attention section. Each value vector
          is {`${HEAD_DIM}`}-dimensional, so it is summarized by its magnitude.
          The context row is the weighted sum that BERT-tiny computes for this
          query.
        </p>
      </Prose>

      {tokens.length === 0 && (
        <Card>
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            Type a sentence in the tokenize section above to aggregate its
            values.
          </p>
        </Card>
      )}

      {ready && (
        <Card>
          <Label>Query token</Label>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {tokens.map((t, i) => (
              <SelectButton
                key={i}
                selected={query === i}
                onClick={() => setSelectedQuery(i)}
              >
                {t}
              </SelectButton>
            ))}
          </div>

          <Label>
            Value aggregation for &ldquo;{tokens[query!]}&rdquo; (layer {layer},
            head {head})
          </Label>
          <div className="flex flex-col gap-1.5">
            {tokens.map((t, k) => {
              const w = weights[k];
              const n = norm(headValues[k]);
              return (
                <div key={k} className="flex items-center gap-2 text-xs">
                  <span className="w-24 shrink-0 truncate text-right font-mono text-gray-700 dark:text-zinc-300">
                    {t}
                  </span>
                  <span className="w-12 shrink-0 text-right font-mono text-gray-500 dark:text-zinc-500">
                    {(w * 100).toFixed(0)}%
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded bg-gray-100 dark:bg-zinc-800">
                    {/* value magnitude (gray), with the weighted share in blue */}
                    <div
                      className="h-full rounded bg-gray-300 dark:bg-zinc-600"
                      style={{ width: `${(n / maxNorm) * 100}%` }}
                    >
                      <div
                        className="h-full rounded bg-blue-500 dark:bg-blue-400"
                        style={{ width: `${w * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-3 text-xs dark:border-zinc-800">
            <span className="w-24 shrink-0 text-right font-mono font-medium text-blue-700 dark:text-blue-300">
              context
            </span>
            <span className="w-12 shrink-0" />
            <span className="flex-1 font-mono text-gray-500 dark:text-zinc-500">
              ‖output‖ = {norm(context).toFixed(2)} (the {HEAD_DIM}-dim vector
              passed to the next step)
            </span>
          </div>
        </Card>
      )}
    </Section>
  );
}
