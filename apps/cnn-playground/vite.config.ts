import { defineConfig } from "vite";
import { defineAppConfig } from "@explorables/vite-config";

export default defineConfig(
  defineAppConfig({ slug: "cnn-playground", port: 5502 }),
);
