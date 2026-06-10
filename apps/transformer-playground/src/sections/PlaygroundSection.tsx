import { Card, Label, Prose, Section, Term } from "@explorables/ui/Section";
import {
  HEAD_DIM,
  HIDDEN_SIZE,
  MAX_TOKENS,
  NUM_HEADS,
  NUM_LAYERS,
} from "../lib/model";
import { useTransformer } from "../lib/TransformerContext";

export function PlaygroundSection() {
  const { text, setText, loadState, running, tokens } = useTransformer();

  return (
    <Section
      number="01"
      title="Tokenize"
      blurb="Type a sentence and watch BERT split it into WordPiece tokens."
    >
      <Prose>
        <p>
          A transformer doesn't see raw text, it sees a sequence of tokens, each
          mapped to a learned embedding vector. This site runs{" "}
          <Term>BERT-tiny</Term>, a pretrained model with {`${NUM_LAYERS}`}{" "}
          layers, {`${NUM_HEADS}`} heads, and {`${HIDDEN_SIZE}`}-dimensional
          embeddings.{" "}
          <a
            href="https://arxiv.org/abs/1609.08144"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            WordPiece
          </a>{" "}
          splits rare words into subword pieces (marked <Term>##</Term>) and
          wraps the sentence in the special tokens <Term>[CLS]</Term> and{" "}
          <Term>[SEP]</Term>.
        </p>
        <p>
          New to tokenization? Play with{" "}
          <a
            href="https://tiktokenizer.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            Tiktokenizer
          </a>{" "}
          to see how different models chop up the same text, or step through the{" "}
          <a
            href="https://bpe-playground.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            BPE Playground
          </a>{" "}
          to watch a vocabulary get built from scratch.
        </p>
      </Prose>

      {loadState === "loading" && (
        <Card>
          <p className="text-sm text-gray-600 dark:text-zinc-400">
            Loading BERT-tiny (~17 MB, cached after first load)…
          </p>
        </Card>
      )}
      {loadState === "error" && (
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400">
            Could not load the model. Check that <Term>/models/bert-tiny/</Term>{" "}
            is served and reload.
          </p>
        </Card>
      )}

      {loadState === "ready" && (
        <Card>
          <Label>Input sentence</Label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a short sentence…"
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-600 dark:focus:border-blue-400"
          />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tokens.map((t, i) => (
              <span
                key={i}
                className="rounded border border-blue-200 bg-blue-50 px-2 py-1 font-mono text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
              >
                {t}
              </span>
            ))}
            {tokens.length === 0 && (
              <span className="text-xs text-gray-400 dark:text-zinc-600">
                {running ? "Running…" : "No tokens yet."}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-zinc-500">
            {tokens.length} token{tokens.length === 1 ? "" : "s"} (incl.{" "}
            <Term>[CLS]</Term>/<Term>[SEP]</Term>). Embedding dim{" "}
            {`${HIDDEN_SIZE}`}, head dim {`${HEAD_DIM}`}.
            {tokens.length >= MAX_TOKENS && (
              <>
                {" "}
                Capped at {`${MAX_TOKENS}`} tokens so the panels stay legible.
              </>
            )}
          </p>
        </Card>
      )}
    </Section>
  );
}
