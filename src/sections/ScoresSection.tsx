import { useState } from "react";
import { Card, Label, Prose, Section, Term } from "../components/Section";
import { AttentionFormula } from "../components/AttentionFormula";
import { SelectButton } from "../components/SelectButton";
import { HEAD_DIM } from "../lib/model";
import { useTransformer } from "../lib/TransformerContext";

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export function ScoresSection() {
  const { result, layer, head, activeQuery, setSelectedQuery, tokens } =
    useTransformer();

  // Key selection is specific to this section. The query is shared so it stays
  // in sync with the attention matrix
  const [keyIdx, setKeyIdx] = useState<number | null>(null);

  const queryIdx = activeQuery;
  const ready = result != null && queryIdx != null && queryIdx < tokens.length;

  const start = head * HEAD_DIM;
  const sliceHead = (m: number[][] | undefined, t: number) =>
    m ? m[t].slice(start, start + HEAD_DIM) : [];

  // Default the key to whatever this query attends to most
  const weights = ready
    ? result!.attentions[layer][head].weights[queryIdx!]
    : [];
  const topKey = ready ? weights.indexOf(Math.max(...weights)) : 0;
  const activeKey = keyIdx !== null && keyIdx < tokens.length ? keyIdx : topKey;

  const qVec = ready ? sliceHead(result!.query[layer], queryIdx!) : [];
  const kVec = ready ? sliceHead(result!.key[layer], activeKey) : [];
  const rawScore = ready ? dot(qVec, kVec) : 0;
  const scaled = rawScore / Math.sqrt(HEAD_DIM);
  const weight = ready ? weights[activeKey] : 0;

  return (
    <Section
      number="03"
      title="Scaled dot-product attention"
      blurb="Score every query against every key with a dot product, scale, softmax into weights, then take a weighted sum of values."
    >
      <Prose>
        <p>
          For a query <Term>q</Term> and key <Term>k</Term>, the raw score is
          their dot product <Term>q·k</Term>, which is large when the two
          vectors point the same way. Stacking all queries against all keys
          gives an <Term>n×n</Term> score matrix. The scores are divided by{" "}
          <Term>{`√${HEAD_DIM}`}</Term> (the scaled part) to stop the dot
          products from growing with dimension, which would make the softmax put
          most of the weight on a single key and ignore the rest.
        </p>
        <p>
          A <Term>softmax</Term> over each row turns scores into a probability
          distribution that is non-negative and sums to one. That row is the
          query's attention over the keys, and it is represented by the gradient
          in the matrix above. Multiplying those weights by the values{" "}
          <Term>V</Term> results in the full attention output.
        </p>
      </Prose>

      <Card>
        <Label>Attention Equation</Label>
        <div className="flex justify-center py-4">
          <AttentionFormula />
        </div>
        <p className="text-xs text-gray-500 dark:text-zinc-500">
          Score every query against every key (<Term>QKᵀ</Term>), divide by{" "}
          <Term>√dₖ</Term>, softmax each row into weights, then take the
          weighted sum of the value vectors.
        </p>
      </Card>

      {ready && (
        <Card>
          <Label>Score 1 query against 1 key</Label>
          <div className="mb-3">
            <p className="mb-1 text-xs text-gray-500 dark:text-zinc-500">
              Query token
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tokens.map((t, i) => (
                <SelectButton
                  key={i}
                  selected={queryIdx === i}
                  onClick={() => setSelectedQuery(i)}
                >
                  {t}
                </SelectButton>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="mb-1 text-xs text-gray-500 dark:text-zinc-500">
              Key token
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tokens.map((t, i) => (
                <SelectButton
                  key={i}
                  selected={activeKey === i}
                  onClick={() => setKeyIdx(i)}
                >
                  {t}
                </SelectButton>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-stretch gap-2 font-mono text-sm">
            <div className="flex flex-col items-center justify-center rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/40">
              <span className="text-xs text-gray-500 dark:text-zinc-500">
                q · k
              </span>
              <span className="text-gray-900 dark:text-zinc-100">
                {rawScore.toFixed(2)}
              </span>
            </div>
            <span className="flex items-center text-gray-400 dark:text-zinc-600">
              ÷ √{HEAD_DIM} =
            </span>
            <div className="flex flex-col items-center justify-center rounded border border-gray-200 bg-gray-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-800/40">
              <span className="text-xs text-gray-500 dark:text-zinc-500">
                scaled
              </span>
              <span className="text-gray-900 dark:text-zinc-100">
                {scaled.toFixed(2)}
              </span>
            </div>
            <span className="flex items-center text-gray-400 dark:text-zinc-600">
              → softmax →
            </span>
            <div className="flex flex-col items-center justify-center rounded border border-blue-300 bg-blue-50 px-3 py-2 dark:border-blue-800 dark:bg-blue-950/40">
              <span className="text-xs text-blue-600 dark:text-blue-400">
                weight
              </span>
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                {(weight * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-zinc-500">
            The weight is <Term>{tokens[keyIdx!]}</Term>'s share of{" "}
            <Term>{tokens[queryIdx!]}</Term>'s attention after softmax over all{" "}
            {tokens.length} keys. A higher scaled score means a larger share of
            attention.
          </p>
        </Card>
      )}

      <Card>
        <Label>"Attention Sinks"</Label>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
          A lot of attention tends to land on the special tokens of{" "}
          <Term>[CLS]</Term> and <Term>[SEP]</Term>. Heads use these as an
          &ldquo;attention sink&rdquo;: a default place to put weight when a
          token has nothing more specific to attend to. Watch how different
          heads specialize when you swap the layers and heads in the above
          playground.
        </p>
      </Card>
    </Section>
  );
}
