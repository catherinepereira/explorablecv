import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { UserConfig } from "vite";

type AppConfigOptions = {
  // Folder name and URL path prefix: the app is served at /<slug>/
  slug: string;
  // Dev server port, unique per app so several can run at once
  port: number;
  // Packages Vite must not pre-bundle, e.g. wasm-shipping ONNX runtimes
  optimizeDepsExclude?: string[];
  // Path aliases, e.g. { "@": "/abs/path/to/src" } for apps that import via @/
  alias?: Record<string, string>;
};

export function defineAppConfig({
  slug,
  port,
  optimizeDepsExclude,
  alias,
}: AppConfigOptions): UserConfig {
  return {
    // Absolute prefix so asset URLs are /<slug>/assets/... regardless of a
    // trailing slash. The hub matches that prefix and rewrites to the app,
    // which serves its assets at its own root
    base: `/${slug}/`,
    plugins: [react(), tailwindcss()],
    server: {
      port,
      strictPort: true,
    },
    ...(alias ? { resolve: { alias } } : {}),
    ...(optimizeDepsExclude
      ? { optimizeDeps: { exclude: optimizeDepsExclude } }
      : {}),
  };
}
