import { useEffect, useState } from 'react'
import type { Manifest, Sample } from './types'
import { SampleStrip } from './components/SampleStrip'
import { LayerStack } from './components/LayerStack'
import { Predictions } from './components/Predictions'
import { StatsPanel } from './components/StatsPanel'
import { SiteHeader } from './components/SiteHeader'
import { SeriesNav } from './components/SeriesNav'
import { Section, Label } from './components/Section'
import { References } from './components/References'

const MANIFEST_URL = `${import.meta.env.BASE_URL}activations/manifest.json`
const ASSET_BASE = `${import.meta.env.BASE_URL}activations/`
const REPO_URL = 'https://github.com/catherinepereira/cnn-from-scratch-model'

const KRIZHEVSKY_2009 = {
  authors: 'Krizhevsky, A.',
  year: 2009,
  title: 'Learning Multiple Layers of Features from Tiny Images',
  href: 'https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf',
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto px-6 py-8">{children}</div>
    </div>
  )
}

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
      <Shell>
        <SiteHeader title="🖼️ CNN Visualizer" repo="cnn-visualizer" modelRepo="cnn-from-scratch-model" />
        <main className="flex flex-col gap-10 mt-2">
          <p className="text-gray-600 dark:text-zinc-400">
            No exported activations found. From the sibling repo:
          </p>
          <pre className="bg-gray-100 dark:bg-zinc-800 p-3 rounded text-sm font-mono whitespace-pre-wrap">
{`cd cnn-from-scratch-model
python train.py --out checkpoints/run1
python scripts/export_activations.py --ckpt checkpoints/run1/best.pt --out ../cnn-visualizer/public/activations`}
          </pre>
        </main>
      </Shell>
    )
  }

  const sample: Sample = manifest.samples[selected]

  return (
    <Shell>
      <SiteHeader title="🖼️ CNN Visualizer" repo="cnn-visualizer" modelRepo="cnn-from-scratch-model">
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

      <SeriesNav currentSlug="cnn-visualizer" />

      <main className="flex flex-col gap-10 mt-2">
        {manifest.stats && (
          <Section id="performance" number="01" title="Model performance">
            <StatsPanel stats={manifest.stats} />
          </Section>
        )}

        <Section id="sample" number={manifest.stats ? '02' : '01'} title="Sample image">
          <SampleStrip
            samples={manifest.samples}
            selected={selected}
            onSelect={setSelected}
            assetBase={ASSET_BASE}
          />
        </Section>

        <Section id="activations" number={manifest.stats ? '03' : '02'} title="Layer activations">
          <div className="grid md:grid-cols-[1fr_360px] gap-8 items-start">
            <LayerStack sample={sample} assetBase={ASSET_BASE} repoUrl={REPO_URL} />
            <aside className="md:sticky md:top-6">
              <Label>Prediction</Label>
              <Predictions sample={sample} classes={manifest.classes} />
            </aside>
          </div>
        </Section>

        <References items={[KRIZHEVSKY_2009]} />
      </main>
    </Shell>
  )
}
