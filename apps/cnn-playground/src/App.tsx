import { useState } from "react";
import { SingleConvMode } from "./sections/SingleConvMode";
import { PlaygroundMode } from "./sections/PlaygroundMode";
import { MultiLayerMode } from "./sections/MultiLayerMode";
import { SiteHeader } from "./components/SiteHeader";
import { SeriesNav } from "./components/SeriesNav";
import { Section } from "./components/Section";
import { References } from "./components/References";

type Tab = "single" | "playground" | "multi";

const TABS: {
  id: Tab;
  label: string;
  number: string;
  title: string;
  blurb: string;
}[] = [
  {
    id: "single",
    label: "Single Conv",
    number: "01",
    title: "Single convolution",
    blurb:
      "Watch a kernel slide over an image and see the output build up cell by cell.",
  },
  {
    id: "playground",
    label: "Playground",
    number: "02",
    title: "Kernel playground",
    blurb:
      "Edit kernel values, change stride and padding, and see the output update live.",
  },
  {
    id: "multi",
    label: "Multi-Layer",
    number: "03",
    title: "Multi-layer stack",
    blurb:
      "Stack convolution layers with ReLU and pooling to see how feature maps evolve.",
  },
];

const REFERENCES = [
  {
    authors: "LeCun, Y., Bottou, L., Bengio, Y., & Haffner, P.",
    year: 1998,
    title: "Gradient-Based Learning Applied to Document Recognition",
    href: "http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf",
  },
  {
    authors: "Dumoulin, V., & Visin, F.",
    year: 2016,
    title: "A Guide to Convolution Arithmetic for Deep Learning",
    href: "https://arxiv.org/abs/1603.07285",
  },
  {
    authors: "Krizhevsky, A., Sutskever, I., & Hinton, G. E.",
    year: 2012,
    title: "ImageNet Classification with Deep Convolutional Neural Networks",
    href: "https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html",
  },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("single");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <SiteHeader title="🖍️ CNN Playground" repo="cnn-playground">
          A{" "}
          <a
            href="https://en.wikipedia.org/wiki/Convolutional_neural_network"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 underline hover:text-gray-900 dark:text-zinc-300 dark:hover:text-zinc-100"
          >
            convolution
          </a>{" "}
          slides a small kernel of weights across an image, multiplies
          elementwise, and sums to produce one output pixel. Stack convolutions
          with ReLU and pooling, and you have a CNN. Pick a preset kernel or
          hand-edit one to see how it shapes the output, then move up to
          multi-layer mode to watch feature maps build on each other.
        </SiteHeader>

        <SeriesNav currentSlug="cnn-playground" />

        <main className="mt-12 flex flex-col gap-12">
          <div className="flex w-fit items-center rounded-lg bg-gray-100 p-0.5 text-sm dark:bg-zinc-800">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`cursor-pointer rounded-md px-4 py-1.5 transition-colors ${
                  tab === t.id
                    ? "bg-white font-medium text-gray-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                    : "text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <Section
            number={active.number}
            title={active.title}
            blurb={active.blurb}
          >
            {tab === "single" && <SingleConvMode />}
            {tab === "playground" && <PlaygroundMode />}
            {tab === "multi" && <MultiLayerMode />}
          </Section>

          <References items={REFERENCES} />
        </main>
      </div>
    </div>
  );
}
