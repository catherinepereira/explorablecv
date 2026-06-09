import { Card, Label, Prose, Section, Term } from "../components/Section";
import { AttentionMatrix } from "../components/AttentionMatrix";
import { AttentionFlow } from "../components/AttentionFlow";
import { SelectButton } from "../components/SelectButton";
import { NUM_HEADS, NUM_LAYERS } from "../lib/model";
import { useTransformer } from "../lib/TransformerContext";

export function AttentionSection() {
  const {
    layer,
    setLayer,
    head,
    setHead,
    setSelectedQuery,
    loadState,
    result,
    tokens,
    activeQuery,
  } = useTransformer();

  const headResult = result?.attentions[layer]?.[head] ?? null;

  return (
    <Section
      id="attention"
      number="04"
      title="Attention"
      blurb="Pick a layer and head and read BERT-tiny's own attention weights for the sentence above. Each query token distributes its attention across the keys."
    >
      <Prose>
        <p>
          The matrix below displays the weights that BERT-tiny computes as it
          runs. The embeddings, the <Term>Q</Term>/<Term>K</Term> projections,
          and the <Term>softmax(QKᵀ/√dₖ)</Term> step all run in the browser as
          you type.
        </p>
      </Prose>

      {loadState === "ready" && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <Label>Layer</Label>
              <p className="mb-3 text-xs leading-relaxed text-gray-500 dark:text-zinc-500">
                A <Term>layer</Term> is one full pass of attention plus two
                residual connections, layer normalization, and a feed-forward
                network. BERT-tiny stacks {`${NUM_LAYERS}`} of them, and each
                one reads the output of the one before it. Earlier layers tend
                to track basic patterns, while later layers capture more
                abstract relationships.
              </p>
              <div className="flex gap-1.5">
                {Array.from({ length: NUM_LAYERS }, (_, l) => (
                  <SelectButton
                    key={l}
                    size="index"
                    selected={layer === l}
                    onClick={() => setLayer(l)}
                  >
                    {l}
                  </SelectButton>
                ))}
              </div>
            </Card>

            <Card>
              <Label>Head</Label>
              <p className="mb-3 text-xs leading-relaxed text-gray-500 dark:text-zinc-500">
                A <Term>head</Term> is one independent attention pattern inside
                a layer. Each head has its own learned <Term>Q</Term>/
                <Term>K</Term>/<Term>V</Term> projections, so it can focus on a
                different kind of relationship between tokens. BERT-tiny runs{" "}
                {`${NUM_HEADS}`} heads per layer in parallel and combines them.
              </p>
              <div className="flex gap-1.5">
                {Array.from({ length: NUM_HEADS }, (_, h) => (
                  <SelectButton
                    key={h}
                    size="index"
                    selected={head === h}
                    onClick={() => setHead(h)}
                  >
                    {h}
                  </SelectButton>
                ))}
              </div>
            </Card>
          </div>

          {tokens.length > 0 && headResult && (
            <Card>
              <Label>
                Attention matrix (layer {layer}, head {head})
              </Label>
              <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                Rows are <Term>query</Term> tokens, columns are <Term>key</Term>{" "}
                tokens. <br />
                The darker the blue, the more the query attends to that key,
                with each row summing to 1. Click a row to display the
                distribution of attention below.
              </p>
              <AttentionMatrix
                tokens={tokens}
                head={headResult}
                selectedQuery={activeQuery}
                onSelectQuery={setSelectedQuery}
              />
            </Card>
          )}

          {tokens.length > 0 && headResult && (
            <Card>
              <Label>
                Attention from a single query (layer {layer}, head {head})
              </Label>
              <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
                Pick a query token and see how it distributes its attention
                across the key tokens.
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {tokens.map((t, i) => (
                  <SelectButton
                    key={i}
                    selected={activeQuery === i}
                    onClick={() =>
                      setSelectedQuery(activeQuery === i ? null : i)
                    }
                  >
                    {t}
                  </SelectButton>
                ))}
              </div>
              {activeQuery !== null ? (
                <AttentionFlow
                  tokens={tokens}
                  weights={headResult.weights[activeQuery]}
                  queryIndex={activeQuery}
                />
              ) : (
                <p className="text-xs text-gray-400 dark:text-zinc-600">
                  Select a query token to see its attention flow across the
                  keys.
                </p>
              )}
            </Card>
          )}
        </>
      )}
    </Section>
  );
}
