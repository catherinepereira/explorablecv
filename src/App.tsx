import { useEffect, useState } from 'react'
import type { Manifest, Sample } from './types'
import { SampleStrip } from './components/SampleStrip'
import { LayerStack } from './components/LayerStack'
import { Predictions } from './components/Predictions'
import { StatsPanel } from './components/StatsPanel'
import { SiteHeader } from './components/SiteHeader'

const MANIFEST_URL = `${import.meta.env.BASE_URL}activations/manifest.json`
const ASSET_BASE = `${import.meta.env.BASE_URL}activations/`
const REPO_URL = 'https://github.com/catherinepereira/cnn-from-scratch-model'

export function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    fetch(MANIFEST_URL)
      .then((r) => r.json())
      .then(setManifest)
      .catch(() => setManifest(null))
  }, [])

  if (!manifest) {
    return (
      <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
        <div className="p-8 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-3 font-display">CNN Visualizer</h1>
          <p className="text-gray-600 dark:text-zinc-400">
            No exported activations found. From the sibling repo:
          </p>
          <pre className="mt-3 bg-gray-100 dark:bg-zinc-800 p-3 rounded text-sm font-mono whitespace-pre-wrap">
{`cd cnn-from-scratch-model
python train.py --out checkpoints/run1
python scripts/export_activations.py --ckpt checkpoints/run1/best.pt --out ../cnn-visualizer/public/activations`}
          </pre>
        </div>
      </div>
    )
  }

  const sample: Sample = manifest.samples[selected]

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <SiteHeader title="CNN Visualizer" repo="cnn-visualizer" modelRepo="cnn-from-scratch-model">
          A small CNN, trained on{' '}
          <a
            href="https://www.cs.toronto.edu/~kriz/cifar.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100"
          >
            CIFAR-10
          </a>
          . Pick an image and watch it move through the network. Each row is
          the feature maps a layer produced.
        </SiteHeader>

        {manifest.stats && (
          <section className="mb-8">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-zinc-500 mb-2">Model performance</h2>
            <StatsPanel stats={manifest.stats} />
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-zinc-500 mb-2">Sample image</h2>
          <SampleStrip
            samples={manifest.samples}
            selected={selected}
            onSelect={setSelected}
            assetBase={ASSET_BASE}
          />
        </section>

        <section className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
          <div>
            <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-zinc-500 mb-3">Layer activations</h2>
            <LayerStack sample={sample} assetBase={ASSET_BASE} repoUrl={REPO_URL} />
          </div>
          <aside className="md:sticky md:top-6">
            <h2 className="text-sm uppercase tracking-wide text-gray-500 dark:text-zinc-500 mb-3">Prediction</h2>
            <Predictions sample={sample} classes={manifest.classes} />
          </aside>
        </section>

        <footer className="mt-12 text-sm text-gray-500 dark:text-zinc-500 border-t border-gray-200 dark:border-zinc-800 pt-6 space-y-3">
          <p className="text-xs text-gray-400 dark:text-zinc-600">
            Dataset: Krizhevsky, A. (2009).{' '}
            <a
              href="https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-600 dark:hover:text-zinc-400"
            >
              <em>Learning Multiple Layers of Features from Tiny Images</em>
            </a>
            . Technical Report, University of Toronto.
          </p>
        </footer>
      </div>
    </div>
  )
}
