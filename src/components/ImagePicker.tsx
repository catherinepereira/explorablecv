import { useEffect } from "react";
import type { Matrix } from "../lib/conv";
import { generatedPattern, imageToGrayscale, loadImage } from "../lib/image";
import { UploadButton } from "./UploadButton";

interface Props {
  size: number;
  /** Called with the new matrix, an id (preset id or "upload"), and a human label */
  onChange: (m: Matrix, id: string, label: string) => void;
  value: string;
}

const PRESETS: { id: string; label: string; kind: "pattern" | "url"; arg: string }[] = [
  { id: "checker", label: "Checkerboard", kind: "pattern", arg: "checker" },
  { id: "circle", label: "Circle", kind: "pattern", arg: "circle" },
  { id: "stripes", label: "Stripes", kind: "pattern", arg: "stripes" },
];

export function ImagePicker({ size, onChange, value }: Props) {
  useEffect(() => {
    const p = PRESETS.find((p) => p.id === value);
    if (!p) return;
    if (p.kind === "pattern") {
      onChange(generatedPattern(p.arg as "checker" | "circle" | "stripes", size), p.id, p.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, size]);

  function handleFile(file: File) {
    const url = URL.createObjectURL(file);
    loadImage(url).then((img) => {
      onChange(imageToGrayscale(img, size), "upload", file.name);
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.map((p) => (
        <button
          key={p.id}
          onClick={() => {
            if (p.kind === "pattern") {
              onChange(generatedPattern(p.arg as "checker" | "circle" | "stripes", size), p.id, p.label);
            }
          }}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors cursor-pointer ${
            value === p.id ? "bg-blue-600 dark:bg-blue-500 text-white border-blue-600 dark:border-blue-500" : "bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/40"
          }`}
        >
          {p.label}
        </button>
      ))}
      <UploadButton onFile={handleFile} />
    </div>
  );
}
