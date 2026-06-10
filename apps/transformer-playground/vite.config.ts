import { defineConfig } from "vite";
import { defineAppConfig } from "@explorables/vite-config";

export default defineConfig(
  defineAppConfig({
    slug: "transformer-playground",
    port: 5506,
    optimizeDepsExclude: ["@huggingface/transformers", "onnxruntime-web"],
  }),
);
