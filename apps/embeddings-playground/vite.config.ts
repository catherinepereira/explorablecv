import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { defineAppConfig } from "@explorables/vite-config";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig(
  defineAppConfig({
    slug: "embeddings-playground",
    port: 5511,
    alias: { "@": srcDir },
  }),
);
