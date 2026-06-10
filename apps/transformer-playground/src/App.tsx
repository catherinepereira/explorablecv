import { References } from "@explorables/ui/References";
import { SeriesNav } from "@explorables/ui/SeriesNav";
import { SiteHeader } from "@explorables/ui/SiteHeader";
import { TransformerProvider } from "./lib/TransformerContext";
import { AttentionSection } from "./sections/AttentionSection";
import { DecoderSection } from "./sections/DecoderSection";
import { FeedForwardSection } from "./sections/FeedForwardSection";
import { MaskSection } from "./sections/MaskSection";
import { PlaygroundSection } from "./sections/PlaygroundSection";
import { QkvSection } from "./sections/QkvSection";
import { ScoresSection } from "./sections/ScoresSection";
import { ValueMixSection } from "./sections/ValueMixSection";

export function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <SiteHeader
          title="🤖 Transformer Playground"
          repo="transformer-playground"
          modelRepo="transformer-playground-model"
        >
          An interactive walkthrough of transformer architecture! <br /> Type a
          sentence to watch{" "}
          <a
            href="https://huggingface.co/prajjwal1/bert-tiny"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            BERT-tiny
          </a>{" "}
          run in your browser: tokens,{" "}
          <code>
            <a
              href="https://en.wikipedia.org/wiki/Softmax_function"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              softmax
            </a>
            {`(QKᵀ/√dₖ)`}
          </code>{" "}
          <a
            href="https://arxiv.org/abs/1706.03762"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            attention
          </a>
          , value aggregation, feed-forward block, and a prediction for a masked
          word.
        </SiteHeader>

        <SeriesNav currentSlug="transformer-playground" />

        <main className="mt-12 flex flex-col gap-12">
          <TransformerProvider>
            <PlaygroundSection />
            <QkvSection />
            <ScoresSection />
            <AttentionSection />
            <ValueMixSection />
            <FeedForwardSection />
            <MaskSection />
            <DecoderSection />
          </TransformerProvider>
          <References
            items={[
              {
                authors: "Vaswani, A., Shazeer, N., Parmar, N., et al.",
                year: 2017,
                title: "Attention Is All You Need",
                href: "https://arxiv.org/abs/1706.03762",
              },
              {
                authors: "Turc, I., Chang, M.-W., Lee, K., & Toutanova, K.",
                year: 2019,
                title:
                  "Well-Read Students Learn Better: On the Importance of Pre-training Compact Models (BERT-tiny)",
                href: "https://arxiv.org/abs/1908.08962",
              },
              {
                authors: "Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K.",
                year: 2019,
                title:
                  "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
                href: "https://arxiv.org/abs/1810.04805",
              },
              {
                authors: "Wu, Y., Schuster, M., Chen, Z., et al.",
                year: 2016,
                title:
                  "Google's Neural Machine Translation System: Bridging the Gap between Human and Machine Translation (WordPiece)",
                href: "https://arxiv.org/abs/1609.08144",
              },
              {
                authors: "Xiao, G., Tian, Y., Chen, B., et al.",
                year: 2023,
                title:
                  "Efficient Streaming Language Models with Attention Sinks",
                href: "https://arxiv.org/abs/2309.17453",
              },
              {
                authors: "Alammar, J.",
                year: 2018,
                title: "The Illustrated Transformer",
                href: "https://jalammar.github.io/illustrated-transformer/",
              },
              {
                authors: "Karpathy, A.",
                year: 2023,
                title: "Let's build GPT: from scratch, in code, spelled out",
                href: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
              },
              {
                authors: "LearnCodeCamp",
                year: 2023,
                title: "Q, K, V Vectors in the Attention Mechanism",
                href: "https://learncodecamp.net/q-k-v-vectors-in-the-attention-mechanism/",
              },
            ]}
          />
        </main>
      </div>
    </div>
  );
}
