import { Card, Label, Prose, Section, Term } from "../components/Section";
import { SelectButton } from "../components/SelectButton";
import { ColorScale } from "../components/ColorScale";
import { valueColor } from "../components/valueColor";
import { FFN_SIZE, HIDDEN_SIZE } from "../lib/model";
import { useTransformer } from "../lib/TransformerContext";

export function FeedForwardSection() {
  const { result, layer, activeQuery, setSelectedQuery, tokens } =
    useTransformer();

  const token = activeQuery;
  const ffn = result?.ffn[layer] ?? null;
  const ready = ffn != null && token != null && token < tokens.length;

  const acts = ready ? ffn![token!] : [];
  const maxAbs = ready ? Math.max(...acts.map((a) => Math.abs(a)), 1e-6) : 1;
  // GELU lets a small negative tail through
  const activeCount = ready ? acts.filter((a) => a > 0.01).length : 0;

  return (
    <Section
      id="feedforward"
      number="06"
      title="Feed-forward block"
      blurb="After attention mixes tokens together, a per-token MLP expands each vector to a wider space, applies a nonlinearity, and projects back. This is where most of the model's parameters live."
    >
      <Prose>
        <p>
          Attention is the only step where tokens exchange information. After
          this step, every token is processed on its own by a{" "}
          <Term>feed-forward network</Term>: which is a linear layer that
          expands the {`${HIDDEN_SIZE}`}-dim vector to {`${FFN_SIZE}`}{" "}
          dimensions, a{" "}
          <a
            href="https://arxiv.org/abs/1606.08415"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            GELU
          </a>{" "}
          nonlinearity that shrinks part of it, and a second linear layer that
          projects the feature space back down to {`${HIDDEN_SIZE}`}. The
          widening gives the model room to recombine features before the next
          layer.
        </p>
      </Prose>

      {!ready && (
        <Card>
          <p className="text-sm text-gray-500 dark:text-zinc-500">
            Type a sentence in the tokenize section above to see a token's
            feed-forward activation.
          </p>
        </Card>
      )}

      {ready && (
        <Card>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <Label>Token</Label>
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
          <Label>
            Feed-forward activation for &ldquo;{tokens[token!]}&rdquo; (layer{" "}
            {layer})
          </Label>
          <p className="mb-3 text-xs text-gray-500 dark:text-zinc-500">
            {activeCount} of {FFN_SIZE} units active (&gt; 0.01) after GELU.
          </p>
          <div className="flex flex-wrap gap-[2px]">
            {acts.map((a, i) => (
              <span
                key={i}
                title={`unit ${i}: ${a.toFixed(3)}`}
                className="h-2 w-2 rounded-[1px] bg-gray-100 dark:bg-zinc-800"
                style={{ backgroundColor: valueColor(a, maxAbs) }}
              />
            ))}
          </div>
        </Card>
      )}
    </Section>
  );
}
