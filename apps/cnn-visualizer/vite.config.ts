import { defineConfig } from "vite";
import { defineAppConfig } from "@explorables/vite-config";

export default defineConfig(
  defineAppConfig({ slug: "cnn-visualizer", port: 5502 }),
);
