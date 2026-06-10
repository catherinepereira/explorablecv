import { defineConfig } from "vite";
import { defineAppConfig } from "@explorables/vite-config";

export default defineConfig(
  defineAppConfig({ slug: "bpe-playground", port: 5501 }),
);
