import { defineConfig } from "vite";
import { defineAppConfig } from "@explorables/vite-config";

export default defineConfig(
  defineAppConfig({ slug: "cv-interpretability", port: 5504 }),
);
