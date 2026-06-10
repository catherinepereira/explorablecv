import { useEffect } from "react";

import { InterpretabilityTabs } from "./components/InterpretabilityTabs";
import { References } from "@explorables/ui/References";
import { SiteHeader } from "@explorables/ui/SiteHeader";
import { SeriesNav } from "@explorables/ui/SeriesNav";
import { StatsBar } from "./components/StatsBar";
import { UMAPPanel } from "./components/UMAPPanel";
import { useDataset } from "./hooks/useDataset";
import { useExplorerStore } from "./stores/useExplorerStore";

function Loading({ message }: { message: string }) {
  return (
    <div className="py-12 text-center text-sm text-gray-500 dark:text-zinc-500">
      {message}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
      <div className="mb-1 font-medium">Could not load data</div>
      <div>{message}</div>
      <div className="mt-2 text-xs text-red-600/70 dark:text-red-400/70">
        Make sure the bundle script from the training repo has run and the JSON
        files exist under <code>public/data/</code>.
      </div>
    </div>
  );
}

function App() {
  const state = useDataset();
  const setSelectedId = useExplorerStore((s) => s.setSelectedId);
  const selectedId = useExplorerStore((s) => s.selectedId);

  useEffect(() => {
    if (state.status === "ready" && !selectedId && state.data.samples[0]) {
      setSelectedId(state.data.samples[0].id);
    }
  }, [state, selectedId, setSelectedId]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <SiteHeader
          title="🔬 CV Interpretability Explorer"
          repo="cv-interpretability"
          modelRepo="cv-interpretability-model"
        >
          Compare three{" "}
          <a
            href="https://github.com/fastai/imagenette"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 underline dark:text-zinc-400"
          >
            ImageNette
          </a>{" "}
          classifiers (Custom CNN, ResNet-18, ViT-S) through five
          interpretability methods (Grad-CAM, Score-CAM, Saliency Maps, LIME,
          and Attention Rollout) and their penultimate-layer UMAP projections.
        </SiteHeader>

        <SeriesNav currentSlug="cv-interpretability" />

        {state.status === "loading" && <Loading message="Loading dataset..." />}
        {state.status === "error" && <ErrorState message={state.error} />}
        {state.status === "ready" && (
          <main className="mt-12 flex flex-col gap-12">
            <StatsBar stats={state.data.modelStats} />
            <InterpretabilityTabs
              classes={state.data.classes}
              samples={state.data.samples}
              cams={state.data.cams}
              lime={state.data.lime}
              rollout={state.data.rollout}
            />
            <UMAPPanel classes={state.data.classes} umap={state.data.umap} />
            <References
              items={[
                {
                  authors: "LeCun, Y., Bottou, L., Bengio, Y., & Haffner, P.",
                  year: 1998,
                  title:
                    "Gradient-Based Learning Applied to Document Recognition",
                  href: "http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf",
                },
                {
                  authors: "He, K., Zhang, X., Ren, S., & Sun, J.",
                  year: 2015,
                  title: "Deep Residual Learning for Image Recognition",
                  href: "https://arxiv.org/abs/1512.03385",
                },
                {
                  authors: "Dosovitskiy, A., et al.",
                  year: 2021,
                  title:
                    "An Image Is Worth 16x16 Words: Transformers for Image Recognition at Scale",
                  href: "https://arxiv.org/abs/2010.11929",
                },
                {
                  authors: "Simonyan, K., Vedaldi, A., & Zisserman, A.",
                  year: 2014,
                  title:
                    "Deep Inside Convolutional Networks: Visualising Image Classification Models and Saliency Maps",
                  href: "https://arxiv.org/abs/1312.6034",
                },
                {
                  authors: "Ribeiro, M. T., Singh, S., & Guestrin, C.",
                  year: 2016,
                  title:
                    "“Why Should I Trust You?”: Explaining the Predictions of Any Classifier",
                  href: "https://arxiv.org/abs/1602.04938",
                },
                {
                  authors: "Selvaraju, R. R., et al.",
                  year: 2017,
                  title:
                    "Grad-CAM: Visual Explanations from Deep Networks via Gradient-Based Localization",
                  href: "https://arxiv.org/abs/1610.02391",
                },
                {
                  authors: "Wang, H., et al.",
                  year: 2020,
                  title:
                    "Score-CAM: Score-Weighted Visual Explanations for Convolutional Neural Networks",
                  href: "https://arxiv.org/abs/1910.01279",
                },
                {
                  authors: "Abnar, S., & Zuidema, W.",
                  year: 2020,
                  title: "Quantifying Attention Flow in Transformers",
                  href: "https://arxiv.org/abs/2005.00928",
                },
              ]}
            />
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
