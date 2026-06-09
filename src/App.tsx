import { ARCHITECTURES } from "./architectures/data";
import { ArchFeatureMaps, ArchOverview } from "./components/ArchDetail";
import { ImageUploader } from "./components/ImageUploader";
import { PredictionStrip } from "./components/PredictionStrip";
import { References, type Reference } from "./components/References";
import { Section } from "./components/Section";
import { SeriesNav } from "./components/SeriesNav";
import { SiteHeader } from "./components/SiteHeader";
import { Timeline } from "./components/Timeline";
import { useRunAll } from "./hooks/useRunAll";
import { useAppStore } from "./stores/appStore";

const REFERENCES: Reference[] = [
  {
    authors: "Krizhevsky, A.",
    year: 2009,
    title: "Learning Multiple Layers of Features from Tiny Images",
    href: "https://www.cs.toronto.edu/~kriz/learning-features-2009-TR.pdf",
  },
  {
    authors: "LeCun, Bottou, Bengio, Haffner",
    year: 1998,
    title: "Gradient-Based Learning Applied to Document Recognition",
    href: "http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf",
  },
  {
    authors: "Krizhevsky, Sutskever, Hinton",
    year: 2012,
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    href: "https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
  },
  {
    authors: "Simonyan & Zisserman",
    year: 2014,
    title: "Very Deep Convolutional Networks for Large-Scale Image Recognition",
    href: "https://arxiv.org/abs/1409.1556",
  },
  {
    authors: "Szegedy et al.",
    year: 2014,
    title: "Going Deeper with Convolutions",
    href: "https://arxiv.org/abs/1409.4842",
  },
  {
    authors: "He, Zhang, Ren, Sun",
    year: 2015,
    title: "Deep Residual Learning for Image Recognition",
    href: "https://arxiv.org/abs/1512.03385",
  },
  {
    authors: "Huang, Liu, van der Maaten, Weinberger",
    year: 2016,
    title: "Densely Connected Convolutional Networks",
    href: "https://arxiv.org/abs/1608.06993",
  },
];

export function App() {
  useRunAll();
  const imageUrl = useAppStore((s) => s.imageUrl);
  const selectedId = useAppStore((s) => s.selectedArchId);
  const selected = ARCHITECTURES.find((a) => a.id === selectedId);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <SiteHeader
          title="🕰️ CNN Architecture Comparison"
          repo="cnn-architecture-comparison"
        >
          Six landmark CNN architectures from{" "}
          <a
            href="http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 underline hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            LeNet
          </a>{" "}
          (1998) to{" "}
          <a
            href="https://arxiv.org/abs/1608.06993"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 underline hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            DenseNet
          </a>{" "}
          (2016), each trained on CIFAR-10 and exported to ONNX. Click any
          architecture for its diagram, parameters, and the problem it solved.
          Upload an image to see all six predict the class side by side, with
          their intermediate feature maps. All inference runs client-side via{" "}
          <a
            href="https://onnxruntime.ai/docs/tutorials/web/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 underline hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            ONNX Runtime Web
          </a>
          .
        </SiteHeader>

        <SeriesNav currentSlug="cnn-architecture-comparison" />

        <main className="mt-12 flex flex-col gap-12">
          <Section
            id="timeline"
            number="01"
            title="Timeline"
            blurb="Six landmark CNNs in the order they appeared. Select one to see what it changed."
          >
            <Timeline />
            {selected && <ArchOverview arch={selected} />}
          </Section>

          <Section
            id="predictions"
            number="02"
            title="Run the networks"
            blurb="Upload an image or pick a sample. It is resized to 32×32 and run through all six networks. Models are smaller CIFAR-10 variants of each architecture."
          >
            <ImageUploader />

            {imageUrl && (
              <div className="flex items-center gap-4">
                <img
                  src={imageUrl}
                  alt="input"
                  className="h-24 w-24 rounded-md border border-gray-200 object-cover dark:border-zinc-800"
                />
                <div className="text-sm text-gray-600 dark:text-zinc-400">
                  Resized to 32×32 and fed into all six networks.
                </div>
              </div>
            )}

            {imageUrl && <PredictionStrip />}
            {selected && <ArchFeatureMaps arch={selected} />}
          </Section>

          <References items={REFERENCES} />
        </main>
      </div>
    </div>
  );
}
