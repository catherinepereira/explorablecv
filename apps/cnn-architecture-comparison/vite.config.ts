import { defineConfig } from "vite";
import { defineAppConfig } from "@explorables/vite-config";

export default defineConfig(
  defineAppConfig({
    slug: "cnn-architecture-comparison",
    port: 5504,
    optimizeDepsExclude: ["onnxruntime-web"],
  }),
);
