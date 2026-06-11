import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { UserConfig } from "vite";

type AppConfigOptions = {
  // Folder name, used for the dev URL and to keep ports/labels consistent
  slug: string;
  // Dev server port, unique per app so several can run at once
  port: number;
  // Packages Vite must not pre-bundle, e.g. wasm-shipping ONNX runtimes
  optimizeDepsExclude?: string[];
  // Path aliases, e.g. { "@": "/abs/path/to/src" } for apps that import via @/
  alias?: Record<string, string>;
};

export function defineAppConfig({
  port,
  optimizeDepsExclude,
  alias,
}: AppConfigOptions): UserConfig {
  return {
    // Relative asset paths so the build works served at root (the app's own
    // Vercel URL) or under the proxy's /<slug>/ prefix. These demos have no
    // client-side router, so relative base has no routing downside
    base: "./",
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
