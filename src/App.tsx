import { ARCHITECTURES } from './architectures/data'
import { ArchDetail } from './components/ArchDetail'
import { ImageUploader } from './components/ImageUploader'
import { PredictionStrip } from './components/PredictionStrip'
import { SiteHeader } from './components/SiteHeader'
import { Timeline } from './components/Timeline'
import { useRunAll } from './hooks/useRunAll'
import { useAppStore } from './stores/appStore'

export function App() {
  useRunAll()
  const imageUrl = useAppStore((s) => s.imageUrl)
  const selectedId = useAppStore((s) => s.selectedArchId)
  const selected = ARCHITECTURES.find((a) => a.id === selectedId)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="max-w-7xl mx-auto w-full px-6 py-8">
        <SiteHeader
          title="CNN Architecture Comparison"
          repo="cnn-architecture-comparison"
          modelRepo="cnn-architecture-comparison-model"
        >
          Six landmark CNN architectures from{" "}
          <a
            href="http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100"
          >
            LeNet
          </a>{" "}
          (1998) to{" "}
          <a
            href="https://arxiv.org/abs/1608.06993"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-gray-700 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-zinc-100"
          >
            DenseNet
          </a>{" "}
          (2016), each trained on CIFAR-10 and exported to ONNX. Click any
          architecture for its diagram, parameters, and the problem it solved.
          Upload an image to see all six predict the class side by side, with
          their intermediate feature maps. All inference runs client-side via
          ONNX Runtime Web.
        </SiteHeader>

        <main className="flex flex-col gap-6">
        <ImageUploader />

        {imageUrl && (
          <div className="flex items-center gap-4">
            <img
              src={imageUrl}
              alt="input"
              className="w-24 h-24 object-cover rounded-md border border-gray-200 dark:border-zinc-800"
            />
            <div className="text-sm text-gray-600 dark:text-zinc-400">
              Resized to 32×32 and fed into all six networks.
            </div>
          </div>
        )}

        <Timeline />

        {imageUrl && <PredictionStrip />}
        {selected && <ArchDetail arch={selected} />}
        </main>

        <footer className="mt-12 text-xs text-gray-500 dark:text-zinc-500 border-t border-gray-200 dark:border-zinc-800 pt-6">
          <p>
            Dataset: Krizhevsky, A. (2009).{' '}
            <a
              href="https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700 dark:hover:text-zinc-300"
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
