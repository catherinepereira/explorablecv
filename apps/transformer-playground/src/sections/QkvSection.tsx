import { Card, Label, Prose, Section, Term } from "../components/Section";
import { SelectButton } from "../components/SelectButton";
import { MatMulDiagram } from "../components/MatMulDiagram";
import { ColorScale } from "../components/ColorScale";
import { HEAD_DIM, HIDDEN_SIZE } from "../lib/model";
import { useTransformer } from "../lib/TransformerContext";

export function QkvSection() {
  const { result, layer, head, activeQuery, setSelectedQuery, tokens } =
    useTransformer();

  const token = activeQuery;
  const ready = result != null && token != null && token < tokens.length;

  // Each projection sliced to this head's dimension range
  const start = head * HEAD_DIM;
  const sliceHead = (m: number[][] | undefined) =>
    ready && m ? m[token!].slice(start, start + HEAD_DIM) : [];
  const q = sliceHead(result?.query[layer]);
  const k = sliceHead(result?.key[layer]);
  const v = sliceHead(result?.value[layer]);

  // One scale across q/k/v so the three heatstrips are directly comparable
  const maxAbs = Math.max(...[...q, ...k, ...v].map((x) => Math.abs(x)), 1e-6);

  return (
    <Section
      number="02"
      title="Query, Key, Value (QKV)"
      blurb="Each token's embedding is projected into three roles: a query, a key, and a value."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <Label>Query: "What am I looking for?"</Label>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            What this token is searching for. It gets compared against every
            key.
          </p>
        </Card>
        <Card>
          <Label>Key: "What do I have?"</Label>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            What this token advertises. A query that matches a key well produces
            a high score.
          </p>
        </Card>
        <Card>
          <Label>Value: "What do I retrieve?"</Label>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            The content mixed into the output, weighted by attention. The
            attention matrices come from <Term>Q</Term> and <Term>K</Term>. The
            value aggregation section sums the <Term>V</Term> vectors using
            those weights.
          </p>
        </Card>
      </div>

      <Prose>
        <p>
          Self-attention lets every token look at every other token and decide
          how much to pull from each. To do that, each embedding <Term>x</Term>{" "}
          is multiplied by three matrices to produce a <Term>query</Term>{" "}
          <Term>q = x·Wq</Term>, a <Term>key</Term> <Term>k = x·Wk</Term>, and a{" "}
          <Term>value</Term> <Term>v = x·Wv</Term>.
        </p>
        <p>
          In BERT-tiny, each {`${HIDDEN_SIZE}`}-dim embedding is projected down
          to a {`${HEAD_DIM}`}-dim head space (one head spans half the model's{" "}
          {`${HIDDEN_SIZE}`} dimensions across its two heads). The diagram below
          shows that multiplication for one token, with the <Term>q</Term>,{" "}
          <Term>k</Term>, and <Term>v</Term> that BERT-tiny computes for it.
        </p>
      </Prose>

      {!ready && (
        <Card>
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            Type a sentence in the tokenize section above to project its tokens.
          </p>
        </Card>
      )}

      {ready && (
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <Label>Token to project</Label>
            <ColorScale />
          </div>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {tokens.map((t, i) => (
              <SelectButton
                key={i}
                selected={token === i}
                onClick={() => setSelectedQuery(i)}
              >
                {t}
              </SelectButton>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <Label>Query: x · Wq</Label>
              <MatMulDiagram
                inDim={HIDDEN_SIZE}
                outDim={HEAD_DIM}
                inLabel="x"
                weightLabel="Wq"
                outLabel="q"
                output={q}
                maxAbs={maxAbs}
              />
            </div>
            <div>
              <Label>Key: x · Wk</Label>
              <MatMulDiagram
                inDim={HIDDEN_SIZE}
                outDim={HEAD_DIM}
                inLabel="x"
                weightLabel="Wk"
                outLabel="k"
                output={k}
                maxAbs={maxAbs}
              />
            </div>
            <div>
              <Label>Value: x · Wv</Label>
              <MatMulDiagram
                inDim={HIDDEN_SIZE}
                outDim={HEAD_DIM}
                inLabel="x"
                weightLabel="Wv"
                outLabel="v"
                output={v}
                maxAbs={maxAbs}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 dark:text-zinc-500">
            Same <Term>x</Term> in, three different learned matrices, three
            different vectors out. Click a token to see the vector and hover a
            cell in the vector to see the value.
          </p>
        </Card>
      )}
    </Section>
  );
}
