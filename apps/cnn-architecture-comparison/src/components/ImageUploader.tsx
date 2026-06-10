import { useState } from "react";
import { imageToTensor } from "../utils/preprocess";
import { useAppStore } from "../stores/appStore";
import { UploadButton } from "@explorables/ui/UploadButton";

const SAMPLE_IMAGES = [
  { label: "Cat", url: "/samples/cat.png" },
  { label: "Dog", url: "/samples/dog.png" },
  { label: "Truck", url: "/samples/truck.png" },
  { label: "Ship", url: "/samples/ship.png" },
  { label: "Airplane", url: "/samples/airplane.png" },
  { label: "Horse", url: "/samples/horse.png" },
];

export function ImageUploader() {
  const setImage = useAppStore((s) => s.setImage);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    try {
      const tensor = await imageToTensor(file);
      const url = URL.createObjectURL(file);
      setImage(url, tensor);
    } finally {
      setBusy(false);
    }
  }

  async function handleSample(url: string) {
    setBusy(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const file = new File([blob], "sample", { type: blob.type });
      await handleFile(file);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
      <div className="flex flex-wrap items-center gap-2">
        <UploadButton onFile={(f) => void handleFile(f)} busy={busy} />
        <span className="text-sm text-gray-600 dark:text-zinc-400">
          or try a sample:
        </span>
        {SAMPLE_IMAGES.map((s) => (
          <button
            key={s.url}
            onClick={() => handleSample(s.url)}
            disabled={busy}
            className="rounded-sm border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:border-blue-600 hover:text-gray-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-blue-400 dark:hover:text-zinc-100"
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-zinc-500">
        Images are resized to 32×32 and normalized with CIFAR-10 stats.
      </p>
    </div>
  );
}
