import { useEffect } from "react";

import { InterpretabilityTabs } from "./components/InterpretabilityTabs";
import { SiteHeader } from "./components/SiteHeader";
import { StatsBar } from "./components/StatsBar";
import { UMAPPanel } from "./components/UMAPPanel";
import { useDataset } from "./hooks/useDataset";
import { useExplorerStore } from "./stores/useExplorerStore";

function Loading({ message }: { message: string }) {
  return (
    <div className="text-sm text-gray-500 dark:text-zinc-500 py-12 text-center">
      {message}
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400 p-4 text-sm">
      <div className="font-medium mb-1">Could not load data</div>
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SiteHeader
          title="CV Interpretability Explorer"
          repo="cv-interpretability"
          modelRepo="cv-interpretability-model"
        >
          Compare three{" "}
          <a
            href="https://github.com/fastai/imagenette"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 dark:text-zinc-400 underline"
          >
            ImageNette
          </a>{" "}
          classifiers (Custom CNN, ResNet-18, ViT-S) through five
          interpretability methods and their penultimate-layer UMAP
          projections.
        </SiteHeader>

        {state.status === "loading" && <Loading message="Loading dataset..." />}
        {state.status === "error" && <ErrorState message={state.error} />}
        {state.status === "ready" && (
          <main className="flex flex-col gap-6 mt-2">
            <StatsBar stats={state.data.modelStats} />
            <InterpretabilityTabs
              classes={state.data.classes}
              samples={state.data.samples}
              cams={state.data.cams}
              lime={state.data.lime}
              rollout={state.data.rollout}
            />
            <UMAPPanel classes={state.data.classes} umap={state.data.umap} />
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
