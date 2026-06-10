import { useState } from "react";
import { Card, Label, Prose, Section, Term } from "@explorables/ui/Section";
import { AttentionMatrix } from "../components/AttentionMatrix";
import { AttentionFlow } from "../components/AttentionFlow";
import { SelectButton } from "../components/SelectButton";
import { useTransformer } from "../lib/TransformerContext";
import type { HeadResult } from "../lib/model";

// Zero the upper triangle (a query can only attend to itself and earlier keys)
// and re-normalize each row, turning the encoder's bidirectional weights into a
// decoder's causal ones
function applyCausalMask(head: HeadResult): HeadResult {
  const weights = head.weights.map((row, q) => {
    const masked = row.map((w, k) => (k <= q ? w : 0));
    const sum = masked.reduce((a, b) => a + b, 0) || 1;
    return masked.map((w) => w / sum);
  });
  return { weights };
}

export function DecoderSection() {
  const { result, layer, head, tokens, activeQuery, setSelectedQuery } =
    useTransformer();
  const [causal, setCausal] = useState(false);

  const headResult = result?.attentions[layer]?.[head] ?? null;
  const shown = headResult && causal ? applyCausalMask(headResult) : headResult;

  return (
    <Section
      number="08"
      title="Encoder to decoder"
      blurb="An encoder like BERT reads an entire sentence at once to understand it. A decoder like GPT reads left to right and predicts the next word, generating text one token at a time. Both are built from the same transformer blocks."
    >
      <Prose>
        <p>
          A generative model like GPT is built from the same blocks you just
          watched run, except it uses a <Term>decoder</Term>-only architecture
          instead of an encoder. Two changes turn this encoder into a decoder.
        </p>
        <p>
          First, <Term>causal masking</Term>. BERT lets every token attend to
          every other token, which is why it can fill a blank using words on
          both sides. A decoder zeroes out the upper triangle of the attention
          matrix so each token can only attend to itself and the tokens before
          it. That way the model doesn't see the future tokens it is trying to
          predict.
        </p>
        <p>
          Second,{" "}
          <a
            href="https://mbrenndoerfer.com/writing/autoregressive-generation-gpt-text-generation"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Term>autoregressive generation</Term>
          </a>
          . Instead of scoring one masked slot, a decoder reads the logits at
          the last position, picks a next token, appends it to the sequence, and
          runs the loop again. Repeating that loop is how a few transformer
          blocks can generate a sequence of new tokens.
        </p>
      </Prose>

      {shown && tokens.length > 0 && (
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Label>Try the causal mask</Label>
            <div className="flex gap-1.5">
              <SelectButton selected={!causal} onClick={() => setCausal(false)}>
                Bidirectional
              </SelectButton>
              <SelectButton selected={causal} onClick={() => setCausal(true)}>
                Causal
              </SelectButton>
            </div>
          </div>
          <p className="mb-3 text-sm leading-relaxed text-gray-700 dark:text-zinc-300">
            This is the same attention matrix from earlier (layer {layer}, head{" "}
            {head}
            ). Switch to <strong>Causal</strong> to zero the upper triangle and
            re-normalize each row, exactly what a decoder does so a token never
            attends to words that come after it.
          </p>
          <AttentionMatrix
            tokens={tokens}
            head={shown}
            selectedQuery={activeQuery}
            onSelectQuery={setSelectedQuery}
          />
          {activeQuery !== null && (
            <div className="mt-4">
              <AttentionFlow
                tokens={tokens}
                weights={shown.weights[activeQuery]}
                queryIndex={activeQuery}
              />
            </div>
          )}
        </Card>
      )}
    </Section>
  );
}
